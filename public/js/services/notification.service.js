/**
 * Notification Service - local in-app notifications and action reminders.
 */
const NotificationService = (() => {
  const STORE_KEY = 'medicare_notifications';
  const listeners = [];

  const defaults = [
    {
      id: 'welcome-care',
      title: 'Complete your care profile',
      body: 'Add your locality and date of birth so OPD bookings can match the right counter.',
      type: 'profile',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'opd-reminder',
      title: 'Government OPD timing',
      body: 'Most Patna government OPDs are busiest before noon. Carry ID and prior reports.',
      type: 'booking',
      read: false,
      createdAt: new Date().toISOString()
    }
  ];

  function readAll() {
    try {
      const items = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (Array.isArray(items)) return items;
    } catch {}
    persist(defaults);
    return [...defaults];
  }

  function persist(items) {
    localStorage.setItem(STORE_KEY, JSON.stringify(items));
  }

  function notify() {
    const items = readAll();
    listeners.slice().forEach(fn => {
      try { fn(items); } catch (err) { console.warn('[Notifications] Listener failed:', err); }
    });
  }

  function getAll() {
    return readAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function getUnreadCount() {
    return readAll().filter(item => !item.read).length;
  }

  function add({ title, body, type = 'info', meta = {} }) {
    const item = {
      id: globalThis.crypto?.randomUUID?.() || `notification_${Date.now()}`,
      title,
      body,
      type,
      meta,
      read: false,
      createdAt: new Date().toISOString()
    };
    const next = [item, ...readAll()].slice(0, 50);
    persist(next);
    notify();
    return item;
  }

  function markRead(id) {
    const next = readAll().map(item => item.id === id ? { ...item, read: true } : item);
    persist(next);
    notify();
  }

  function markAllRead() {
    const next = readAll().map(item => ({ ...item, read: true }));
    persist(next);
    notify();
  }

  function clear() {
    persist([]);
    notify();
  }

  function subscribe(fn) {
    if (typeof fn !== 'function') return () => {};
    listeners.push(fn);
    return () => {
      const index = listeners.indexOf(fn);
      if (index >= 0) listeners.splice(index, 1);
    };
  }

  return { getAll, getUnreadCount, add, markRead, markAllRead, clear, subscribe };
})();

export default NotificationService;
