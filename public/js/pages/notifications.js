/** Notifications Page */
export function renderNotifications(app, { notifications, navigate }) {
  const items = notifications.getAll();

  app.innerHTML = `
  <div class="page-enter">
    <main class="container-sm" style="padding-top:1.5rem;padding-bottom:2rem">
      <section style="display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;margin-bottom:1.5rem">
        <div>
          <p class="label-sm text-primary">Care updates</p>
          <h2 style="font-size:2rem;font-weight:850;letter-spacing:-0.02em">Notifications</h2>
          <p class="text-on-surface-variant">Requests, reminders, and profile alerts stay here.</p>
        </div>
        <button class="btn-secondary" id="markAllRead" style="width:auto;padding:0.75rem 1rem">Mark read</button>
      </section>

      <div style="display:flex;flex-direction:column;gap:0.75rem">
        ${items.length ? items.map(item => `
        <button class="notification-row ${item.read ? '' : 'unread'}" data-notification="${item.id}" type="button">
          <span class="material-symbols-outlined">${getIcon(item.type)}</span>
          <span style="flex:1;text-align:left">
            <strong>${item.title}</strong>
            <small>${item.body}</small>
            <em>${formatTime(item.createdAt)}</em>
          </span>
        </button>`).join('') : `
        <div class="card" style="text-align:center">
          <span class="material-symbols-outlined" style="font-size:3rem;color:var(--outline)">notifications_off</span>
          <h3 style="font-weight:800;margin-top:0.75rem">No notifications</h3>
          <p class="text-on-surface-variant">Quick actions and bookings will add updates here.</p>
        </div>`}
      </div>

      <div style="display:flex;gap:1rem;margin-top:1.5rem">
        <button class="btn-secondary" id="clearNotifications">Clear all</button>
        <button class="btn-primary" id="backHome">Back Home</button>
      </div>
    </main>
  </div>`;

  app.querySelectorAll('[data-notification]').forEach(row => {
    row.addEventListener('click', () => {
      notifications.markRead(row.dataset.notification);
      renderNotifications(app, { notifications, navigate });
    });
  });

  document.getElementById('markAllRead')?.addEventListener('click', () => {
    notifications.markAllRead();
    renderNotifications(app, { notifications, navigate });
  });

  document.getElementById('clearNotifications')?.addEventListener('click', () => {
    notifications.clear();
    renderNotifications(app, { notifications, navigate });
  });

  document.getElementById('backHome')?.addEventListener('click', () => navigate('dashboard'));
}

function getIcon(type) {
  return {
    booking: 'calendar_month',
    pharmacy: 'pill',
    lab: 'science',
    vaccine: 'vaccines',
    profile: 'account_circle',
    emergency: 'emergency'
  }[type] || 'notifications';
}

function formatTime(value) {
  try {
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
  } catch {
    return '';
  }
}
