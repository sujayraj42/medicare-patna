/** Reports Vault Page — with PDF Upload + WhatsApp Share */
export function renderVault(app, { i18n, files, whatsapp, navigate }) {
  const t = i18n.t.bind(i18n);

  const folders = [
    { name: 'X-rays', count: 12 + files.getFileCount('xrays'), icon: 'radiology', color: '#f59e0b', bg: '#fffbeb', tabBg: '#fef3c7', category: 'xrays' },
    { name: 'Lab Reports', count: 45 + files.getFileCount('lab'), icon: 'science', color: '#2563eb', bg: '#eff6ff', tabBg: '#dbeafe', category: 'lab' },
    { name: 'Prescriptions', count: 28 + files.getFileCount('prescriptions'), icon: 'prescriptions', color: '#059669', bg: '#ecfdf5', tabBg: '#a7f3d0', category: 'prescriptions' },
    { name: 'Vaccinations', count: 8 + files.getFileCount('vaccinations'), icon: 'vaccines', color: '#7c3aed', bg: '#f5f3ff', tabBg: '#e9d5ff', category: 'vaccinations' },
    { name: 'MRI & Scans', count: 4 + files.getFileCount('scans'), icon: 'biotech', color: '#475569', bg: '#f8fafc', tabBg: '#e2e8f0', category: 'scans' }
  ];

  const uploadedFiles = files.getFiles();
  const recentRecords = [
    { name: 'Full Blood Count Report', source: 'Apollo Clinical Labs • Dr. Sarah Jenkins', date: 'Oct 24, 2023', icon: 'bloodtype', color: '#2563eb', tagColor: '#dbeafe', tagText: '#1d4ed8', tag: 'Lab Report', hospital: 'Apollo Clinical Labs' },
    { name: 'Cardiology Prescription', source: 'City Heart Center • Dr. Robert Chen', date: 'Oct 18, 2023', icon: 'medical_services', color: '#059669', tagColor: '#d1fae5', tagText: '#047857', tag: 'Prescription', hospital: 'City Heart Center' }
  ];

  app.innerHTML = `
  <div class="page-enter">
    <main class="container" style="padding-top:2rem;padding-bottom:2rem">
      <div style="margin-bottom:2.5rem">
        <h2 style="font-size:1.75rem;font-weight:700;letter-spacing:-0.01em" class="${i18n.isHindi() ? 'hindi' : ''}">${t('vault.title')}</h2>
        <p class="text-on-surface-variant ${i18n.isHindi() ? 'hindi' : ''}" style="max-width:36rem">${t('vault.subtitle')}</p>
      </div>

      <!-- Upload Actions -->
      <div style="display:flex;gap:0.75rem;margin-bottom:2rem;flex-wrap:wrap">
        <button class="btn-primary" id="uploadPdf" style="width:auto;padding:0.875rem 1.5rem;font-size:14px">
          <span class="material-symbols-outlined" style="font-size:20px">upload_file</span>
          <span class="${i18n.isHindi() ? 'hindi' : ''}">${t('vault.upload_pdf')}</span>
        </button>
        <button class="btn-secondary" id="uploadPhoto" style="width:auto;padding:0.875rem 1.5rem;font-size:14px">
          <span class="material-symbols-outlined" style="font-size:20px">photo_camera</span>
          <span class="${i18n.isHindi() ? 'hindi' : ''}">${t('vault.upload_photo')}</span>
        </button>
      </div>

      <!-- Search Bar -->
      <div style="display:grid;grid-template-columns:1fr auto auto;gap:0.75rem;margin-bottom:3rem" class="vault-search-grid">
        <div class="input-wrap"><span class="material-symbols-outlined">search</span><input class="input-field" placeholder="${t('vault.search_placeholder')}" id="vaultSearch"></div>
        <button class="btn-secondary" style="width:auto;padding:1rem 1.25rem;gap:0.5rem"><span class="material-symbols-outlined" style="font-size:20px">calendar_today</span><span class="vault-search-label">${t('vault.date_range')}</span></button>
        <button style="background:var(--primary-container);color:white;padding:1rem;border-radius:var(--radius-lg);box-shadow:var(--shadow-md)"><span class="material-symbols-outlined" style="font-size:1.5rem">filter_list</span></button>
      </div>

      <!-- Folders Grid -->
      <div class="grid-3" style="gap:2rem;margin-bottom:4rem">
        ${folders.map(f => `
        <div class="vault-folder" style="background:${f.bg};background-image:linear-gradient(135deg,${f.bg} 0%,${f.tabBg}50 100%)">
          <div class="folder-tab" style="background:${f.tabBg}"></div>
          <div class="folder-icon"><span class="material-symbols-outlined filled" style="color:${f.color}">${f.icon}</span></div>
          <h3 style="font-size:1.25rem;font-weight:700;color:#1e293b">${f.name}</h3>
          <p style="font-size:13px;font-weight:500;color:${f.color};opacity:0.6;margin-top:0.25rem">${f.count} ${t('vault.files_found')}</p>
        </div>`).join('')}
        <!-- Upload New -->
        <div class="vault-folder" style="border:4px dashed #e2e8f0;background:transparent;box-shadow:none" id="uploadDrop">
          <div style="margin-bottom:1rem;padding:1rem;background:rgba(0,86,179,0.1);border-radius:50%;transition:transform 0.3s"><span class="material-symbols-outlined" style="font-size:3rem;color:var(--primary-container)">add_circle</span></div>
          <h3 style="font-size:1.25rem;font-weight:700;color:var(--primary-container)" class="${i18n.isHindi() ? 'hindi' : ''}">${t('vault.upload_new')}</h3>
          <p style="font-size:13px;font-weight:500;color:#94a3b8;text-align:center" class="${i18n.isHindi() ? 'hindi' : ''}">${t('vault.upload_desc')}</p>
        </div>
      </div>

      ${uploadedFiles.length > 0 ? `
      <!-- Uploaded Files -->
      <section style="margin-bottom:3rem">
        <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem">📎 Your Uploads</h3>
        <div style="display:flex;flex-direction:column;gap:0.75rem">
          ${uploadedFiles.slice(0, 5).map(f => `
          <div class="card-flat" style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
            <div style="width:3rem;height:3rem;background:${f.type === 'application/pdf' ? '#fef2f2' : '#eff6ff'};border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center">
              <span class="material-symbols-outlined" style="color:${f.type === 'application/pdf' ? '#dc2626' : '#2563eb'}">${f.type === 'application/pdf' ? 'picture_as_pdf' : 'image'}</span>
            </div>
            <div style="flex:1;min-width:120px">
              <p style="font-weight:700;font-size:14px">${f.name}</p>
              <p style="font-size:12px;color:var(--on-surface-variant)">${files.formatSize(f.size)} • ${new Date(f.uploadedAt).toLocaleDateString('en-IN')}</p>
            </div>
            <div style="display:flex;gap:0.5rem">
              <button class="share-wa-btn" data-fname="${f.name}" data-fdate="${new Date(f.uploadedAt).toLocaleDateString('en-IN')}" style="padding:0.5rem;border-radius:var(--radius-sm);background:#25D366;color:white;display:flex;align-items:center" title="Share via WhatsApp">
                <span class="material-symbols-outlined" style="font-size:18px">share</span>
              </button>
              <button class="delete-file-btn" data-fid="${f.id}" style="padding:0.5rem;border-radius:var(--radius-sm);background:var(--error-container);color:var(--error);display:flex;align-items:center" title="Delete">
                <span class="material-symbols-outlined" style="font-size:18px">delete</span>
              </button>
            </div>
          </div>`).join('')}
        </div>
      </section>
      ` : ''}

      <!-- Recent Records -->
      <section>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2rem">
          <div>
            <h2 style="font-size:1.75rem;font-weight:700" class="${i18n.isHindi() ? 'hindi' : ''}">${t('vault.recent')}</h2>
            <p class="text-on-surface-variant ${i18n.isHindi() ? 'hindi' : ''}">${t('vault.recent_desc')}</p>
          </div>
          <button class="btn-ghost ${i18n.isHindi() ? 'hindi' : ''}">${t('vault.view_history')}</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:1rem">
          ${recentRecords.map(r => `
          <div class="card-flat" style="display:flex;align-items:center;gap:1.5rem;cursor:pointer;flex-wrap:wrap">
            <div style="width:3.5rem;height:3.5rem;background:white;border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-sm)"><span class="material-symbols-outlined" style="color:${r.color}">${r.icon}</span></div>
            <div style="flex:1;min-width:150px"><h4 style="font-weight:700;font-size:1.1rem">${r.name}</h4><p style="font-size:13px;color:var(--on-surface-variant)">${r.source}</p></div>
            <div style="display:flex;align-items:center;gap:0.75rem">
              <button class="share-wa-btn" data-fname="${r.name}" data-fdate="${r.date}" data-fhospital="${r.hospital}" data-ftype="${r.tag}" style="padding:0.5rem 0.75rem;border-radius:var(--radius-sm);background:#25D366;color:white;display:flex;align-items:center;gap:0.375rem;font-size:12px;font-weight:700" title="${t('vault.share_wa')}">
                <span class="material-symbols-outlined" style="font-size:16px">share</span>
                <span style="display:none" class="wa-label">WA</span>
              </button>
              <div style="text-align:right"><p style="font-weight:700">${r.date}</p><span style="font-size:11px;padding:0.25rem 0.5rem;background:${r.tagColor};color:${r.tagText};border-radius:2rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">${r.tag}</span></div>
            </div>
          </div>`).join('')}
        </div>
      </section>
    </main>
  </div>`;

  // ── Event Bindings ──

  // Upload PDF
  document.getElementById('uploadPdf')?.addEventListener('click', () => {
    files.pickFile('file', (result) => {
      if (result.success) {
        showToast(`✅ "${result.file.name}" uploaded successfully!`);
        renderVault(app, { i18n, files, whatsapp, navigate }); // Re-render
      } else {
        showToast(`❌ ${result.error}`);
      }
    });
  });

  // Upload Photo (camera)
  document.getElementById('uploadPhoto')?.addEventListener('click', () => {
    files.pickFile('camera', (result) => {
      if (result.success) {
        showToast(`📸 Photo uploaded successfully!`);
        renderVault(app, { i18n, files, whatsapp, navigate });
      } else {
        showToast(`❌ ${result.error}`);
      }
    });
  });

  // Upload drop zone
  document.getElementById('uploadDrop')?.addEventListener('click', () => {
    files.pickFile('file', (result) => {
      if (result.success) {
        showToast(`✅ "${result.file.name}" uploaded!`);
        renderVault(app, { i18n, files, whatsapp, navigate });
      }
    });
  });

  // WhatsApp share buttons
  app.querySelectorAll('.share-wa-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      whatsapp.shareReport({
        name: btn.dataset.fname,
        date: btn.dataset.fdate,
        hospital: btn.dataset.fhospital || 'MediCare Vault',
        type: btn.dataset.ftype || 'Document'
      });
    });
  });

  // Delete file buttons
  app.querySelectorAll('.delete-file-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Delete this file?')) {
        files.deleteFile(btn.dataset.fid);
        showToast('🗑️ File deleted');
        renderVault(app, { i18n, files, whatsapp, navigate });
      }
    });
  });

  function showToast(msg) {
    const toast = document.getElementById('global-toast');
    if (toast) { toast.textContent = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3500); }
  }
}
