/**
 * Global Error Handler — ensures the app never crashes during critical medical use
 */
const ErrorHandler = (() => {
  const errorLog = [];

  function init() {
    window.onerror = (msg, src, line, col, err) => {
      log('runtime', msg, { src, line, col, stack: err?.stack });
      showUserFriendlyError('Something went wrong. Your data is safe.');
      return true; // prevent default browser error
    };

    window.onunhandledrejection = (event) => {
      log('promise', event.reason?.message || 'Unhandled promise rejection', {
        stack: event.reason?.stack
      });
      event.preventDefault();
      showUserFriendlyError('A background task failed. Please try again.');
    };
  }

  function log(type, message, details = {}) {
    const entry = { type, message, details, timestamp: new Date().toISOString() };
    errorLog.push(entry);
    if (errorLog.length > 50) errorLog.shift();
    console.error(`[MediCare Error] ${type}:`, message, details);
  }

  function showUserFriendlyError(msg) {
    const toast = document.getElementById('global-toast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }
  }

  function getLog() { return [...errorLog]; }

  return { init, log, showUserFriendlyError, getLog };
})();

export default ErrorHandler;
