/** Appointment Booking Page - doctor directory + Patna ward suggestions + Lab Tests */
export function renderBooking(app, { hospitals, sync, navigate }) {
  const specialties = hospitals.getSpecialties();
  const labCategories = hospitals.getLabTestCategories ? hospitals.getLabTestCategories() : ['All'];
  const blocks = hospitals.getBlocks();
  const today = new Date();

  let bookingType = sessionStorage.getItem('mc_booking_type') || 'opd'; // 'opd' or 'lab'
  sessionStorage.removeItem('mc_booking_type'); // clear once read

  let step = 1;
  let selectedSpecialty = 'General';
  let selectedTest = 'All';
  let selectedWardId = '';
  let wardQuery = '';
  let selectedDoctorId = '';
  let selectedLabId = '';
  let selectedSlot = '';

  function render() {
    const wardMatches = hospitals.getWardSuggestions(wardQuery);
    const selectedWard = hospitals.getWardById(selectedWardId);
    
    const items = bookingType === 'opd' 
      ? hospitals.getDoctors({ specialty: selectedSpecialty, wardId: selectedWardId })
      : (hospitals.getDiagnosticLabs ? hospitals.getDiagnosticLabs({ test: selectedTest, wardId: selectedWardId }) : []);
      
    const selectedItem = bookingType === 'opd' 
      ? hospitals.getDoctorById(selectedDoctorId)
      : (hospitals.getLabById ? hospitals.getLabById(selectedLabId) : null);
      
    const selectedHospital = bookingType === 'opd' ? selectedItem?.hospital : selectedItem;
    const slots = getSlots(selectedItem);
    
    const canFindItems = Boolean(selectedWardId);
    const canPickSlot = bookingType === 'opd' ? Boolean(selectedDoctorId) : Boolean(selectedLabId);
    const canConfirm = canPickSlot && Boolean(selectedSlot);

    app.innerHTML = `
    <div class="page-enter">
      <main class="container" style="padding-top:1.5rem;padding-bottom:2rem">
        <section style="margin-bottom:2rem">
          <div style="display:flex;gap:1rem;margin-bottom:1.5rem;background:var(--surface-container-highest);padding:0.5rem;border-radius:var(--radius-lg);width:max-content">
            <button class="chip ${bookingType === 'opd' ? 'active' : ''}" data-btype="opd" style="border:none;box-shadow:none">Doctor OPD</button>
            <button class="chip ${bookingType === 'lab' ? 'active' : ''}" data-btype="lab" style="border:none;box-shadow:none">Lab Test</button>
          </div>
          <span class="label-md text-primary" style="display:block;margin-bottom:0.5rem">Step 0${step} of 03</span>
          <h2 style="font-size:clamp(2rem,6vw,2.75rem);font-weight:800;letter-spacing:-0.02em;line-height:1.08">
            ${step === 1 ? (bookingType === 'opd' ? 'Find a real <br><span style="color:var(--primary-container)">Patna OPD.</span>' : 'Find a nearby <br><span style="color:var(--primary-container)">Lab Test.</span>') 
            : step === 2 ? (bookingType === 'opd' ? 'Choose your <br><span style="color:var(--primary-container)">doctor.</span>' : 'Choose your <br><span style="color:var(--primary-container)">diagnostic center.</span>') 
            : 'Confirm your <br><span style="color:var(--primary-container)">visit.</span>'}
          </h2>
          <p class="text-on-surface-variant" style="margin-top:1rem;line-height:1.6;max-width:42rem">${step === 1 ? 'Select your requirement and PMC ward or locality.' : step === 2 ? 'Cards show public-directory names, timing, and area fit.' : 'Pick a slot for this app.'}</p>
        </section>

        <div class="stepper" style="margin-bottom:2rem">
          <div class="stepper-bar ${step >= 1 ? 'active' : ''}"></div>
          <div class="stepper-bar ${step >= 2 ? 'active' : ''}"></div>
          <div class="stepper-bar ${step >= 3 ? 'active' : ''}"></div>
        </div>

        ${step === 1 ? renderSearchStep(wardMatches, selectedWard, canFindItems) : ''}
        ${step === 2 ? renderListStep(items, selectedWard, canPickSlot) : ''}
        ${step === 3 ? renderSlotStep(selectedItem, selectedHospital, selectedWard, slots, canConfirm) : ''}
      </main>
    </div>`;

    bindEvents();
  }

  function renderSearchStep(wardMatches, selectedWard, canFindItems) {
    const isOpd = bookingType === 'opd';
    return `
    <div style="display:grid;grid-template-columns:minmax(0,1fr) 22rem;gap:1.5rem;align-items:start" class="booking-layout">
      <section class="card" style="display:flex;flex-direction:column;gap:1.75rem">
        <div>
          <label class="label-md" style="display:block;margin-bottom:1rem;color:var(--on-surface)">${isOpd ? 'Specialty' : 'Test Category'}</label>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
            ${isOpd 
              ? specialties.map(s => `<button class="chip ${s === selectedSpecialty ? 'active' : ''}" data-spec="${s}">${s}</button>`).join('')
              : labCategories.map(s => `<button class="chip ${s === selectedTest ? 'active' : ''}" data-test="${s}">${s}</button>`).join('')}
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem" class="booking-selects">
          <div class="input-group">
            <label class="input-label">District</label>
            <div class="input-wrap">
              <select class="input-field" style="padding-left:1rem;cursor:pointer"><option>Patna</option></select>
              <span class="material-symbols-outlined" style="left:auto;right:1rem">expand_more</span>
            </div>
          </div>
          <div class="input-group">
            <label class="input-label">Block / Circle</label>
            <div class="input-wrap">
              <select class="input-field" id="blockSelect" style="padding-left:1rem;cursor:pointer">
                ${blocks.map(b => `<option ${selectedWard?.block === b ? 'selected' : ''}>${b}</option>`).join('')}
              </select>
              <span class="material-symbols-outlined" style="left:auto;right:1rem">expand_more</span>
            </div>
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">Panchayat / Ward Number</label>
          <div class="input-wrap">
            <span class="material-symbols-outlined filled" style="color:var(--primary-container)">location_on</span>
            <input class="input-field" id="wardInput" value="${escapeHtml(wardQuery)}" placeholder="Try Kankarbagh, Ward 32, PMCH, Phulwari..." autocomplete="off" style="padding:1.25rem 1rem 1.25rem 3rem">
          </div>
          <div style="display:grid;gap:0.5rem;margin-top:0.75rem">
            ${wardMatches.map(w => `
            <button class="ward-suggestion ${selectedWardId === w.id ? 'active' : ''}" data-ward="${w.id}" type="button">
              <span class="material-symbols-outlined" style="color:var(--primary);font-size:20px">distance</span>
              <span style="flex:1;text-align:left">
                <strong>${w.ward} - ${w.label}</strong>
                <small>${w.circle} - ${w.block} - PIN ${w.pin}</small>
              </span>
            </button>`).join('')}
          </div>
        </div>

        <button class="btn-primary" id="bookingNext" style="height:4rem;font-size:1.05rem${!canFindItems ? ';opacity:0.5;cursor:not-allowed' : ''}" ${!canFindItems ? 'disabled' : ''}>
          Find Available ${isOpd ? 'Doctors' : 'Labs'} <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </section>

      <aside class="card-flat" style="display:flex;flex-direction:column;gap:1rem">
        <div style="display:flex;align-items:center;gap:0.75rem">
          <span class="material-symbols-outlined filled" style="color:var(--primary)">verified</span>
          <h3 style="font-weight:800">Real data mode</h3>
        </div>
        <p style="font-size:14px;color:var(--on-surface-variant);line-height:1.55">Suggestions are stored locally from public directories. Appointment slots are app-side booking holds, not live hospital inventory.</p>
        ${selectedWard ? `
        <div style="padding:1rem;background:var(--surface-container-lowest);border-radius:var(--radius-lg)">
          <p class="label-sm text-primary">Selected area</p>
          <h4 style="font-weight:800;margin-top:0.25rem">${selectedWard.ward}</h4>
          <p style="font-size:13px;color:var(--on-surface-variant)">${selectedWard.label}</p>
        </div>` : ''}
      </aside>
    </div>`;
  }

  function renderListStep(items, selectedWard, canPickSlot) {
    const isOpd = bookingType === 'opd';
    return `
    <div style="display:flex;flex-direction:column;gap:1rem">
      <div class="card-flat" style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
        <div>
          <p class="label-sm text-primary">Search match</p>
          <h3 style="font-size:1.25rem;font-weight:800">${isOpd ? selectedSpecialty : selectedTest} near ${selectedWard?.label || 'Patna'}</h3>
          <p style="font-size:13px;color:var(--on-surface-variant)">${items.length} option(s) found</p>
        </div>
        <button class="btn-secondary" id="bookingBack" style="width:auto;padding:0.75rem 1rem">Change Search</button>
      </div>

      <div class="doctor-grid">
        ${items.length ? items.map(isOpd ? renderDoctorCard : renderLabCard).join('') : renderNoItems()}
      </div>

      <div style="display:flex;gap:1rem;margin-top:1rem">
        <button class="btn-secondary" id="bookingBackBottom" style="flex:1">Back</button>
        <button class="btn-primary" id="bookingNext" style="flex:2${!canPickSlot ? ';opacity:0.5;cursor:not-allowed' : ''}" ${!canPickSlot ? 'disabled' : ''}>Select Time Slot <span class="material-symbols-outlined">arrow_forward</span></button>
      </div>
    </div>`;
  }

  function renderDoctorCard(doctor) {
    const h = doctor.hospital;
    const status = getStatus(h.opd.status);
    const selected = selectedDoctorId === doctor.id;
    return `
    <button class="doctor-card ${selected ? 'active' : ''}" data-doctor="${doctor.id}" type="button">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem">
        <div>
          <p class="label-sm text-primary">${doctor.specialty}</p>
          <h3 style="font-size:1.15rem;font-weight:850;margin-top:0.2rem">${doctor.name}</h3>
          <p style="font-size:13px;color:var(--on-surface-variant);margin-top:0.25rem">${doctor.designation}</p>
        </div>
        <span class="material-symbols-outlined" style="color:${selected ? 'var(--primary)' : 'var(--outline)'}">${selected ? 'check_circle' : 'radio_button_unchecked'}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:0.6rem;margin-top:1rem;text-align:left">
        <span class="doctor-meta"><span class="material-symbols-outlined">local_hospital</span>${h.name}</span>
        <span class="doctor-meta"><span class="material-symbols-outlined">schedule</span>${doctor.opdDays}, ${doctor.opdTime}</span>
        <span class="doctor-meta"><span class="material-symbols-outlined">meeting_room</span>${doctor.room}</span>
        <span class="doctor-meta"><span class="material-symbols-outlined">payments</span>${doctor.feeNote}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;margin-top:1rem;flex-wrap:wrap">
        <span class="badge ${status.cls}">${status.label}</span>
        <span class="badge badge-neutral">${doctor.areaMatch}</span>
      </div>
    </button>`;
  }

  function renderLabCard(lab) {
    const selected = selectedLabId === lab.id;
    return `
    <button class="doctor-card ${selected ? 'active' : ''}" data-lab="${lab.id}" type="button">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem">
        <div>
          <p class="label-sm text-primary">${lab.type}</p>
          <h3 style="font-size:1.15rem;font-weight:850;margin-top:0.2rem">${lab.name}</h3>
          <p style="font-size:13px;color:var(--on-surface-variant);margin-top:0.25rem">${lab.address}</p>
        </div>
        <span class="material-symbols-outlined" style="color:${selected ? 'var(--primary)' : 'var(--outline)'}">${selected ? 'check_circle' : 'radio_button_unchecked'}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:0.6rem;margin-top:1rem;text-align:left">
        <span class="doctor-meta"><span class="material-symbols-outlined">schedule</span>${lab.timings}</span>
        <span class="doctor-meta"><span class="material-symbols-outlined">call</span>${lab.phone}</span>
        <span class="doctor-meta"><span class="material-symbols-outlined">science</span>${lab.tests.length} test types available</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;margin-top:1rem;flex-wrap:wrap">
        ${lab.tags.map(t => `<span class="badge badge-primary">${t}</span>`).join('')}
        <span class="badge badge-neutral">${lab.areaMatch}</span>
      </div>
    </button>`;
  }

  function renderNoItems() {
    return `
    <div class="card" style="grid-column:1/-1;text-align:center">
      <span class="material-symbols-outlined" style="font-size:2.5rem;color:var(--outline);margin-bottom:0.75rem">person_search</span>
      <h3 style="font-weight:800">No match for this selection yet</h3>
      <p style="color:var(--on-surface-variant);margin-top:0.35rem">Try broadening your search.</p>
    </div>`;
  }

  function renderSlotStep(item, hospital, selectedWard, slots, canConfirm) {
    if (!item || !hospital) {
      step = 2;
      return '';
    }

    const isOpd = bookingType === 'opd';
    const status = isOpd ? getStatus(hospital.opd.status) : { label: 'Open', cls: 'badge-success' };
    
    return `
    <div style="display:grid;grid-template-columns:minmax(0,1fr) 22rem;gap:1.5rem;align-items:start" class="booking-layout">
      <section style="display:flex;flex-direction:column;gap:1.25rem">
        <div class="card" style="padding:2rem">
          <p class="label-sm text-primary">${isOpd ? item.specialty : item.type}</p>
          <h3 style="font-size:1.6rem;font-weight:850;margin-top:0.35rem">${item.name}</h3>
          <p style="color:var(--on-surface-variant);margin-top:0.3rem">${isOpd ? item.designation : item.address}</p>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:1rem">
            ${isOpd ? `<span class="badge badge-primary">${hospital.name}</span>` : ''}
            <span class="badge ${status.cls}">${status.label}</span>
            <span class="badge badge-neutral">${selectedWard?.ward || 'Patna'}</span>
          </div>
        </div>

        <div class="card-flat">
          <label class="label-md" style="color:var(--on-surface);display:block;margin-bottom:1rem">Available app slots</label>
          <div class="grid-3" style="gap:0.75rem">
            ${slots.map(s => `<button class="chip ${selectedSlot === s.time ? 'active' : ''}" data-slot="${s.time}" title="${s.note}">${s.time}<small style="display:block;width:100%;font-size:10px;opacity:0.75">${s.note}</small></button>`).join('')}
          </div>
        </div>

        <div style="display:flex;gap:1rem;margin-top:0.5rem">
          <button class="btn-secondary" id="bookingBack" style="flex:1">Back</button>
          <button class="btn-primary" id="bookingConfirm" style="flex:2${!canConfirm ? ';opacity:0.5;cursor:not-allowed' : ''}" ${!canConfirm ? 'disabled' : ''}>Confirm Booking <span class="material-symbols-outlined">check</span></button>
        </div>
      </section>

      <aside class="card-flat" style="display:flex;flex-direction:column;gap:1rem">
        <h3 style="font-weight:850">Visit alert</h3>
        <p style="font-size:14px;color:var(--on-surface-variant);line-height:1.55">${getAlert(hospital, item)}</p>
        <div style="padding:1rem;background:var(--surface-container-lowest);border-radius:var(--radius-lg)">
          <p class="label-sm text-primary">Contact</p>
          <p style="font-weight:800;margin-top:0.25rem">${hospital.phone}</p>
          <p style="font-size:13px;color:var(--on-surface-variant)">${isOpd ? hospital.address : item.address}</p>
        </div>
        <div class="badge badge-warning" style="width:max-content">Not emergency care</div>
      </aside>
    </div>`;
  }

  function bindEvents() {
    app.querySelectorAll('[data-btype]').forEach(el => el.addEventListener('click', () => {
      bookingType = el.dataset.btype;
      step = 1;
      selectedDoctorId = '';
      selectedLabId = '';
      selectedSlot = '';
      render();
    }));

    app.querySelectorAll('[data-spec]').forEach(el => el.addEventListener('click', () => {
      selectedSpecialty = el.dataset.spec;
      selectedDoctorId = '';
      selectedSlot = '';
      render();
    }));

    app.querySelectorAll('[data-test]').forEach(el => el.addEventListener('click', () => {
      selectedTest = el.dataset.test;
      selectedLabId = '';
      selectedSlot = '';
      render();
    }));

    const wardInput = document.getElementById('wardInput');
    wardInput?.addEventListener('input', (e) => {
      wardQuery = e.target.value;
      selectedWardId = '';
      selectedDoctorId = '';
      selectedLabId = '';
      selectedSlot = '';
      render();
      setTimeout(() => document.getElementById('wardInput')?.focus(), 0);
    });

    app.querySelectorAll('[data-ward]').forEach(el => el.addEventListener('click', () => {
      const ward = hospitals.getWardById(el.dataset.ward);
      selectedWardId = ward.id;
      wardQuery = `${ward.ward} - ${ward.label}`;
      selectedDoctorId = '';
      selectedLabId = '';
      selectedSlot = '';
      render();
    }));

    app.querySelectorAll('[data-doctor]').forEach(el => el.addEventListener('click', () => {
      selectedDoctorId = el.dataset.doctor;
      selectedSlot = '';
      render();
    }));

    app.querySelectorAll('[data-lab]').forEach(el => el.addEventListener('click', () => {
      selectedLabId = el.dataset.lab;
      selectedSlot = '';
      render();
    }));

    app.querySelectorAll('[data-slot]').forEach(el => el.addEventListener('click', () => {
      selectedSlot = el.dataset.slot;
      render();
    }));

    document.getElementById('bookingNext')?.addEventListener('click', () => {
      if (step === 1 && selectedWardId) step = 2;
      else if (step === 2 && (selectedDoctorId || selectedLabId)) step = 3;
      render();
    });

    document.getElementById('bookingBack')?.addEventListener('click', goBack);
    document.getElementById('bookingBackBottom')?.addEventListener('click', goBack);
    document.getElementById('bookingConfirm')?.addEventListener('click', confirmBooking);
  }

  function goBack() {
    step = Math.max(1, step - 1);
    render();
  }

  function confirmBooking() {
    const isOpd = bookingType === 'opd';
    const item = isOpd ? hospitals.getDoctorById(selectedDoctorId) : hospitals.getLabById(selectedLabId);
    
    if (!item || !selectedSlot) return;

    const hospitalName = isOpd ? item.hospital.name : item.name;

    const appt = {
      type: bookingType,
      specialty: isOpd ? item.specialty : selectedTest,
      hospital: isOpd ? item.hospitalId : item.id,
      hospitalName: hospitalName,
      doctorId: isOpd ? item.id : null,
      doctorName: item.name,
      slot: selectedSlot,
      wardId: selectedWardId,
      area: hospitals.getWardById(selectedWardId)?.label || 'Patna',
      date: today.toISOString()
    };

    if (sync.isOnline) console.log('[Booking] Confirmed:', appt);
    else sync.queueRequest('book_appointment', appt);

    let appts = [];
    try {
      appts = JSON.parse(localStorage.getItem('medicare_appointments') || '[]');
      if (!Array.isArray(appts)) appts = [];
    } catch {
      appts = [];
    }

    appts.push(appt);
    localStorage.setItem('medicare_appointments', JSON.stringify(appts));

    const toast = document.getElementById('global-toast');
    if (toast) {
      toast.textContent = `Booking hold: ${item.name}, ${selectedSlot}`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }
    navigate('dashboard');
  }

  function getSlots(item) {
    if (!item) return [];
    const isLab = bookingType === 'lab';
    const morning = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
    const privateSlots = ['10:00 AM', '10:40 AM', '11:20 AM', '12:00 PM', '2:30 PM', '3:10 PM', '3:50 PM'];
    
    let source;
    if (isLab) {
      source = ['7:00 AM', '8:00 AM', '9:30 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];
    } else {
      source = item.feeNote?.includes('Government') ? morning : privateSlots;
    }

    return source.map((time, index) => ({
      time,
      note: index < 2 ? 'High demand' : index < 5 ? 'Normal' : 'Last slot'
    }));
  }

  function getStatus(status) {
    const map = {
      available: { label: 'OPD available', cls: 'badge-success' },
      busy: { label: 'Crowded OPD', cls: 'badge-warning' },
      full: { label: 'Limited slots', cls: 'badge-danger' }
    };
    return map[status] || map.available;
  }

  function getAlert(hospital, item) {
    if (bookingType === 'lab') {
      return `${hospital.name} provides lab testing. Call ${hospital.phone} to confirm if fasting is required for your test.`;
    }
    if (hospital.type === 'Government') {
      return `${hospital.name} is a government OPD. Carry ID, old prescription if any, and arrive early because registration and counters may close before displayed OPD end time.`;
    }
    return `${hospital.name} is a private OPD. Call ${hospital.phone} to confirm consultation fee and doctor availability before starting from your ward.`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  render();
}
