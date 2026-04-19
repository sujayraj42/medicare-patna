/**
 * Auth Service — Local Database + Firebase OTP Fallback
 * Implements a persistent user database for Registration, Password Login, and OTP Login.
 */
const AuthService = (() => {
  const SESSION_KEY = 'medicare_session';
  const DB_KEY = 'medicare_users_db';
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
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`[Auth] Failed to persist ${key}:`, err);
      return false;
    }
  }

  function sanitizeUser(user) {
    if (!user || typeof user !== 'object') return null;
    const sessionUser = { ...user };
    delete sessionUser.password;
    return sessionUser;
  }

  // Initialize DB if empty
  try {
    if (!localStorage.getItem(DB_KEY)) {
      // Add default test user
      localStorage.setItem(DB_KEY, JSON.stringify([{
        mobile: '9999999999',
        password: 'password123',
        name: 'Rahul Kumar',
        abhaId: '91-4202-3948-1102',
        dob: '1990-05-15',
        location: 'Kankarbagh, Patna',
        verified: true
      }]));
    }
  } catch (err) {
    console.warn('[Auth] Unable to initialize local user database:', err);
  }

  function getUsers() {
    const users = readJson(DB_KEY, []);
    return Array.isArray(users) ? users : [];
  }

  function saveUsers(users) {
    return writeJson(DB_KEY, users);
  }

  /**
   * Password Login
   */
  function login(mobile, password) {
    const normalizedMobile = normalizeMobile(mobile);
    if (!/^\d{10}$/.test(normalizedMobile)) {
      return { success: false, error: 'Enter valid 10-digit mobile number.' };
    }
    if (!String(password || '').trim()) {
      return { success: false, error: 'Enter your password.' };
    }

    const users = getUsers();
    const user = users.find(u => normalizeMobile(u.mobile) === normalizedMobile && u.password === password);
    
    if (user) {
      const sessionUser = sanitizeUser({ ...user, authMethod: 'password' });
      if (!writeJson(SESSION_KEY, sessionUser)) {
        return { success: false, error: 'Unable to save login session. Please check browser storage.' };
      }
      notify();
      return { success: true, user: sessionUser };
    }
    return { success: false, error: 'Invalid mobile number or password.' };
  }

  /**
   * Register new user to database
   */
  function register(data) {
    const users = getUsers();
    const mobile = normalizeMobile(data.mobile);
    const name = String(data.name || '').trim();
    const password = String(data.password || '').trim();

    if (!name) {
      return { success: false, error: 'Enter your full name.' };
    }
    if (!/^\d{10}$/.test(mobile)) {
      return { success: false, error: 'Enter valid 10-digit mobile number.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    if (users.find(u => normalizeMobile(u.mobile) === mobile)) {
      return { success: false, error: 'Mobile number already registered.' };
    }
    
    const newUser = {
      ...data,
      name,
      mobile,
      password,
      abhaId: '91-' + Math.floor(1000 + Math.random() * 9000) + '-0000-0000',
      location: data.location || 'Patna, Bihar',
      verified: true
    };
    
    users.push(newUser);
    if (!saveUsers(users)) {
      return { success: false, error: 'Unable to create account. Please check browser storage.' };
    }

    const sessionUser = sanitizeUser({ ...newUser, authMethod: 'register' });
    if (!writeJson(SESSION_KEY, sessionUser)) {
      return { success: false, error: 'Account created, but login session could not be saved.' };
    }
    notify();
    return { success: true, user: sessionUser };
  }

  /**
   * Send OTP (Simulated for all numbers)
   */
  async function sendOTP(phone) {
    const mobile = normalizeMobile(phone);
    if (!/^\d{10}$/.test(mobile)) {
      return { success: false, error: 'Enter valid 10-digit mobile number' };
    }

    // Demo mode — simulate OTP sent
    console.log(`[Auth] OTP "123456" sent to ${mobile}`);
    confirmationResult = { confirm: async (code) => {
      if (code === '123456') return { user: { phoneNumber: mobile } };
      throw new Error('Invalid OTP');
    }};
    return { success: true, demo: true };
  }

  /**
   * Verify OTP and Login/Register
   */
  async function verifyOTP(code) {
    if (!confirmationResult) return { success: false, error: 'Request OTP first' };
    if (!/^\d{6}$/.test(code)) return { success: false, error: 'Enter 6-digit OTP' };

    try {
      const result = await confirmationResult.confirm(code);
      const phone = result.user.phoneNumber;
      
      const users = getUsers();
      let user = users.find(u => normalizeMobile(u.mobile) === phone);
      
      // If user doesn't exist, auto-create them
      if (!user) {
        user = {
          mobile: phone,
          name: 'New User ' + phone.substring(6),
          abhaId: '91-0000-0000-0000',
          location: 'Patna, Bihar',
          verified: true
        };
        users.push(user);
        saveUsers(users);
      }

      const sessionUser = sanitizeUser({ ...user, authMethod: 'otp' });
      if (!writeJson(SESSION_KEY, sessionUser)) {
        return { success: false, error: 'Unable to save login session. Please check browser storage.' };
      }
      notify();
      return { success: true, user: sessionUser };
    } catch (err) {
      return { success: false, error: 'Invalid OTP code.' };
    }
  }

  function getUser() {
    return sanitizeUser(readJson(SESSION_KEY, null));
  }

  function updateProfile(updates) {
    const current = getUser();
    if (!current) return { success: false, error: 'You must be logged in.' };

    const name = String(updates.name || current.name || '').trim();
    const mobile = normalizeMobile(updates.mobile || current.mobile);
    if (!name) return { success: false, error: 'Name cannot be empty.' };
    if (!/^\d{10}$/.test(mobile)) return { success: false, error: 'Enter valid 10-digit mobile number.' };

    const users = getUsers();
    const duplicate = users.find(u => normalizeMobile(u.mobile) === mobile && normalizeMobile(u.mobile) !== normalizeMobile(current.mobile));
    if (duplicate) return { success: false, error: 'Mobile number already belongs to another account.' };

    const nextUser = {
      ...current,
      name,
      mobile,
      dob: updates.dob || current.dob || '',
      location: updates.location || current.location || 'Patna, Bihar',
      avatar: updates.avatar || current.avatar || ''
    };

    let matched = false;
    const nextUsers = users.map(u => {
      if (normalizeMobile(u.mobile) !== normalizeMobile(current.mobile)) return u;
      matched = true;
      return { ...u, ...nextUser, password: u.password };
    });
    if (!matched) nextUsers.push(nextUser);

    if (!saveUsers(nextUsers) || !writeJson(SESSION_KEY, nextUser)) {
      return { success: false, error: 'Profile could not be saved.' };
    }
    notify();
    return { success: true, user: nextUser };
  }

  function changePassword(currentPassword, nextPassword) {
    const current = getUser();
    if (!current) return { success: false, error: 'You must be logged in.' };
    if (String(nextPassword || '').length < 6) return { success: false, error: 'New password must be at least 6 characters.' };

    const users = getUsers();
    const user = users.find(u => normalizeMobile(u.mobile) === normalizeMobile(current.mobile));
    if (!user || user.password !== currentPassword) return { success: false, error: 'Current password is incorrect.' };

    user.password = nextPassword;
    if (!saveUsers(users)) return { success: false, error: 'Password could not be saved.' };
    return { success: true };
  }

  async function logout() {
    try { localStorage.removeItem(SESSION_KEY); } catch {}
    confirmationResult = null;
    notify();
  }

  function isLoggedIn() { return !!getUser(); }
  function subscribe(fn) {
    if (typeof fn !== 'function') return () => {};
    listeners.push(fn);
    return () => {
      const index = listeners.indexOf(fn);
      if (index >= 0) listeners.splice(index, 1);
    };
  }
  function notify() {
    const user = getUser();
    listeners.slice().forEach(fn => {
      try { fn(user); } catch (err) { console.warn('[Auth] Listener failed:', err); }
    });
  }

  return {
    getUser, login, register, logout, isLoggedIn, subscribe, updateProfile, changePassword,
    sendOTP, verifyOTP, setupRecaptcha: () => {}
  };
})();

export default AuthService;
