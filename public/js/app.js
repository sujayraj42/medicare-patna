/**
 * MediCare — App Router & State Manager
 * Uses hash-based routing and Angular Signals-inspired reactive state
 */
import ErrorHandler from './utils/error-handler.js';
import FirebaseService from './services/firebase.service.js';
import HospitalService from './services/hospital.service.js';
import AuthService from './services/auth.service.js';
import SyncService from './services/sync.service.js';
import I18nService from './services/i18n.service.js';
import GeoService from './services/geo.service.js';
import FileService from './services/file.service.js';
import WhatsAppService from './services/whatsapp.service.js';
import NotificationService from './services/notification.service.js';
import { renderLogin } from './pages/login.js';
import { renderRegister } from './pages/register.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderBooking } from './pages/booking.js';
import { renderVault } from './pages/vault.js';
import { renderEmergency } from './pages/emergency.js';
import { renderAyushman } from './pages/ayushman.js';
import { renderNotifications } from './pages/notifications.js';
import { renderProfile } from './pages/profile.js';

// ── Initialize Services ──
ErrorHandler.init();
SyncService.init();
GeoService.init();

// Preload location on boot
GeoService.getCurrentPosition().catch(() => {});

// ── State (Signal-like reactive pattern) ──
const state = { currentPage: '', user: AuthService.getUser() };

AuthService.subscribe(user => { state.user = user; });

// Re-render on language change
I18nService.subscribe(() => { handleRoute(); });
NotificationService.subscribe(() => { updateHeaderNotificationCount(); });

// ── Router ──
const routes = {
  login: { render: renderLogin, auth: false, nav: false },
  register: { render: renderRegister, auth: false, nav: false },
  dashboard: { render: renderDashboard, auth: true, nav: true },
  booking: { render: renderBooking, auth: true, nav: true },
  vault: { render: renderVault, auth: true, nav: true },
  emergency: { render: renderEmergency, auth: true, nav: true },
  ayushman: { render: renderAyushman, auth: true, nav: true },
  notifications: { render: renderNotifications, auth: true, nav: true },
  profile: { render: renderProfile, auth: true, nav: true }
};

function navigate(page) {
  // Stop geolocation watching when leaving emergency
  if (state.currentPage === 'emergency' && page !== 'emergency') {
    GeoService.stopWatching();
  }
  const nextHash = `#${page}`;
  if (window.location.hash === nextHash) {
    handleRoute();
    return;
  }
  window.location.hash = nextHash;
}

// Expose globally for inline handlers
window.mcNavigate = navigate;

function renderHeader(page) {
  const t = I18nService.t.bind(I18nService);
  const user = AuthService.getUser();
  const unreadCount = NotificationService.getUnreadCount();
  return `
  <header class="glass-header" id="mainHeader">
    <div style="display:flex;align-items:center;gap:1rem">
      <button id="menuToggle" class="icon-button" style="color:var(--primary-container)" aria-label="Open navigation"><span class="material-symbols-outlined">menu</span></button>
      <span class="logo-text" style="color:var(--primary-container)">MediCare</span>
    </div>
    <div class="header-actions" style="display:flex;align-items:center;gap:0.75rem">
      ${page === 'emergency' ? '<span class="badge header-context" style="background:var(--error);color:white;padding:0.375rem 0.75rem">Emergency Mode</span>' : `<span class="badge badge-primary header-context" style="padding:0.375rem 0.75rem">${t('common.patna_bihar').toUpperCase()}</span>`}
      <button id="headerLangToggle" style="padding:0.375rem 0.625rem;border-radius:var(--radius-sm);background:var(--surface-container-highest);font-size:11px;font-weight:700;color:var(--primary);cursor:pointer;transition:all 0.2s" title="Toggle Hindi/English">${t('common.language')}</button>
      <button id="headerNotifications" class="icon-button notification-button" title="Notifications" aria-label="Notifications">
        <span class="material-symbols-outlined" style="font-size:22px">notifications</span>
        ${unreadCount ? `<span class="notification-dot">${unreadCount > 9 ? '9+' : unreadCount}</span>` : ''}
      </button>
      <button id="headerLogout" style="color:var(--on-surface-variant)" title="${t('common.logout')}"><span class="material-symbols-outlined" style="font-size:22px">logout</span></button>
      <button id="headerProfile" class="avatar" title="Profile" aria-label="Profile">${user?.avatar ? `<img src="${user.avatar}" alt="Profile">` : '<span class="material-symbols-outlined" style="font-size:2rem;color:var(--outline);display:flex;align-items:center;justify-content:center;width:100%;height:100%">account_circle</span>'}</button>
    </div>
  </header>`;
}

function updateHeaderNotificationCount() {
  const button = document.getElementById('headerNotifications');
  if (!button) return;
  button.querySelector('.notification-dot')?.remove();
  const unreadCount = NotificationService.getUnreadCount();
  if (!unreadCount) return;
  const dot = document.createElement('span');
  dot.className = 'notification-dot';
  dot.textContent = unreadCount > 9 ? '9+' : String(unreadCount);
  button.appendChild(dot);
}

