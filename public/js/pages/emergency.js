/** Emergency SOS Page — with Real Geolocation + WhatsApp SOS */
export function renderEmergency(app, { hospitals, i18n, geo, whatsapp }) {
  const t = i18n.t.bind(i18n);
  const contacts = hospitals.getEmergencyContacts();
  const bloodBanks = hospitals.getBloodBanks();
  const position = geo.getPosition();

  // Calculate real distances from current location
  const hospitalDistances = {
    'pmch': geo.distanceTo(25.6126, 85.1551) || '1.2',
    'igims': geo.distanceTo(25.6087, 85.1204) || '4.5',
    'paras-hmri': geo.distanceTo(25.6115, 85.1376) || '3.1'
  };

  app.innerHTML = `
  <div class="page-enter">
    <main class="container-sm" style="padding-top:1.5rem;padding-bottom:2rem">
      <!-- Ambulance CTA -->
      <section style="margin-bottom:2rem">
        <div class="card" style="box-shadow:0 8px 32px rgba(186,26,26,0.12);border:2px solid rgba(186,26,26,0.1)">
          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem">
            <span class="material-symbols-outlined filled" style="color:var(--error);font-size:1.75rem">emergency_share</span>
            <h2 style="font-size:1.5rem;font-weight:800;letter-spacing:-0.01em" class="${i18n.isHindi() ? 'hindi' : ''}">${t('sos.title')}</h2>
          </div>
          <a href="tel:108" class="sos-call-btn" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:2.5rem;border-radius:var(--radius-xl);background:linear-gradient(135deg,var(--error),var(--tertiary));color:white;position:relative;overflow:hidden;text-decoration:none">
            <div style="position:absolute;inset:0;background:radial-gradient(circle at center,var(--error) 0%,transparent 70%);opacity:0.2"></div>
            <span class="material-symbols-outlined filled" style="font-size:3.5rem;position:relative;z-index:1">ambulance</span>
            <div style="text-align:center;position:relative;z-index:1">
              <span style="display:block;font-weight:900;font-size:1.75rem;line-height:1.1" class="${i18n.isHindi() ? 'hindi' : ''}">${t('sos.ambulance_name')}</span>
              <span style="display:block;font-weight:700;font-size:1.1rem;margin-top:0.5rem;letter-spacing:0.1em;opacity:0.85" class="${i18n.isHindi() ? 'hindi' : ''}">${t('sos.tap_call')}</span>
            </div>
          </a>

          <!-- Live GPS Location -->
          <div style="margin-top:1.5rem;display:flex;align-items:center;justify-content:space-between;padding:1rem;background:rgba(255,218,214,0.3);border-radius:var(--radius-xl)">
            <div style="display:flex;align-items:center;gap:0.75rem">
              <span class="material-symbols-outlined" style="color:var(--error)">location_on</span>
              <span style="font-weight:700;color:var(--on-error-container)" id="gpsLocation">${t('sos.current')}: ${position.areaName || 'Kankarbagh'}, Patna</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem">
              ${position.isFallback ? '<span style="font-size:9px;font-weight:700;color:var(--on-surface-variant);text-transform:uppercase;background:var(--surface-container-highest);padding:2px 6px;border-radius:2rem">APPROX</span>' : ''}
              <span style="font-size:10px;font-weight:900;color:var(--error);text-transform:uppercase;letter-spacing:0.1em" class="${i18n.isHindi() ? 'hindi' : ''}">${t('sos.live_gps')}</span>
              <div class="status-dot red animate-pulse"></div>
            </div>
          </div>

          <!-- WhatsApp SOS -->
          <button id="sosWhatsApp" style="margin-top:1rem;width:100%;padding:0.875rem;border-radius:var(--radius-lg);background:#25D366;color:white;font-weight:700;display:flex;align-items:center;justify-content:center;gap:0.75rem;font-size:14px;box-shadow:0 4px 12px rgba(37,211,102,0.3)">
            <span class="material-symbols-outlined" style="font-size:20px">share</span>
            Share Location via WhatsApp
          </button>
        </div>
      </section>

      <!-- ER Availability (with real distances) -->
      <section style="margin-bottom:2rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:0 0.5rem;margin-bottom:1rem">
          <h3 style="font-size:1.25rem;font-weight:700;letter-spacing:-0.01em" class="${i18n.isHindi() ? 'hindi' : ''}">${t('sos.er_title')}</h3>
          <span class="text-on-surface-variant ${i18n.isHindi() ? 'hindi' : ''}" style="font-size:13px;font-weight:500">${t('sos.updated')}</span>
        </div>
        <div class="grid-2" style="gap:1rem">
          <!-- PMCH -->
          <div class="card" style="grid-column:span 2;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
            <div style="display:flex;gap:1rem;align-items:center">
              <div style="width:3.5rem;height:3.5rem;background:var(--surface-container-high);border-radius:var(--radius-xl);display:flex;align-items:center;justify-content:center"><span class="material-symbols-outlined" style="color:var(--primary);font-size:1.75rem">local_hospital</span></div>
              <div><p style="font-weight:900;font-size:1.1rem">PMCH Emergency</p><p class="text-on-surface-variant" style="font-size:13px;font-weight:500">${hospitalDistances.pmch} km away</p></div>
            </div>
            <div style="text-align:right"><span class="badge badge-success">Open</span><p style="font-weight:700;margin-top:0.25rem">10 min wait</p></div>
          </div>
          <!-- IGIMS -->
          <div class="card">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem">
              <span class="material-symbols-outlined filled" style="color:var(--error-container);background:var(--error);padding:0.5rem;border-radius:var(--radius-lg)">bed</span>
              <span style="font-size:10px;font-weight:900;color:var(--error);text-transform:uppercase">Critical</span>
            </div>
            <p style="font-weight:700;font-size:14px">IGIMS ER</p>
            <p class="text-on-surface-variant" style="font-size:12px;margin-top:0.25rem">${hospitalDistances.igims} km away</p>
            <p style="color:var(--error);font-weight:900;font-size:1.1rem;margin-top:0.75rem">2 Beds Left</p>
          </div>
          <!-- Paras -->
          <div class="card">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem">
              <span class="material-symbols-outlined filled" style="color:var(--on-secondary-container);background:var(--secondary-container);padding:0.5rem;border-radius:var(--radius-lg)">medical_services</span>
              <span style="font-size:10px;font-weight:900;color:var(--on-surface-variant);text-transform:uppercase">Normal</span>
            </div>
            <p style="font-weight:700;font-size:14px">Paras HMRI</p>
            <p class="text-on-surface-variant" style="font-size:12px;margin-top:0.25rem">${hospitalDistances['paras-hmri']} km away</p>
            <p style="color:var(--primary);font-weight:900;font-size:1.1rem;margin-top:0.75rem">Available</p>
          </div>
        </div>
      </section>

      <!-- Blood Banks -->
      <section style="margin-bottom:2rem">
        <h3 style="font-size:1.25rem;font-weight:700;letter-spacing:-0.01em;padding:0 0.5rem;margin-bottom:1rem" class="${i18n.isHindi() ? 'hindi' : ''}">${t('sos.blood_banks')}</h3>
        <div class="card" style="padding:0;overflow:hidden">
          ${bloodBanks.map((bb, i) => `
          <div style="display:flex;align-items:center;padding:1rem 1.5rem;${i < bloodBanks.length - 1 ? 'border-bottom:1px solid var(--surface-container)' : ''}">
            ${i === 0 ? `<div style="display:flex;margin-right:1rem">${bb.types.map(t => `<div style="width:2.5rem;height:2.5rem;border-radius:50%;border:3px solid white;background:var(--error-container);display:flex;align-items:center;justify-content:center;margin-left:${t === bb.types[0] ? '0' : '-0.75rem'}"><span style="font-size:10px;font-weight:900;color:var(--error)">${t}</span></div>`).join('')}</div>` : `<div style="width:2.5rem;height:2.5rem;border-radius:var(--radius-lg);background:var(--surface-container-low);display:flex;align-items:center;justify-content:center;margin-right:1rem"><span class="material-symbols-outlined" style="color:var(--error)">water_drop</span></div>`}
            <div style="flex:1"><p style="font-size:14px;font-weight:700">${bb.name}</p>${bb.address ? `<p style="font-size:12px;color:var(--on-surface-variant)">${bb.address}</p>` : ''}</div>
            <a href="tel:${bb.phone}" style="width:2.5rem;height:2.5rem;border-radius:50%;background:var(--surface-container);display:flex;align-items:center;justify-content:center;color:var(--primary)"><span class="material-symbols-outlined">call</span></a>
          </div>`).join('')}
        </div>
      </section>

      <!-- Map with Live Coordinates -->
      <section>
        <div style="width:100%;height:14rem;border-radius:var(--radius-2xl);overflow:hidden;position:relative;background:var(--surface-container-high)">
          <div style="position:absolute;inset:0;background:var(--primary);opacity:0.05"></div>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:0.5rem">
            <span class="material-symbols-outlined" style="font-size:3rem;color:var(--primary);opacity:0.3">map</span>
            <span style="font-size:13px;color:var(--on-surface-variant);font-weight:500">Emergency map view</span>
            <span style="font-size:11px;color:var(--on-surface-variant);font-weight:500;font-family:monospace">${position.lat.toFixed(4)}°N, ${position.lng.toFixed(4)}°E</span>
          </div>
          <div style="position:absolute;bottom:1rem;left:1rem;background:var(--glass-bg);backdrop-filter:var(--glass-blur);padding:0.5rem 1rem;border-radius:var(--radius-xl);display:flex;align-items:center;gap:0.5rem;box-shadow:var(--shadow-md)">
            <div class="status-dot red animate-pulse"></div>
            <span style="font-size:12px;font-weight:700" class="${i18n.isHindi() ? 'hindi' : ''}">${t('sos.viewing_assets')}</span>
          </div>
          <button id="refreshGps" style="position:absolute;bottom:1rem;right:1rem;background:var(--glass-bg);backdrop-filter:var(--glass-blur);padding:0.5rem;border-radius:50%;box-shadow:var(--shadow-md);display:flex;align-items:center;justify-content:center;color:var(--primary)">
            <span class="material-symbols-outlined">my_location</span>
          </button>
        </div>
      </section>
    </main>
  </div>`;

  // ── Events ──

  // WhatsApp SOS
  document.getElementById('sosWhatsApp')?.addEventListener('click', () => {
    whatsapp.shareEmergency(position);
  });

  // Refresh GPS
  document.getElementById('refreshGps')?.addEventListener('click', async () => {
    const btn = document.getElementById('refreshGps');
    btn.querySelector('.material-symbols-outlined').classList.add('animate-pulse');
    const newPos = await geo.getCurrentPosition();
    const locEl = document.getElementById('gpsLocation');
    if (locEl) locEl.textContent = `${t('sos.current')}: ${newPos.areaName}, Patna`;
    btn.querySelector('.material-symbols-outlined').classList.remove('animate-pulse');
    const toast = document.getElementById('global-toast');
    if (toast) { toast.textContent = `📍 Location updated: ${newPos.areaName}`; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); }
  });

  // Start watching location on emergency page
  geo.startWatching();
}
