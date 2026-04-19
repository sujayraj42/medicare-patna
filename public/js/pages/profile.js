/** Profile Page */
export function renderProfile(app, { auth, notifications, navigate }) {
  const user = auth.getUser() || {};

  app.innerHTML = `
  <div class="page-enter">
    <main class="container-sm" style="padding-top:1.5rem;padding-bottom:2rem">
      <section style="margin-bottom:1.5rem">
        <p class="label-sm text-primary">Patient profile</p>
        <h2 style="font-size:2rem;font-weight:850;letter-spacing:-0.02em">Profile</h2>
        <p class="text-on-surface-variant">Keep this updated for OPD bookings, reminders, and emergency sharing.</p>
      </section>

      <form class="card" id="profileForm" style="display:flex;flex-direction:column;gap:1.25rem">
        <div style="display:flex;align-items:center;gap:1rem">
          <div class="avatar" style="width:4rem;height:4rem">
            ${user.avatar ? `<img src="${user.avatar}" alt="Profile">` : '<span class="material-symbols-outlined" style="font-size:3.25rem;color:var(--outline)">account_circle</span>'}
          </div>
          <div>
            <h3 style="font-weight:850">${user.name || 'Patient'}</h3>
            <p style="font-size:13px;color:var(--on-surface-variant)">ABHA: ${user.abhaId || 'Not linked'}</p>
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">Full Name</label>
          <div class="input-wrap"><span class="material-symbols-outlined">person</span><input class="input-field" id="profileName" value="${escapeAttr(user.name || '')}" required></div>
        </div>
        <div class="input-group">
          <label class="input-label">Mobile Number</label>
          <div class="input-wrap"><span class="material-symbols-outlined">call</span><input class="input-field" id="profileMobile" type="tel" value="${escapeAttr(user.mobile || '')}" required></div>
        </div>
        <div class="input-group">
          <label class="input-label">Date of Birth</label>
          <div class="input-wrap"><span class="material-symbols-outlined">calendar_today</span><input class="input-field" id="profileDob" type="date" value="${escapeAttr(user.dob || '')}"></div>
        </div>
        <div class="input-group">
          <label class="input-label">Locality / Ward</label>
          <div class="input-wrap"><span class="material-symbols-outlined">location_on</span><input class="input-field" id="profileLocation" value="${escapeAttr(user.location || 'Patna, Bihar')}" placeholder="Kankarbagh, Ward 32"></div>
        </div>
        <div class="input-group">
          <label class="input-label">Profile Photo URL</label>
          <div class="input-wrap"><span class="material-symbols-outlined">image</span><input class="input-field" id="profileAvatar" value="${escapeAttr(user.avatar || '')}" placeholder="https://..."></div>
        </div>

        <div id="profileMessage" style="display:none;padding:0.875rem;border-radius:var(--radius-sm);font-weight:700;font-size:13px"></div>

        <button class="btn-primary" type="submit">Save Profile <span class="material-symbols-outlined">check</span></button>
      </form>

      <form class="card-flat" id="passwordForm" style="display:flex;flex-direction:column;gap:1rem;margin-top:1rem">
        <h3 style="font-weight:850">Change password</h3>
        <div class="input-group">
          <label class="input-label">Current Password</label>
          <div class="input-wrap"><span class="material-symbols-outlined">lock</span><input class="input-field" id="currentPassword" type="password"></div>
        </div>
        <div class="input-group">
          <label class="input-label">New Password</label>
          <div class="input-wrap"><span class="material-symbols-outlined">lock_reset</span><input class="input-field" id="nextPassword" type="password"></div>
        </div>
        <button class="btn-secondary" type="submit">Update Password</button>
      </form>
    </main>
  </div>`;

  document.getElementById('profileForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const result = auth.updateProfile({
      name: document.getElementById('profileName').value,
      mobile: document.getElementById('profileMobile').value,
      dob: document.getElementById('profileDob').value,
      location: document.getElementById('profileLocation').value,
      avatar: document.getElementById('profileAvatar').value
    });

    if (result.success) {
      notifications.add({
        type: 'profile',
        title: 'Profile updated',
        body: 'Your care profile was saved successfully.'
      });
      showMessage('Profile saved.', true);
      setTimeout(() => navigate('dashboard'), 700);
    } else {
      showMessage(result.error || 'Profile could not be saved.', false);
    }
  });

  document.getElementById('passwordForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const result = auth.changePassword(
      document.getElementById('currentPassword').value,
      document.getElementById('nextPassword').value
    );
    showMessage(result.success ? 'Password updated.' : result.error, result.success);
    if (result.success) e.target.reset();
  });
}

function showMessage(message, success) {
  const el = document.getElementById('profileMessage');
  if (!el) return;
  el.textContent = message;
  el.style.display = 'block';
  el.style.color = success ? '#15803d' : 'var(--error)';
  el.style.background = success ? '#ecfdf5' : 'var(--error-container)';
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
