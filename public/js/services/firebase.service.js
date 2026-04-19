/**
 * Firebase Configuration & Initialization
 * Uses Firebase Compat SDK from CDN for RTDB + Auth (Phone OTP)
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDTlWih_R9tPmqGNuAPJzRtodaWlZHs6WQ",
  authDomain: "hospital-9835.firebaseapp.com",
  databaseURL: "https://hospital-9835-default-rtdb.firebaseio.com",
  projectId: "hospital-9835",
  storageBucket: "hospital-9835.firebasestorage.app",
  messagingSenderId: "657037209903",
  appId: "1:657037209903:web:cc95ba49148e0dd94a31da"
};

let _db = null;
let _auth = null;
let _ready = false;
const _waiters = [];

function _loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function init() {
  if (_ready) return _db;
  try {
    await _loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
    await _loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js');
    await _loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js');

    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    _db = firebase.database();
    _auth = firebase.auth();

    // Set language to user's browser language
    _auth.languageCode = navigator.language || 'en';

    try { _db.goOnline(); } catch {}

    _ready = true;
    _waiters.forEach(fn => fn(_db));
    _waiters.length = 0;
    console.log('[Firebase] Initialized with Auth + RTDB');
    return _db;
  } catch (err) {
    console.error('[Firebase] Init failed:', err);
    return null;
  }
}

function getDb() { return _db; }
function getAuth() { return _auth; }

function whenReady() {
  if (_ready) return Promise.resolve(_db);
  return new Promise(resolve => _waiters.push(resolve));
}

// Start loading immediately
const readyPromise = init();

const FirebaseService = {
  init, getDb, getAuth, whenReady, readyPromise,
  get config() { return FIREBASE_CONFIG; }
};
export default FirebaseService;
