/** Dashboard Page — with i18n support */
export function renderDashboard(app, { auth, hospitals, i18n, files, notifications, navigate }) {
  const t = i18n.t.bind(i18n);
  const user = auth.getUser() || { name: 'Guest', avatar: null };
  const firstName = user.name.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('dash.greeting_morning') : hour < 17 ? t('dash.greeting_afternoon') : t('dash.greeting_evening');
  const allHospitals = hospitals.getAll();
  const hi = i18n.isHindi() ? 'hindi' : '';
  const unreadCount = notifications.getUnreadCount();
  const uploadedReports = files.getFileCount();
  const recentNotifications = notifications.getAll().slice(0, 3);

  const statusMap = {
    available: { label: t('dash.opd_available'), cls: 'badge-success', dot: 'green' },
    busy: { label: t('dash.opd_busy'), cls: 'badge-warning', dot: 'amber' },
    full: { label: t('dash.opd_full'), cls: 'badge-danger', dot: 'red' }
  };

  app.innerHTML = `
  <div class="page-enter">
    <main class="container" style="padding-top:1.5rem;padding-bottom:2rem">
      <!-- Welcome -->
      <section style="margin-bottom:2.5rem" class="animate-fade">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:1rem">
          <div>
            <h2 style="font-size:clamp(1.75rem,5vw,2.5rem);font-weight:800;letter-spacing:-0.02em" class="${hi}">${greeting}, ${firstName}</h2>
            <p class="text-on-surface-variant ${hi}" style="font-size:1.1rem;margin-top:0.25rem">${t('dash.subtitle')}</p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="badge badge-neutral ${hi}" style="gap:0.375rem"><span class="material-symbols-outlined" style="font-size:14px">location_on</span>${t('common.patna_bihar')}</span>
            <span class="badge badge-primary ${hi}" style="gap:0.375rem"><span class="material-symbols-outlined filled" style="font-size:14px">verified</span>${t('common.verified')}</span>
            <button class="badge badge-neutral" id="openNotifications" style="gap:0.375rem"><span class="material-symbols-outlined" style="font-size:14px">notifications</span>${unreadCount} unread</button>
            <button class="badge badge-neutral" id="openProfile" style="gap:0.375rem"><span class="material-symbols-outlined" style="font-size:14px">account_circle</span>Profile</button>
          </div>
        </div>
      </section>

      <div style="display:grid;grid-template-columns:1fr;gap:1.5rem" class="dash-grid">
        <!-- Quick Actions -->
        <div class="animate-fade" style="animation-delay:80ms">
          <div class="card">
            <h3 style="font-weight:700;font-size:1.25rem;margin-bottom:1.5rem" class="${hi}">${t('dash.quick_actions')}</h3>
            <div class="grid-2" style="gap:1rem">
              ${[
                { action: 'consult', icon: 'video_call', label: t('dash.consult'), desc: 'Find real Patna OPD doctors' },
                { action: 'pharmacy', icon: 'pill', label: t('dash.pharmacy'), desc: 'Create medicine refill request' },
                { action: 'lab', icon: 'lab_panel', label: t('dash.lab_test'), desc: 'Prepare lab test reminder' },
                { action: 'vaccine', icon: 'vaccines', label: t('dash.vax_check'), desc: 'Check vaccine & ABHA benefits' }
              ].map(a => `
              <button class="quick-action" data-quick-action="${a.action}">
                <span class="material-symbols-outlined" style="color:var(--primary);font-size:1.75rem;margin-bottom:0.5rem;transition:transform 0.2s">${a.icon}</span>
                <span class="label-sm ${hi}">${a.label}</span>
                <span style="font-size:11px;color:var(--on-surface-variant);margin-top:0.35rem;line-height:1.25">${a.desc}</span>
              </button>`).join('')}
            </div>
          </div>

          <!-- Emergency SOS -->
          <div style="margin-top:1.5rem;background:var(--tertiary);padding:1.5rem;border-radius:var(--radius-xl);color:white;position:relative;overflow:hidden;cursor:pointer" onclick="window.mcNavigate && window.mcNavigate('emergency')">
            <div style="position:relative;z-index:1">
              <h4 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem" class="${hi}">${t('dash.emergency_title')}</h4>
              <p style="font-size:14px;opacity:0.9;margin-bottom:1.5rem" class="${hi}">${t('dash.emergency_desc')}</p>
              <button class="btn-primary ${hi}" style="background:white;color:var(--tertiary);box-shadow:none;width:auto;padding:0.75rem 1.5rem;font-size:13px;letter-spacing:0.05em;text-transform:uppercase">${t('dash.call_ambulance')}</button>
            </div>
            <span class="material-symbols-outlined" style="position:absolute;bottom:-8px;right:-8px;font-size:7rem;opacity:0.1;transform:rotate(12deg)">emergency_home</span>
          </div>

          <div class="card-flat" style="margin-top:1.5rem;display:flex;flex-direction:column;gap:0.75rem">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <h3 style="font-weight:800">Today&apos;s alerts</h3>
              <button class="btn-ghost" id="viewAllNotifications" style="font-size:12px">View all</button>
            </div>
            ${recentNotifications.length ? recentNotifications.map(n => `
            <button class="notification-row ${n.read ? '' : 'unread'}" data-alert="${n.id}" style="padding:0.75rem" type="button">
              <span class="material-symbols-outlined" style="font-size:20px">${getNotificationIcon(n.type)}</span>
              <span style="flex:1;text-align:left">
                <strong style="font-size:13px">${n.title}</strong>
                <small>${n.body}</small>
              </span>
            </button>`).join('') : '<p style="font-size:13px;color:var(--on-surface-variant)">No pending alerts.</p>'}
          </div>
        </div>

        <!-- Hospitals -->
        <div class="animate-fade" style="animation-delay:160ms">
          <div class="card" style="padding:2rem">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem">
              <div><h3 style="font-size:1.5rem;font-weight:800;letter-spacing:-0.01em" class="${hi}">${t('dash.top_hospitals')}</h3><p class="text-on-surface-variant ${hi}" style="font-size:14px">${t('dash.realtime_opd')}</p></div>
              <button class="btn-ghost ${hi}" style="font-size:13px">${t('dash.view_all')} <span class="material-symbols-outlined" style="font-size:16px">chevron_right</span></button>
            </div>
            <div style="display:flex;flex-direction:column;gap:1rem" class="stagger">
              ${allHospitals.slice(0, 3).map(h => {
                const s = statusMap[h.opd.status];
                const waitText = h.opd.status === 'full' ? t('dash.reschedule') : `${t('dash.wait_time')}: ~${h.opd.waitTime} ${t('dash.mins')}`;
                return `
              <div class="card-flat" style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;cursor:pointer" onclick="window.mcNavigate && window.mcNavigate('booking')">
                <div style="width:4rem;height:4rem;border-radius:var(--radius-xl);background:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:var(--shadow-sm);overflow:hidden">
                  ${h.image ? `<img src="${h.image}" alt="${h.name}" style="width:100%;height:100%;object-fit:cover">` : `<span class="material-symbols-outlined" style="font-size:2rem;color:var(--primary)">local_hospital</span>`}
                </div>
                <div style="flex:1;min-width:150px">
                  <h4 style="font-weight:700;font-size:1.1rem">${h.name}</h4>
                  <p style="font-size:13px;color:var(--on-surface-variant)">${h.address.split(',')[0]}</p>
                  <div style="display:flex;flex-wrap:wrap;gap:0.375rem;margin-top:0.5rem">${h.tags.map(tag => `<span class="badge badge-neutral">${tag}</span>`).join('')}</div>
                </div>
                <div style="text-align:right;flex-shrink:0">
                  <div class="badge ${s.cls} ${hi}" style="gap:0.375rem"><span class="status-dot ${s.dot}" ${s.dot === 'green' ? 'style="animation:pulse 2s infinite"' : ''}></span>${s.label}</div>
                  <p style="font-size:10px;font-weight:500;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:-0.02em;margin-top:0.5rem" class="${hi}">${waitText}</p>
                </div>
              </div>`;
              }).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Medical Vault -->
      <section class="animate-fade" style="margin-top:3rem;animation-delay:240ms">
        <h3 style="font-size:1.5rem;font-weight:800;letter-spacing:-0.01em;margin-bottom:2rem" class="${hi}">${t('dash.medical_vault')}</h3>
        <div class="grid-4">
          ${[
            { icon: 'folder', label: t('dash.lab_reports'), count: 14 + uploadedReports },
            { icon: 'folder', label: t('dash.prescriptions'), count: 8 },
            { icon: 'folder', label: t('dash.bills'), count: 21 }
          ].map(f => `
          <div class="card" style="cursor:pointer;border-top:1px solid rgba(255,255,255,0.5)" onclick="window.mcNavigate && window.mcNavigate('vault')">
            <div style="width:3rem;height:3rem;background:var(--primary-fixed);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;margin-bottom:1rem"><span class="material-symbols-outlined filled" style="color:var(--primary);font-size:1.5rem">${f.icon}</span></div>
            <h5 style="font-weight:700" class="${hi}">${f.label}</h5>
            <p style="font-size:12px;color:var(--on-surface-variant);margin-top:0.25rem" class="${hi}">${f.count} ${t('dash.documents')}</p>
          </div>`).join('')}
          <div style="background:var(--primary-container);padding:1.5rem;border-radius:var(--radius-xl);cursor:pointer;box-shadow:var(--vault-shadow);transition:transform 0.3s" onclick="window.mcNavigate && window.mcNavigate('vault')">
            <div style="width:3rem;height:3rem;background:rgba(255,255,255,0.2);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;margin-bottom:1rem"><span class="material-symbols-outlined" style="color:white;font-size:1.5rem">add</span></div>
            <h5 style="font-weight:700;color:white" class="${hi}">${t('dash.upload_new')}</h5>
            <p style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:0.25rem" class="${hi}">${t('dash.scan_store')}</p>
          </div>
        </div>
      </section>
    </main>
  </div>`;

  bindDashboardActions();

  function bindDashboardActions() {
    document.getElementById('openNotifications')?.addEventListener('click', () => navigate('notifications'));
    document.getElementById('openProfile')?.addEventListener('click', () => navigate('profile'));
    document.getElementById('viewAllNotifications')?.addEventListener('click', () => navigate('notifications'));

    app.querySelectorAll('[data-alert]').forEach(el => {
      el.addEventListener('click', () => {
        notifications.markRead(el.dataset.alert);
        navigate('notifications');
      });
    });

    app.querySelectorAll('[data-quick-action]').forEach(button => {
      button.addEventListener('click', () => handleQuickAction(button.dataset.quickAction));
    });
  }

  function handleQuickAction(action) {
    if (action === 'consult') {
      notifications.add({
        type: 'booking',
        title: 'Doctor search started',
        body: 'Choose your Patna ward and specialty to see real OPD doctor options.'
      });
      navigate('booking');
      return;
    }

    if (action === 'pharmacy') {
      notifications.add({
        type: 'pharmacy',
        title: 'Medicine refill request created',
        body: 'Open Medical Vault and attach your latest prescription before pickup or WhatsApp sharing.'
      });
      showToast('Pharmacy refill request added to notifications.');
      navigate('vault');
      return;
    }

    if (action === 'lab') {
      sessionStorage.setItem('mc_booking_type', 'lab');
      navigate('booking');
      return;
    }

    if (action === 'vaccine') {
      notifications.add({
        type: 'vaccine',
        title: 'Vaccination check queued',
        body: 'Review ABHA and Ayushman details, then carry ID for government center verification.'
      });
      navigate('ayushman');
    }
  }

  function showToast(message) {
    const toast = document.getElementById('global-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

function getNotificationIcon(type) {
  return {
    booking: 'calendar_month',
    pharmacy: 'pill',
    lab: 'science',
    vaccine: 'vaccines',
    profile: 'account_circle'
  }[type] || 'notifications';
}
