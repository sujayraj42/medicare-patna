/** Ayushman Bharat Page */
export function renderAyushman(app, { auth }) {
  const user = auth.getUser() || {};
  app.innerHTML = `
  <div class="page-enter">
    <main class="container" style="padding-top:2rem;padding-bottom:2rem;display:flex;flex-direction:column;gap:3rem">
      <!-- Hero -->
      <section style="border-radius:var(--radius-xl);overflow:hidden;background:var(--gradient-primary);padding:2rem;color:white;position:relative">
        <div style="position:absolute;top:0;right:0;width:16rem;height:16rem;background:rgba(255,255,255,0.05);border-radius:50%;margin:-5rem -5rem 0 0;filter:blur(40px)"></div>
        <div style="position:relative;z-index:1;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:2rem">
          <div style="max-width:32rem">
            <div style="display:inline-flex;align-items:center;gap:0.5rem;margin-bottom:1rem;background:rgba(255,255,255,0.1);padding:0.375rem 0.75rem;border-radius:2rem;backdrop-filter:blur(8px)"><span class="material-symbols-outlined filled" style="font-size:14px">verified_user</span><span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Government Certified</span></div>
            <h2 style="font-size:clamp(1.75rem,4vw,2.5rem);font-weight:900;letter-spacing:-0.02em;line-height:1.1;margin-bottom:1rem">Ayushman Bharat Health Account</h2>
            <p style="color:var(--on-primary-container);font-size:1.1rem;line-height:1.5;font-weight:500">Your universal health identity for a seamless digital healthcare journey across India.</p>
          </div>
          <span class="material-symbols-outlined abha-hero-icon" style="font-size:8rem;opacity:0.15;display:none">health_and_safety</span>
        </div>
      </section>

      <!-- ID Cards -->
      <section style="display:grid;grid-template-columns:1fr;gap:2rem" class="abha-cards-grid">
        <!-- ABHA Card -->
        <div class="card" style="padding:0.25rem;border-radius:var(--radius-2xl)">
          <div style="background:linear-gradient(to right,#eff6ff,#eef2ff);border-radius:calc(var(--radius-2xl) - 4px);padding:1.5rem;height:100%;border:1px solid rgba(59,130,246,0.1)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2.5rem">
              <div style="display:flex;align-items:center;gap:0.75rem"><div style="padding:0.75rem;background:#2563eb;border-radius:var(--radius-lg);color:white"><span class="material-symbols-outlined filled">fingerprint</span></div><div><h3 style="font-weight:700;font-size:1.1rem;color:#0f172a">ABHA ID</h3><p style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:-0.02em">Digital Health Account</p></div></div>
              <span class="badge badge-success">ACTIVE</span>
            </div>
            <div style="margin-bottom:1.5rem"><p style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Health ID Number</p><p style="font-size:1.5rem;font-family:monospace;font-weight:700;letter-spacing:0.15em;color:#1e293b;margin-top:0.25rem">${user.abhaId || '91-4202-3948-1102'}</p></div>
            <div style="display:flex;justify-content:space-between;align-items:flex-end"><div><p style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Account Holder</p><p style="font-size:1.1rem;font-weight:700;color:#1e293b;margin-top:0.25rem">${user.name || 'Arjun Deshmukh'}</p></div><div style="width:4rem;height:4rem;background:white;padding:0.25rem;border-radius:var(--radius-sm);border:1px solid #f1f5f9"><span class="material-symbols-outlined" style="font-size:3rem;color:#1e293b">qr_code_2</span></div></div>
          </div>
        </div>
        <!-- Golden Card -->
        <div class="card" style="padding:0.25rem;border-radius:var(--radius-2xl)">
          <div style="background:linear-gradient(to right,#fffbeb,#fff7ed);border-radius:calc(var(--radius-2xl) - 4px);padding:1.5rem;height:100%;border:1px solid rgba(245,158,11,0.1)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2.5rem">
              <div style="display:flex;align-items:center;gap:0.75rem"><div style="padding:0.75rem;background:#f59e0b;border-radius:var(--radius-lg);color:white"><span class="material-symbols-outlined filled">workspace_premium</span></div><div><h3 style="font-weight:700;font-size:1.1rem;color:#0f172a">Golden Card</h3><p style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:-0.02em">PM-JAY Enrollment</p></div></div>
              <span class="badge badge-warning">PENDING APPROVAL</span>
            </div>
            <div style="margin-bottom:1.5rem"><p style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Application Reference</p><p style="font-size:1.5rem;font-family:monospace;font-weight:700;letter-spacing:0.15em;color:#1e293b;margin-top:0.25rem">BR-PAT-0091244</p></div>
            <div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex"><div style="width:2rem;height:2rem;border-radius:50%;border:2px solid white;background:#f1f5f9;display:flex;align-items:center;justify-content:center"><span class="material-symbols-outlined" style="font-size:12px;color:#f59e0b">hourglass_empty</span></div><div style="width:2rem;height:2rem;border-radius:50%;border:2px solid white;background:#dcfce7;display:flex;align-items:center;justify-content:center;margin-left:-0.5rem"><span class="material-symbols-outlined" style="font-size:12px;color:#16a34a">check</span></div><div style="width:2rem;height:2rem;border-radius:50%;border:2px solid white;background:#f1f5f9;display:flex;align-items:center;justify-content:center;margin-left:-0.5rem"><span class="material-symbols-outlined" style="font-size:12px;color:#94a3b8">lock</span></div></div><button style="font-size:12px;font-weight:700;color:#b45309;background:#fef3c7;padding:0.5rem 1rem;border-radius:var(--radius-sm)">Track Status</button></div>
          </div>
        </div>
      </section>

      <!-- Benefits -->
      <section style="display:grid;grid-template-columns:1fr;gap:1.5rem" class="abha-benefits-grid">
        <div class="card-flat" style="padding:2rem;border-radius:var(--radius-xl)">
          <div style="display:flex;align-items:center;gap:1rem;margin-bottom:2rem"><span class="material-symbols-outlined" style="color:var(--primary);font-size:2rem">account_balance</span><h3 style="font-size:1.5rem;font-weight:800;letter-spacing:-0.01em">Panchayat Level Benefits</h3></div>
          <div class="grid-2" style="gap:1rem">
            ${[
              { icon: 'clinical_notes', title: 'Free Screenings', desc: 'Weekly checkups at your local Gram Panchayat Bhawan every Tuesday.' },
              { icon: 'medical_services', title: 'Medicine Kit', desc: 'Monthly essential medicines provided to all Golden Card holders.' },
              { icon: 'ambulance', title: '108 Priority', desc: 'Dedicated emergency transport priority for rural card holders.' },
              { icon: 'family_restroom', title: 'Asha Support', desc: 'Direct home-visit coordination via your local ASHA worker.' }
            ].map(b => `
            <div class="card" style="padding:1.5rem"><span class="material-symbols-outlined" style="color:var(--primary);margin-bottom:0.75rem;display:block">${b.icon}</span><h4 style="font-weight:700;margin-bottom:0.5rem">${b.title}</h4><p style="font-size:13px;color:var(--on-surface-variant);line-height:1.5">${b.desc}</p></div>`).join('')}
          </div>
        </div>
      </section>

      <!-- How it Works -->
      <section>
        <h3 style="font-size:1.25rem;font-weight:700;padding:0 0.5rem;margin-bottom:1.5rem">How it works</h3>
        <div class="grid-3" style="gap:1.5rem">
          ${[
            { step: 1, title: 'Generate ABHA', desc: 'Link your Aadhaar or Mobile to create your unique digital identity.' },
            { step: 2, title: 'Verify at Center', desc: 'Visit nearest Arogya Kendra for e-KYC and Golden Card eligibility.' },
            { step: 3, title: 'Claim Benefits', desc: 'Access ₹5 Lakh coverage per year for secondary and tertiary care.' }
          ].map(s => `
          <div class="card" style="display:flex;flex-direction:column;gap:1rem${s.step === 3 ? ';border:2px solid rgba(0,86,179,0.1)' : ''}">
            <div style="width:3rem;height:3rem;border-radius:50%;background:#eff6ff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.25rem;color:var(--primary-container)">${s.step}</div>
            <h4 style="font-weight:700;font-size:1.1rem">${s.title}</h4>
            <p style="font-size:14px;color:#64748b;line-height:1.5">${s.desc}</p>
          </div>`).join('')}
        </div>
      </section>

      <!-- Helpline -->
      <section class="card-flat" style="border-radius:var(--radius-xl);padding:1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:1rem"><div style="width:3.5rem;height:3.5rem;background:var(--error-container);border-radius:50%;display:flex;align-items:center;justify-content:center"><span class="material-symbols-outlined" style="color:var(--on-error-container)">support_agent</span></div><div><h4 style="font-weight:700">Need assistance?</h4><p style="font-size:14px;color:var(--on-surface-variant)">24/7 PM-JAY Helpline: 14555</p></div></div>
        <a href="tel:14555" style="padding:0.75rem 2rem;background:white;color:var(--primary);border:1px solid rgba(0,86,179,0.2);border-radius:var(--radius-lg);font-weight:700;font-size:14px;text-decoration:none">Contact NHA</a>
      </section>
    </main>
  </div>`;
}
