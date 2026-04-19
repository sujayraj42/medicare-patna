/** Login Page — OTP Authentication Flow */
export function renderLogin(app, { auth, i18n, navigate }) {
  const t = i18n.t.bind(i18n);
  let otpSent = false;
  let timerSeconds = 0;
  let timerInterval = null;

  function render() {
    const mobileStyle = `padding-left:5.5rem${otpSent ? ';opacity:0.6' : ''}`;
    const mobileDisabled = otpSent ? 'disabled' : '';
    const resendStyle = `font-size:13px;padding:0.25rem 0.5rem${timerSeconds > 0 ? ';opacity:0.5;cursor:not-allowed' : ''}`;
    const resendDisabled = timerSeconds > 0 ? 'disabled' : '';

    app.innerHTML = `
    <div class="login-page page-enter">
      <div class="login-container">
        <div class="login-brand">
          <div class="login-brand-bg"></div>
          <div class="login-brand-content">
            <div class="logo"><div class="logo-icon"><span class="material-symbols-outlined filled" style="font-size:1.75rem;color:var(--primary)">health_and_safety</span></div><span class="logo-text" style="color:white">MediCare</span></div>
            <h1>${t('login.brand_headline').replace('\n', '<br>')}</h1>
            <p>${t('login.brand_desc')}</p>
            <div class="login-badges"><span>HIPAA Secure</span><span>ABHA Integrated</span><span>OTP Login</span></div>
          </div>
        </div>
        <div class="login-form-area">
          <div class="login-mobile-logo">
            <div class="logo-icon" style="background:var(--primary-container)"><span class="material-symbols-outlined filled" style="font-size:1.5rem;color:white">health_and_safety</span></div>
            <span class="logo-text" style="color:var(--primary)">MediCare</span>
            <button id="langToggle" style="margin-left:auto;padding:0.375rem 0.75rem;border-radius:var(--radius-sm);background:var(--surface-container-high);font-size:12px;font-weight:700;color:var(--primary)">${t('common.language')}</button>
          </div>
          <div class="login-form-wrap">
            <h2 class="${i18n.isHindi() ? 'hindi' : ''}">${t('login.welcome')}</h2>
            <p class="text-on-surface-variant ${i18n.isHindi() ? 'hindi' : ''}">${t('login.subtitle')}</p>
            <form id="loginForm">
              <!-- Phone Number -->
              <div class="input-group">
                <label class="input-label ${i18n.isHindi() ? 'hindi' : ''}">${t('login.mobile_label')}</label>
                <div class="input-wrap">
                  <span class="material-symbols-outlined">smartphone</span>
                  <div style="position:absolute;left:3rem;top:50%;transform:translateY(-50%);font-weight:700;color:var(--on-surface);font-size:15px;letter-spacing:0.02em">+91</div>
                  <input class="input-field" id="loginMobile" type="tel" maxlength="16" placeholder="${t('login.mobile_placeholder')}" autocomplete="tel" style="${mobileStyle}" ${mobileDisabled}>
                </div>
              </div>

              ${!otpSent ? `
              <!-- Password Input -->
              <div class="input-group">
                <label class="input-label">Password</label>
                <div class="input-wrap">
                  <span class="material-symbols-outlined">lock</span>
                  <input class="input-field" id="loginPassword" type="password" placeholder="••••••••">
                </div>
              </div>
              ` : ''}

              ${otpSent ? `
              <!-- OTP Input -->
              <div class="input-group animate-fade">
                <label class="input-label ${i18n.isHindi() ? 'hindi' : ''}">${t('login.enter_otp')}</label>
                <div style="display:flex;gap:0.5rem;justify-content:center" id="otpBoxes">
                  ${[0,1,2,3,4,5].map(i => `
                  <input type="tel" maxlength="1" class="otp-digit" data-idx="${i}" style="width:3.25rem;height:3.75rem;text-align:center;font-size:1.5rem;font-weight:800;background:var(--surface-container-high);border-radius:var(--radius-lg);color:var(--on-surface);transition:all 0.15s" autocomplete="one-time-code">
                  `).join('')}
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.75rem;padding:0 0.25rem">
                  <span style="font-size:13px;color:var(--on-surface-variant)" class="${i18n.isHindi() ? 'hindi' : ''}">${t('login.otp_sent')}</span>
                  <button type="button" id="resendOtp" class="btn-ghost" style="${resendStyle}" ${resendDisabled}>${timerSeconds > 0 ? `${t('login.resend')} (${timerSeconds}s)` : t('login.resend')}</button>
                </div>
              </div>
              ` : ''}

              <div id="loginError" style="color:var(--error);font-size:13px;font-weight:600;display:none;margin-top:0.5rem;text-align:center;padding:0.75rem;background:var(--error-container);border-radius:var(--radius-sm)"></div>
              <div id="loginSuccess" style="color:#15803d;font-size:13px;font-weight:600;display:none;margin-top:0.5rem;text-align:center;padding:0.75rem;background:#ecfdf5;border-radius:var(--radius-sm)"></div>

              <div style="padding-top:1rem;display:flex;flex-direction:column;gap:1rem">
                ${otpSent ? `
                <button type="submit" class="btn-primary" id="verifyBtn">
                  <span class="material-symbols-outlined" style="font-size:20px">verified_user</span>
                  <span class="${i18n.isHindi() ? 'hindi' : ''}">${t('login.verify_otp')}</span>
                </button>
                <button type="button" class="btn-secondary" id="changeNumber" style="font-size:14px">
                  <span class="material-symbols-outlined" style="font-size:18px">arrow_back</span>
                  Change Number
                </button>
                ` : `
                <button type="button" class="btn-primary" id="passwordLoginBtn">
                  <span class="material-symbols-outlined" style="font-size:20px">login</span>
                  <span>Login with Password</span>
                </button>
                <div style="text-align:center;color:var(--on-surface-variant);font-size:13px;font-weight:700">OR</div>
                <button type="submit" class="btn-secondary" id="sendOtpBtn">
                  <span class="material-symbols-outlined" style="font-size:20px">sms</span>
                  <span class="${i18n.isHindi() ? 'hindi' : ''}">${t('login.send_otp')}</span>
                </button>
                `}
              </div>
            </form>

            <div style="margin-top:2rem;padding:1.25rem;background:var(--surface-container-low);border-radius:var(--radius-lg);display:flex;gap:1rem;align-items:flex-start">
              <span class="material-symbols-outlined" style="color:var(--primary);font-size:20px;margin-top:2px">info</span>
              <div style="font-size:13px;color:var(--on-surface-variant);line-height:1.6">
                <strong>Demo Mode:</strong> Enter any 10-digit number and use OTP <code style="padding:2px 6px;background:var(--surface-container-highest);border-radius:4px;font-weight:700;color:var(--primary)">123456</code> to login.
              </div>
            </div>

            <div style="margin-top:2.5rem;text-align:center">
              <p class="text-on-surface-variant ${i18n.isHindi() ? 'hindi' : ''}">${t('login.new_user')} <a href="#" id="goRegister" style="color:var(--primary);font-weight:700;margin-left:4px">${t('login.create_account')}</a></p>
            </div>
            <div style="margin-top:2rem;display:flex;justify-content:center;gap:1.5rem;opacity:0.4">
              <a href="#" style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:-0.02em">Support</a>
              <a href="#" style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:-0.02em">Privacy Policy</a>
              <a href="#" style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:-0.02em">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>`;

    bindEvents();
  }

  function bindEvents() {
    // Language toggle
    document.getElementById('langToggle')?.addEventListener('click', () => { i18n.toggle(); render(); });

    // OTP digit boxes — auto-advance
    const otpDigits = app.querySelectorAll('.otp-digit');
    otpDigits.forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val.slice(0, 1);
        if (val && idx < 5) otpDigits[idx + 1]?.focus();
        e.target.style.boxShadow = val ? '0 0 0 2px rgba(0,86,179,0.3)' : '';
        e.target.style.background = val ? 'var(--surface-container-lowest)' : 'var(--surface-container-high)';
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && idx > 0) {
          otpDigits[idx - 1]?.focus();
        }
      });
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const data = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
        data.split('').forEach((ch, i) => {
          if (otpDigits[i]) { otpDigits[i].value = ch; otpDigits[i].style.boxShadow = '0 0 0 2px rgba(0,86,179,0.3)'; otpDigits[i].style.background = 'var(--surface-container-lowest)'; }
        });
        if (data.length > 0) otpDigits[Math.min(data.length, 5)]?.focus();
      });
    });

    // Password Login
    document.getElementById('passwordLoginBtn')?.addEventListener('click', () => {
      hideMessages();
      const mobile = document.getElementById('loginMobile').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      if (!mobile || !password) {
        showError('Please enter mobile number and password');
        return;
      }
      const result = auth.login(mobile, password);
      if (result.success) {
        showSuccess('✅ Login successful! Redirecting...');
        setTimeout(() => navigate('dashboard'), 800);
      } else {
        showError(result.error);
      }
    });

    // Form submit (OTP Flow)

    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideMessages();

      if (!otpSent) {
        // Send OTP
        const mobile = document.getElementById('loginMobile').value.trim();
        const btn = document.getElementById('sendOtpBtn');
        btn.innerHTML = '<span class="material-symbols-outlined animate-pulse">hourglass_empty</span> Sending...';
        btn.disabled = true;

        const result = await auth.sendOTP(mobile);
        if (result.success) {
          otpSent = true;
          startResendTimer();
          render();
          showSuccess(t('login.otp_sent') + (result.demo ? ' (Demo: 123456)' : ''));
          // Auto-focus first OTP digit
          setTimeout(() => app.querySelector('.otp-digit')?.focus(), 100);
        } else {
          showError(result.error);
          btn.innerHTML = `<span class="material-symbols-outlined" style="font-size:20px">sms</span> ${t('login.send_otp')}`;
          btn.disabled = false;
        }
      } else {
        // Verify OTP
        const code = Array.from(otpDigits).map(d => d.value).join('');
        const btn = document.getElementById('verifyBtn');
        btn.innerHTML = '<span class="material-symbols-outlined animate-pulse">hourglass_empty</span> Verifying...';
        btn.disabled = true;

        const result = await auth.verifyOTP(code);
        if (result.success) {
          showSuccess('✅ Login successful! Redirecting...');
          setTimeout(() => navigate('dashboard'), 800);
        } else {
          showError(result.error);
          btn.innerHTML = `<span class="material-symbols-outlined" style="font-size:20px">verified_user</span> ${t('login.verify_otp')}`;
          btn.disabled = false;
          // Shake OTP boxes
          const boxes = document.getElementById('otpBoxes');
          if (boxes) { boxes.style.animation = 'shake 0.4s ease'; setTimeout(() => boxes.style.animation = '', 400); }
        }
      }
    });

    // Change number
    document.getElementById('changeNumber')?.addEventListener('click', () => {
      otpSent = false;
      clearInterval(timerInterval);
      render();
    });

    // Resend OTP
    document.getElementById('resendOtp')?.addEventListener('click', async () => {
      const mobile = document.getElementById('loginMobile').value.trim();
      const result = await auth.sendOTP(mobile);
      if (result.success) {
        startResendTimer();
        showSuccess(t('login.otp_sent'));
        render();
      }
    });

    // Register link
    document.getElementById('goRegister')?.addEventListener('click', (e) => { e.preventDefault(); navigate('register'); });
  }

  function startResendTimer() {
    timerSeconds = 30;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timerSeconds--;
      const btn = document.getElementById('resendOtp');
      if (btn) {
        if (timerSeconds <= 0) {
          clearInterval(timerInterval);
          btn.textContent = t('login.resend');
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';
        } else {
          btn.textContent = `${t('login.resend')} (${timerSeconds}s)`;
        }
      }
    }, 1000);
  }

  function showError(msg) {
    const el = document.getElementById('loginError');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  function showSuccess(msg) {
    const el = document.getElementById('loginSuccess');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  function hideMessages() {
    const e = document.getElementById('loginError');
    const s = document.getElementById('loginSuccess');
    if (e) e.style.display = 'none';
    if (s) s.style.display = 'none';
  }

  render();
}
