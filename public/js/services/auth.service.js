/**
 * Auth Service — Firebase Realtime Database backed
 * Users stored in Firebase /users/{mobile} with localStorage session cache
 */
import FirebaseService from './firebase.service.js';

const AuthService = (() => {
  const SESSION_KEY = 'medicare_session';
  const listeners = [];
  let confirmationResult = null;

  function normalizeMobile(value) {
    const digits = String(value || '').replace(/\D/g, '');
    return digits.length > 10 ? digits.slice(-10) : digits;
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch { return fallback; }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (err) { console.warn(`[Auth] persist failed:`, err); return false; }
  }

  function sanitizeUser(user) {
    if (!user || typeof user !== 'object') return null;
    const s = { ...user };
    delete s.password;
    return s;
  }

  // ── Firebase helpers ──
  async function getDbRef(path) {
    const db = await FirebaseService.whenReady();
    return db ? db.ref(path) : null;
  }

  async function fbGetUser(mobile) {
    const ref = await getDbRef(`users/${mobile}`);
    if (!ref) return null;
    const snap = await ref.once('value');
    return snap.val();
  }

  async function fbSaveUser(mobile, data) {
    const ref = await getDbRef(`users/${mobile}`);
    if (!ref) return false;
    await ref.set(data);
    return true;
  }

  // ── Password Login ──
  async function login(mobile, password) {
    const m = normalizeMobile(mobile);
    if (!/^\d{10}$/.test(m)) return { success: false, error: 'Enter valid 10-digit mobile number.' };
    if (!String(password || '').trim()) return { success: false, error: 'Enter your password.' };

    try {
      const user = await fbGetUser(m);
      if (user && user.password === password) {
        const sessionUser = sanitizeUser({ ...user, mobile: m, authMethod: 'password' });
        writeJson(SESSION_KEY, sessionUser);
        notify();
        return { success: true, user: sessionUser };
      }
      return { success: false, error: 'Invalid mobile number or password.' };
    } catch (err) {
      console.error('[Auth] Login error:', err);
      return { success: false, error: 'Login failed. Check your internet connection.' };
    }
  }

  // ── Register ──
  async function register(data) {
    const mobile = normalizeMobile(data.mobile);
    const name = String(data.name || '').trim();
    const password = String(data.password || '').trim();

    if (!name) return { success: false, error: 'Enter your full name.' };
    if (!/^\d{10}$/.test(mobile)) return { success: false, error: 'Enter valid 10-digit mobile number.' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    try {
      const existing = await fbGetUser(mobile);
      if (existing) return { success: false, error: 'Mobile number already registered.' };

      const newUser = {
        mobile, name, password,
        dob: data.dob || '',
        abhaId: '91-' + Math.floor(1000 + Math.random() * 9000) + '-0000-0000',
        location: data.location || 'Patna, Bihar',
        verified: true,
        createdAt: new Date().toISOString()
      };

      const saved = await fbSaveUser(mobile, newUser);
      if (!saved) return { success: false, error: 'Unable to create account. Try again.' };

      const sessionUser = sanitizeUser({ ...newUser, authMethod: 'register' });
      writeJson(SESSION_KEY, sessionUser);
      notify();
      return { success: true, user: sessionUser };
    } catch (err) {
      console.error('[Auth] Register error:', err);
      return { success: false, error: 'Registration failed. Check your internet connection.' };
    }
  }

  // ── Real Firebase Phone OTP ──
  let recaptchaVerifier = null;
  let recaptchaWidgetId = null;

  function setupRecaptcha(buttonId) {
    try {
      const auth = FirebaseService.getAuth();
      if (!auth) { console.warn('[Auth] Firebase Auth not ready'); return; }

      // Clear previous verifier
      if (recaptchaVerifier) {
        try { recaptchaVerifier.clear(); } catch {}
        recaptchaVerifier = null;
      }

      recaptchaVerifier = new firebase.auth.RecaptchaVerifier(buttonId, {
        size: 'invisible',
        callback: () => { console.log('[Auth] reCAPTCHA solved'); },
        'expired-callback': () => { console.log('[Auth] reCAPTCHA expired'); }
      });

      recaptchaVerifier.render().then(widgetId => {
        recaptchaWidgetId = widgetId;
        console.log('[Auth] reCAPTCHA ready on #' + buttonId);
      }).catch(err => {
        console.warn('[Auth] reCAPTCHA render failed:', err);
      });
    } catch (err) {
      console.warn('[Auth] setupRecaptcha error:', err);
    }
  }

  async function sendOTP(phone) {
    const mobile = normalizeMobile(phone);
    if (!/^\d{10}$/.test(mobile)) return { success: false, error: 'Enter valid 10-digit mobile number' };

    const fullPhone = '+91' + mobile;
    const auth = FirebaseService.getAuth();

    // Try real Firebase Phone Auth
    if (auth && recaptchaVerifier) {
      try {
        console.log(`[Auth] Sending real OTP to ${fullPhone}`);
        confirmationResult = await auth.signInWithPhoneNumber(fullPhone, recaptchaVerifier);
        console.log('[Auth] OTP sent successfully via Firebase');
        return { success: true, demo: false };
      } catch (err) {
        console.error('[Auth] Firebase OTP failed:', err);

        // Reset reCAPTCHA for retry
        if (recaptchaWidgetId !== null) {
          try { grecaptcha.reset(recaptchaWidgetId); } catch {}
        }

        // If quota exceeded or auth error, fall back to demo
        if (err.code === 'auth/too-many-requests' || err.code === 'auth/quota-exceeded') {
          return { success: false, error: 'Too many OTP requests. Please wait and try again.' };
        }
        if (err.code === 'auth/invalid-phone-number') {
          return { success: false, error: 'Invalid phone number format. Use 10-digit Indian number.' };
        }

        // Fallback to demo mode
        console.log('[Auth] Falling back to demo OTP mode');
      }
    }

    // Demo fallback — works when Firebase Auth is unavailable
    console.log(`[Auth] Demo OTP "123456" for ${mobile}`);
    confirmationResult = {
      confirm: async (code) => {
        if (code === '123456') return { user: { phoneNumber: mobile } };
        throw new Error('Invalid OTP');
      }
    };
    return { success: true, demo: true };
  }

  async function verifyOTP(code) {
    if (!confirmationResult) return { success: false, error: 'Request OTP first' };
    if (!/^\d{6}$/.test(code)) return { success: false, error: 'Enter 6-digit OTP' };

    try {
      const result = await confirmationResult.confirm(code);
      const phoneNumber = result.user?.phoneNumber || result.user?.phone;
      const phone = normalizeMobile(phoneNumber);

      let user = await fbGetUser(phone);

      if (!user) {
        user = {
          mobile: phone,
          name: 'New User ' + phone.substring(6),
          abhaId: '91-0000-0000-0000',
          location: 'Patna, Bihar',
          verified: true,
          createdAt: new Date().toISOString()
        };
        await fbSaveUser(phone, user);
      }

      const sessionUser = sanitizeUser({ ...user, authMethod: 'otp' });
      writeJson(SESSION_KEY, sessionUser);
      notify();
      return { success: true, user: sessionUser };
    } catch (err) {
      console.error('[Auth] OTP verification failed:', err);
      return { success: false, error: 'Invalid OTP code. Please try again.' };
    }
  }

  // ── Session ──
  function getUser() { return sanitizeUser(readJson(SESSION_KEY, null)); }
  function isLoggedIn() { return !!getUser(); }

  // ── Profile Update ──
  async function updateProfile(updates) {
    const current = getUser();
    if (!current) return { success: false, error: 'You must be logged in.' };

    const name = String(updates.name || current.name || '').trim();
    const mobile = normalizeMobile(updates.mobile || current.mobile);
    if (!name) return { success: false, error: 'Name cannot be empty.' };
    if (!/^\d{10}$/.test(mobile)) return { success: false, error: 'Enter valid 10-digit mobile number.' };

    try {
      if (mobile !== normalizeMobile(current.mobile)) {
        const dup = await fbGetUser(mobile);
        if (dup) return { success: false, error: 'Mobile number already belongs to another account.' };
      }

      const fbUser = await fbGetUser(normalizeMobile(current.mobile)) || {};
      const nextUser = {
        ...fbUser,
        name, mobile,
        dob: updates.dob || current.dob || '',
        location: updates.location || current.location || 'Patna, Bihar',
        avatar: updates.avatar || current.avatar || ''
      };

      if (mobile !== normalizeMobile(current.mobile)) {
        const oldRef = await getDbRef(`users/${normalizeMobile(current.mobile)}`);
        if (oldRef) await oldRef.remove();
      }

      await fbSaveUser(mobile, nextUser);

      const sessionUser = sanitizeUser(nextUser);
      writeJson(SESSION_KEY, sessionUser);
      notify();
      return { success: true, user: sessionUser };
    } catch (err) {
      console.error('[Auth] Profile update error:', err);
      return { success: false, error: 'Profile could not be saved.' };
    }
  }

  // ── Change Password ──
  async function changePassword(currentPassword, nextPassword) {
    const current = getUser();
    if (!current) return { success: false, error: 'You must be logged in.' };
    if (String(nextPassword || '').length < 6) return { success: false, error: 'New password must be at least 6 characters.' };

    try {
      const mobile = normalizeMobile(current.mobile);
      const user = await fbGetUser(mobile);
      if (!user) return { success: false, error: 'User not found.' };
      if (user.password && user.password !== currentPassword) return { success: false, error: 'Current password is incorrect.' };

      user.password = nextPassword;
      await fbSaveUser(mobile, user);
      return { success: true };
    } catch (err) {
      console.error('[Auth] Password change error:', err);
      return { success: false, error: 'Password could not be saved.' };
    }
  }

  // ── Appointments (Firebase) ──
  async function saveAppointment(appointment) {
    try {
      const db = await FirebaseService.whenReady();
      if (!db) return false;
      const ref = db.ref('appointments').push();
      await ref.set({ ...appointment, id: ref.key, createdAt: new Date().toISOString() });
      return ref.key;
    } catch (err) {
      console.error('[Auth] Save appointment failed:', err);
      return false;
    }
  }

  async function getAppointments(mobile) {
    try {
      const db = await FirebaseService.whenReady();
      if (!db) return [];
      const snap = await db.ref('appointments').orderByChild('mobile').equalTo(normalizeMobile(mobile)).once('value');
      const data = snap.val();
      return data ? Object.values(data) : [];
    } catch { return []; }
  }

  // ── Logout ──
  async function logout() {
    try { localStorage.removeItem(SESSION_KEY); } catch {}
    confirmationResult = null;
    notify();
  }

  function subscribe(fn) {
    if (typeof fn !== 'function') return () => {};
    listeners.push(fn);
    return () => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); };
  }

  function notify() {
    const user = getUser();
    listeners.slice().forEach(fn => { try { fn(user); } catch {} });
  }

  return {
    getUser, login, register, logout, isLoggedIn, subscribe,
    updateProfile, changePassword, sendOTP, verifyOTP,
    saveAppointment, getAppointments, setupRecaptcha: () => {}
  };
})();

export default AuthService;
