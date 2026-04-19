/** Register Page */
export function renderRegister(app, { auth, navigate }) {
  app.innerHTML = `
  <div class="register-page page-enter">
    <header class="glass-header"><div class="logo-text" style="color:var(--primary-container)">MediCare</div><div style="width:2.5rem;height:2.5rem;border-radius:50%;background:var(--surface-container-high);display:flex;align-items:center;justify-content:center"><span class="material-symbols-outlined text-outline">account_circle</span></div></header>
    <main style="flex:1;display:flex;align-items:center;justify-content:center;padding:2rem 1rem">
      <div style="max-width:1100px;width:100%;display:grid;grid-template-columns:1fr;gap:3rem;align-items:center" class="reg-grid">
        <section class="reg-hero">
          <div style="display:inline-flex;align-items:center;padding:0.5rem 1rem;background:var(--primary-fixed);color:var(--on-primary-fixed-variant);border-radius:2rem;font-size:13px;font-weight:600;gap:0.5rem;margin-bottom:1.5rem"><span class="material-symbols-outlined filled" style="font-size:16px">verified_user</span>CLINICAL GRADE SECURITY</div>
          <h2 style="font-size:2.5rem;font-weight:800;letter-spacing:-0.02em;line-height:1.15;color:var(--on-surface)">Your health data, <br><span style="color:var(--primary-container)">perfectly secured.</span></h2>
          <p style="color:var(--on-surface-variant);font-size:1.1rem;line-height:1.6;max-width:28rem;margin-top:1rem">Join Patna's most trusted digital health sanctuary. Access your medical vault, book appointments, and connect with verified professionals.</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:2rem">
            <div style="padding:1.5rem;background:var(--surface-container-low);border-radius:var(--radius-lg)"><span class="material-symbols-outlined" style="color:var(--primary-container);font-size:1.75rem;margin-bottom:0.75rem;display:block">folder_managed</span><h4 style="font-weight:700">Medical Vault</h4><p style="font-size:13px;color:var(--on-surface-variant)">Encrypted document storage.</p></div>
            <div style="padding:1.5rem;background:var(--surface-container-low);border-radius:var(--radius-lg)"><span class="material-symbols-outlined" style="color:var(--primary-container);font-size:1.75rem;margin-bottom:0.75rem;display:block">emergency_home</span><h4 style="font-weight:700">SOS Ready</h4><p style="font-size:13px;color:var(--on-surface-variant)">Instant emergency assistance.</p></div>
          </div>
        </section>
        <section class="card" style="padding:2rem 2.5rem;border-radius:var(--radius-2xl)">
          <div style="margin-bottom:2.5rem"><h1 style="font-size:1.75rem;font-weight:800;letter-spacing:-0.01em">Create Your Account</h1><p class="text-on-surface-variant" style="margin-top:0.5rem">Enter your details to begin your clinical journey.</p></div>
          <form id="registerForm" style="display:flex;flex-direction:column;gap:1.5rem">
            <div class="input-group"><label class="input-label">Full Name</label><div class="input-wrap"><span class="material-symbols-outlined">person</span><input class="input-field" id="regName" placeholder="John Doe" required></div></div>
            <div class="input-group"><label class="input-label">Mobile Number</label><div class="input-wrap"><span class="material-symbols-outlined">call</span><input class="input-field" id="regMobile" type="tel" placeholder="+91 98765 43210" required></div></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem" class="reg-row">
              <div class="input-group"><label class="input-label">Date of Birth</label><div class="input-wrap"><span class="material-symbols-outlined">calendar_today</span><input class="input-field" id="regDob" type="date" style="color:var(--on-surface-variant)"></div></div>
              <div class="input-group"><label class="input-label">Password</label><div class="input-wrap"><span class="material-symbols-outlined">lock</span><input class="input-field" id="regPassword" type="password" placeholder="••••••••" required></div></div>
            </div>
            <label style="display:flex;align-items:flex-start;gap:0.75rem;padding:0.5rem 0;font-size:14px;color:var(--on-surface-variant)"><input type="checkbox" id="regTerms" style="margin-top:3px;accent-color:var(--primary)"> I agree to the <a href="#" style="color:var(--primary);font-weight:600">Terms and Conditions</a> and Privacy Policy.</label>
            <button type="submit" class="btn-primary" style="margin-top:0.5rem">Register <span class="material-symbols-outlined">arrow_forward</span></button>
            <div style="text-align:center;padding-top:0.5rem"><p class="text-on-surface-variant">Already have an account? <a href="#" id="goLogin" style="color:var(--primary);font-weight:700;margin-left:4px">Sign In</a></p></div>
          </form>
        </section>
      </div>
    </main>
  </div>`;

  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { 
      name: document.getElementById('regName').value, 
      mobile: document.getElementById('regMobile').value, 
      dob: document.getElementById('regDob').value,
      password: document.getElementById('regPassword').value
    };
    const res = auth.register(data);
    if (res.success) {
      navigate('dashboard');
    } else {
      alert(res.error || 'Registration failed');
    }
  });
  document.getElementById('goLogin')?.addEventListener('click', (e) => { e.preventDefault(); navigate('login'); });
}
