/**
 * Geolocation Service — Real GPS with Capacitor fallback
 * Uses browser Geolocation API (works on web + Capacitor native)
 */
const GeoService = (() => {
  const LOCATION_KEY = 'medicare_last_location';
  let currentPosition = null;
  let watchId = null;
  const listeners = [];

  // Known Patna landmarks for reverse geocoding fallback
  const patnaLandmarks = [
    { name: 'Kankarbagh', lat: 25.5939, lng: 85.1786 },
    { name: 'Boring Road', lat: 25.6093, lng: 85.1256 },
    { name: 'Patna Junction', lat: 25.6116, lng: 85.1440 },
    { name: 'Gandhi Maidan', lat: 25.6120, lng: 85.1392 },
    { name: 'Phulwari Sharif', lat: 25.5768, lng: 85.0861 },
    { name: 'Danapur', lat: 25.6257, lng: 85.0498 },
    { name: 'Bailey Road', lat: 25.6115, lng: 85.1376 },
    { name: 'Rajendra Nagar', lat: 25.5988, lng: 85.1087 },
    { name: 'Patliputra Colony', lat: 25.6221, lng: 85.0969 },
    { name: 'Ashok Rajpath', lat: 25.6126, lng: 85.1551 },
    { name: 'Agam Kuan', lat: 25.5982, lng: 85.1745 },
    { name: 'Sheikhpura', lat: 25.6087, lng: 85.1204 }
  ];

  function init() {
    // Try loading cached position
    try {
      const cached = JSON.parse(localStorage.getItem(LOCATION_KEY));
      if (cached) currentPosition = cached;
    } catch {}
  }

  async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const fallback = getFallbackPosition();
        currentPosition = fallback;
        resolve(fallback);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
            areaName: getNearestLandmark(pos.coords.latitude, pos.coords.longitude)
          };
          currentPosition = location;
          localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
          notify(location);
          resolve(location);
        },
        (err) => {
          console.warn('[GeoService] Geolocation error:', err.message);
          const fallback = getFallbackPosition();
          currentPosition = fallback;
          resolve(fallback);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  function startWatching() {
    if (!navigator.geolocation || watchId !== null) return;

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
          areaName: getNearestLandmark(pos.coords.latitude, pos.coords.longitude)
        };
        currentPosition = location;
        localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
        notify(location);
      },
      (err) => { console.warn('[GeoService] Watch error:', err.message); },
      { enableHighAccuracy: true, maximumAge: 30000 }
    );
  }

  function stopWatching() {
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  }

  function getNearestLandmark(lat, lng) {
    let nearest = patnaLandmarks[0];
    let minDist = Infinity;
    for (const lm of patnaLandmarks) {
      const d = haversine(lat, lng, lm.lat, lm.lng);
      if (d < minDist) { minDist = d; nearest = lm; }
    }
    return nearest.name;
  }

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function distanceTo(lat, lng) {
    if (!currentPosition) return null;
    return haversine(currentPosition.lat, currentPosition.lng, lat, lng).toFixed(1);
  }

  function getFallbackPosition() {
    // Default to Kankarbagh, Patna
    return { lat: 25.5939, lng: 85.1786, accuracy: 1000, timestamp: Date.now(), areaName: 'Kankarbagh', isFallback: true };
  }

  function getPosition() { return currentPosition || getFallbackPosition(); }

  function subscribe(fn) { listeners.push(fn); }
  function notify(pos) { listeners.forEach(fn => fn(pos)); }

  return { init, getCurrentPosition, startWatching, stopWatching, getPosition, distanceTo, getNearestLandmark, subscribe };
})();

export default GeoService;