function renderSideDrawer(activePage) {
  const t = I18nService.t.bind(I18nService);
  const navItems = [
    { id: 'dashboard', icon: 'home_health', label: t('nav.home') },
    { id: 'booking', icon: 'calendar_month', label: t('nav.booking') },
    { id: 'vault', icon: 'folder_open', label: t('nav.vault') },
    { id: 'ayushman', icon: 'verified_user', label: t('nav.ayushman') },
    { id: 'emergency', icon: 'emergency', label: t('nav.sos') },
    { id: 'notifications', icon: 'notifications', label: 'Notifications' },
    { id: 'profile', icon: 'account_circle', label: 'Profile' }
  ];

  return `
  <div class="drawer-backdrop" id="drawerBackdrop"></div>
  <aside class="side-drawer" id="sideDrawer" aria-hidden="true">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem">
      <span class="logo-text" style="color:var(--primary-container)">MediCare</span>
      <button id="drawerClose" class="icon-button" aria-label="Close navigation"><span class="material-symbols-outlined">close</span></button>
    </div>
    <nav style="display:flex;flex-direction:column;gap:0.5rem">
      ${navItems.map(item => `
      <button class="drawer-nav-item ${activePage === item.id ? 'active' : ''}" data-route="${item.id}">
        <span class="material-symbols-outlined">${item.icon}</span>
        <span>${item.label}</span>
      </button>`).join('')}
    </nav>
  </aside>`;
}

function renderBottomNav(activePage) {
  const t = I18nService.t.bind(I18nService);
  const navItems = [
    { id: 'dashboard', icon: 'home_health', label: t('nav.home') },
    { id: 'booking', icon: 'calendar_month', label: t('nav.booking') },
    { id: 'vault', icon: 'folder_open', label: t('nav.vault') },
    { id: 'ayushman', icon: 'verified_user', label: t('nav.ayushman') },
    { id: 'emergency', icon: 'emergency', label: t('nav.sos') }
  ];

  return `
  <nav class="bottom-nav" id="bottomNav">
    ${navItems.map(item => `
    <a class="nav-item ${activePage === item.id ? 'active' : ''} ${I18nService.isHindi() ? 'hindi' : ''}" href="#${item.id}">
      <span class="material-symbols-outlined">${item.icon}</span>
      <span>${item.label}</span>
    </a>`).join('')}
  </nav>`;
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || (AuthService.isLoggedIn() ? 'dashboard' : 'login');
  const route = routes[hash];

  if (!route) { navigate(AuthService.isLoggedIn() ? 'dashboard' : 'login'); return; }
  if (route.auth && !AuthService.isLoggedIn()) { navigate('login'); return; }

  state.currentPage = hash;
  const appEl = document.getElementById('app');
  if (!appEl) return;
  appEl.classList.toggle('has-bottom-nav', Boolean(route.nav));

  const deps = {
    auth: AuthService,
    hospitals: HospitalService,
    sync: SyncService,
    i18n: I18nService,
    geo: GeoService,
    files: FileService,
    whatsapp: WhatsAppService,
    notifications: NotificationService,
    navigate
  };

  if (route.nav) {
    appEl.innerHTML = renderHeader(hash) + renderSideDrawer(hash) + '<div id="pageContent"></div>' + renderBottomNav(hash);
    route.render(document.getElementById('pageContent'), deps);

    // Bind header events after render
    const drawer = document.getElementById('sideDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    const closeDrawer = () => {
      drawer?.classList.remove('open');
      backdrop?.classList.remove('show');
      drawer?.setAttribute('aria-hidden', 'true');
    };
    const openDrawer = () => {
      drawer?.classList.add('open');
      backdrop?.classList.add('show');
      drawer?.setAttribute('aria-hidden', 'false');
    };

    document.getElementById('menuToggle')?.addEventListener('click', openDrawer);
    document.getElementById('drawerClose')?.addEventListener('click', closeDrawer);
    backdrop?.addEventListener('click', closeDrawer);
    appEl.querySelectorAll('.drawer-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        closeDrawer();
        navigate(item.dataset.route);
      });
    });

    document.getElementById('headerLangToggle')?.addEventListener('click', () => {
      I18nService.toggle();
    });

    document.getElementById('headerNotifications')?.addEventListener('click', () => {
      navigate('notifications');
    });

    document.getElementById('headerProfile')?.addEventListener('click', () => {
      navigate('profile');
    });

    document.getElementById('headerLogout')?.addEventListener('click', () => {
      AuthService.logout();
      navigate('login');
    });

  } else {
    appEl.innerHTML = '<div id="pageContent"></div>';
    route.render(document.getElementById('pageContent'), deps);
  }
}

// ── Boot ──
window.addEventListener('hashchange', handleRoute);

async function boot() {
  const appEl = document.getElementById('app');
  if (appEl) {
    appEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:1rem"><span class="material-symbols-outlined" style="font-size:3rem;color:var(--primary-container);animation:pulse 1.5s ease infinite">local_hospital</span><p style="color:var(--on-surface-variant);font-weight:600">Loading MediCare...</p></div>';
  }
  await FirebaseService.readyPromise;
  await HospitalService.init();
  handleRoute();
}

window.addEventListener('DOMContentLoaded', boot);
boot();
