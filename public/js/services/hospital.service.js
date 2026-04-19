/**
 * Hospital Service — Fetches all data from Firebase Realtime Database
 * Falls back to localStorage cache when offline
 */
import FirebaseService from './firebase.service.js';

const CACHE_KEY = 'medicare_db_cache';

let hospitals = [];
let doctors = [];
let diagnosticLabs = [];
let emergencyContacts = [];
let bloodBanks = [];
let wardSuggestions = [];
let specialties = [];
let blocks = [];
let labTestCategories = [];
let _loaded = false;

function saveCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      hospitals, doctors, diagnosticLabs, emergencyContacts, bloodBanks,
      wardSuggestions, specialties, blocks, labTestCategories, _ts: Date.now()
    }));
  } catch {}
}

function loadCache() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (c && c.hospitals) {
      hospitals = c.hospitals;
      doctors = c.doctors;
      diagnosticLabs = c.diagnosticLabs;
      emergencyContacts = c.emergencyContacts;
      bloodBanks = c.bloodBanks;
      wardSuggestions = c.wardSuggestions;
      specialties = c.specialties;
      blocks = c.blocks;
      labTestCategories = c.labTestCategories;
      _loaded = true;
      console.log('[HospitalService] Loaded from cache');
      return true;
    }
  } catch {}
  return false;
}

function objToArray(obj) {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return Object.values(obj);
}

async function fetchFromFirebase() {
  const db = await FirebaseService.whenReady();
  if (!db) {
    console.warn('[HospitalService] Firebase not available, using cache');
    return loadCache();
  }

  try {
    const snap = await db.ref('/').once('value');
    const data = snap.val();
    if (!data) {
      console.warn('[HospitalService] No data in Firebase');
      return loadCache();
    }

    hospitals = objToArray(data.hospitals);
    doctors = objToArray(data.doctors);
    diagnosticLabs = objToArray(data.diagnosticLabs);
    emergencyContacts = objToArray(data.emergencyContacts);
    bloodBanks = objToArray(data.bloodBanks);
    wardSuggestions = objToArray(data.wards);
    specialties = data.meta?.specialties || [];
    blocks = data.meta?.blocks || [];
    labTestCategories = data.meta?.labTestCategories || [];

    _loaded = true;
    saveCache();
    console.log('[HospitalService] Loaded from Firebase:', {
      hospitals: hospitals.length,
      doctors: doctors.length,
      labs: diagnosticLabs.length,
      wards: wardSuggestions.length
    });
    return true;
  } catch (err) {
    console.error('[HospitalService] Firebase fetch failed:', err);
    return loadCache();
  }
}

// ── Query helpers ──
function normalize(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, '');
}

function matchesSpecialty(doctor, spec) {
  const s = normalize(spec);
  if (s === 'general') return normalize(doctor.specialty) === 'general';
  return normalize(doctor.specialty).includes(s);
}

function getDoctors({ specialty, hospitalId, wardId } = {}) {
  const selectedWard = wardSuggestions.find(w => w.id === wardId);
  return doctors
    .filter(d => !specialty || matchesSpecialty(d, specialty))
    .filter(d => !hospitalId || d.hospitalId === hospitalId)
    .map(d => {
      const hospital = hospitals.find(h => h.id === d.hospitalId);
      const areaMatch = selectedWard?.nearbyHospitalIds?.includes(d.hospitalId) ? 'Near selected area' : 'City-wide OPD';
      return { ...d, hospital, areaMatch };
    })
    .sort((a, b) => {
      const aNear = selectedWard?.nearbyHospitalIds?.includes(a.hospitalId) ? 0 : 1;
      const bNear = selectedWard?.nearbyHospitalIds?.includes(b.hospitalId) ? 0 : 1;
      return aNear - bNear || a.hospital?.name?.localeCompare(b.hospital?.name) || a.name.localeCompare(b.name);
    });
}

function getDoctorById(id) {
  const doctor = doctors.find(d => d.id === id);
  if (!doctor) return null;
  return { ...doctor, hospital: hospitals.find(h => h.id === doctor.hospitalId) };
}

function getWardSuggestions(query = '') {
  const q = normalize(query);
  if (!q) return wardSuggestions.slice(0, 8);
  return wardSuggestions.filter(w => {
    const aliases = Array.isArray(w.aliases) ? w.aliases.join(' ') : '';
    const text = normalize(`${w.ward} ${w.label} ${w.circle} ${w.block} ${w.pin} ${aliases}`);
    return text.includes(q);
  }).slice(0, 8);
}

function getWardById(id) {
  return wardSuggestions.find(w => w.id === id) || null;
}

function getDiagnosticLabs({ test, wardId } = {}) {
  const selectedWard = wardSuggestions.find(w => w.id === wardId);
  return diagnosticLabs
    .filter(l => !test || test === 'All' || (Array.isArray(l.tests) && l.tests.includes(test)))
    .map(l => {
      const areaMatch = selectedWard ? 'City-wide Service' : 'Patna';
      return { ...l, areaMatch };
    });
}

function getLabById(id) {
  return diagnosticLabs.find(l => l.id === id) || null;
}

// ── Init: load from cache first, then update from Firebase ──
loadCache();
const _initPromise = fetchFromFirebase();

const HospitalService = {
  init: () => _initPromise,
  isLoaded: () => _loaded,
  getAll: () => [...hospitals],
  getById: (id) => hospitals.find(h => h.id === id),
  getBySpecialty: (spec) => hospitals.filter(h =>
    h.departments?.some(d => d.toLowerCase().includes(spec.toLowerCase()))
  ),
  getByType: (type) => hospitals.filter(h => h.type === type),
  getEmergencyContacts: () => [...emergencyContacts],
  getBloodBanks: () => [...bloodBanks],
  getSpecialties: () => [...specialties],
  getBlocks: () => [...blocks],
  getLabTestCategories: () => ['All', ...labTestCategories],
  getDiagnosticLabs,
  getLabById,
  getDoctors,
  getDoctorById,
  getWardSuggestions,
  getWardById,
  getOpdStatus: (id) => {
    const h = hospitals.find(h => h.id === id);
    return h ? h.opd : null;
  }
};

export default HospitalService;
