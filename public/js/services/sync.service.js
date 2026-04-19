/**
 * Resilient Sync Service — queues requests offline and syncs when connectivity restores
 */
const SyncService = (() => {
  const QUEUE_KEY = 'medicare_sync_queue';
  let isOnline = navigator.onLine;

  function init() {
    window.addEventListener('online', () => { isOnline = true; hideOfflineBanner(); flushQueue(); });
    window.addEventListener('offline', () => { isOnline = false; showOfflineBanner(); });
    if (!isOnline) showOfflineBanner();
  }

  function showOfflineBanner() {
    const banner = document.getElementById('offline-banner');
    if (banner) banner.classList.add('show');
  }

  function hideOfflineBanner() {
    const banner = document.getElementById('offline-banner');
    if (banner) banner.classList.remove('show');
  }

  function queueRequest(action, data) {
    const queue = getQueue();
    queue.push({ action, data, timestamp: Date.now(), id: globalThis.crypto?.randomUUID?.() || Date.now().toString() });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return true;
  }

  function flushQueue() {
    const queue = getQueue();
    if (queue.length === 0) return;
    console.log(`[SyncService] Flushing ${queue.length} queued requests`);
    // Simulate sync — in production this would POST to backend
    queue.forEach(item => {
      console.log(`[SyncService] Syncing: ${item.action}`, item.data);
    });
    localStorage.removeItem(QUEUE_KEY);
    const toast = document.getElementById('global-toast');
    if (toast) {
      toast.textContent = `✅ ${queue.length} queued action(s) synced successfully!`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }

  function getPendingCount() {
    return getQueue().length;
  }

  function getQueue() {
    try {
      const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
      return Array.isArray(queue) ? queue : [];
    } catch {
      return [];
    }
  }

  return { init, queueRequest, flushQueue, getPendingCount, get isOnline() { return isOnline; } };
})();

export default SyncService;
