// ============================================================
//  FreshStock — Interactive Prototype
//  Animations powered by GSAP 3
// ============================================================

// ─── State ───────────────────────────────────────────────────
let isNavigating = false;
let currentScreenId = 'screen-login';

// ─── Core navigation with GSAP transitions ───────────────────
function navigateTo(screenId) {
  if (isNavigating || screenId === currentScreenId) return;
  isNavigating = true;

  const current = document.getElementById(currentScreenId);
  const next    = document.getElementById(screenId);
  if (!next) { isNavigating = false; return; }

  // Highlight the matching sidebar item on the incoming screen
  // Items use onclick="navigateTo('screen-xxx')" — extract the target from the attribute
  next.querySelectorAll('.sidebar-menu li:not(.menu-label)').forEach(li => {
    const attr = li.getAttribute('onclick') || '';
    const match = attr.match(/navigateTo\(['"]([^'"]+)['"]\)/);
    const target = match ? match[1] : null;
    li.classList.toggle('active', target === screenId);
  });

  // ── LEAVE animation ──
  gsap.to(current, {
    opacity: 0,
    y: -14,
    duration: 0.22,
    ease: 'power2.in',
    onComplete: () => {
      current.classList.remove('active');
      current.style.pointerEvents = 'none';
      gsap.set(current, { y: 0 });

      // ── ENTER animation ──
      next.classList.add('active');
      next.style.pointerEvents = 'all';

      gsap.fromTo(next,
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => {
            isNavigating = false;
            currentScreenId = screenId;
            // Reset scroll
            const ca = next.querySelector('.content-area');
            if (ca) ca.scrollTop = 0;
            // Trigger screen-specific animations
            triggerScreenAnimations(screenId, next);
          }
        }
      );

      // Stagger content-area children
      const children = next.querySelectorAll('.content-area > *');
      gsap.fromTo(children,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.38, stagger: 0.07, ease: 'power2.out', delay: 0.08 }
      );
    }
  });
}

// ─── Screen-specific entrance animations ─────────────────────
function triggerScreenAnimations(screenId, container) {
  switch (screenId) {

    case 'screen-dashboard':
      animateNumbers(container);
      animateKpiCards(container);
      animateDonut(container);
      break;

    case 'screen-products':
      animateStockBars(container);
      animateProductCards(container);
      break;

    case 'screen-alerts':
      animateAlerts(container);
      break;

    case 'screen-lots':
      animateTableRows(container);
      break;

    case 'screen-suppliers':
      animateSupplierCards(container);
      break;

    case 'screen-users':
      animateUserCards(container);
      break;

    case 'screen-reports':
      animateBarChart(container);
      animateTableRows(container);
      break;
  }
}

// ─── Dashboard: KPI cards stagger + icon bounce ───────────────
function animateKpiCards(container) {
  const cards = container.querySelectorAll('.kpi-card');
  gsap.fromTo(cards,
    { opacity: 0, y: 30, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.09, ease: 'back.out(1.4)', delay: 0.1 }
  );
  // Icon pop-in
  const icons = container.querySelectorAll('.kpi-icon');
  gsap.fromTo(icons,
    { scale: 0.5, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.35, stagger: 0.09, ease: 'back.out(2)', delay: 0.25 }
  );
}

// ─── Dashboard: Donut segments draw-in ───────────────────────
function animateDonut(container) {
  const segs = container.querySelectorAll('.donut-seg');
  segs.forEach(seg => {
    const totalLength = seg.getTotalLength ? seg.getTotalLength() : 200;
    gsap.fromTo(seg,
      { strokeDashoffset: totalLength },
      { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out', delay: 0.3 }
    );
  });
}

// ─── Products: stock bars fill from 0 ────────────────────────
function animateStockBars(container) {
  container.querySelectorAll('.stock-fill').forEach((fill, i) => {
    const target = fill.style.width || '0%';
    gsap.fromTo(fill,
      { width: '0%' },
      { width: target, duration: 0.7, ease: 'power2.out', delay: 0.15 + i * 0.04 }
    );
  });
}

// ─── Products: cards cascade in ──────────────────────────────
function animateProductCards(container) {
  const cards = container.querySelectorAll('.product-card');
  gsap.fromTo(cards,
    { opacity: 0, y: 28, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.05 }
  );
}

// ─── Alerts: slide in from left ──────────────────────────────
function animateAlerts(container) {
  const items = container.querySelectorAll('.alert-item');
  gsap.fromTo(items,
    { opacity: 0, x: -32 },
    { opacity: 1, x: 0, duration: 0.38, stagger: 0.07, ease: 'power2.out', delay: 0.1 }
  );
  // Summary cards pop
  const sumCards = container.querySelectorAll('.alert-sum-card');
  gsap.fromTo(sumCards,
    { opacity: 0, scale: 0.92 },
    { opacity: 1, scale: 1, duration: 0.35, stagger: 0.07, ease: 'back.out(1.6)', delay: 0.05 }
  );
}

// ─── Generic table rows stagger ──────────────────────────────
function animateTableRows(container) {
  const rows = container.querySelectorAll('.data-table tbody tr');
  gsap.fromTo(rows,
    { opacity: 0, x: -16 },
    { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out', delay: 0.15 }
  );
}

// ─── Suppliers: cards scale+fade ─────────────────────────────
function animateSupplierCards(container) {
  const cards = container.querySelectorAll('.supplier-card');
  gsap.fromTo(cards,
    { opacity: 0, scale: 0.94, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.42, stagger: 0.09, ease: 'back.out(1.4)', delay: 0.1 }
  );
}

// ─── Users: cards fade up ────────────────────────────────────
function animateUserCards(container) {
  const cards = container.querySelectorAll('.user-card');
  gsap.fromTo(cards,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.1 }
  );
}

// ─── Reports: bar fills animate from 0 ───────────────────────
function animateBarChart(container) {
  container.querySelectorAll('.bar-fill').forEach((fill, i) => {
    const target = fill.style.width || '0%';
    gsap.fromTo(fill,
      { width: '0%' },
      { width: target, duration: 0.9, ease: 'power2.out', delay: 0.2 + i * 0.08 }
    );
  });
}

// ─── KPI number counter (preserved from original) ────────────
function animateNumbers(container) {
  container.querySelectorAll('.kpi-value').forEach(el => {
    const text = el.textContent;
    const num  = parseInt(text.replace(/[^0-9]/g, ''));
    if (isNaN(num) || num === 0) return;

    let current       = 0;
    const increment   = Math.ceil(num / 30);
    const prefix      = text.match(/^[^0-9]*/)[0];
    const suffix      = text.match(/[^0-9]*$/)[0];

    const timer = setInterval(() => {
      current += increment;
      if (current >= num) { current = num; clearInterval(timer); }
      el.textContent = prefix + current.toLocaleString('es-CO') + suffix;
    }, 30);
  });
}

// ─── Ripple effect on buttons ─────────────────────────────────
function addRipple(e) {
  const btn    = e.currentTarget;
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height) * 1.6;
  const x      = e.clientX - rect.left - size / 2;
  const y      = e.clientY - rect.top  - size / 2;

  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  Object.assign(ripple.style, {
    width: size + 'px', height: size + 'px',
    left:  x + 'px',   top:    y + 'px'
  });
  btn.appendChild(ripple);

  gsap.fromTo(ripple,
    { scale: 0, opacity: 1 },
    {
      scale: 1, opacity: 0, duration: 0.55, ease: 'power2.out',
      onComplete: () => ripple.remove()
    }
  );
}

// ─── Sidebar item micro-bounce ────────────────────────────────
function initSidebarInteractions() {
  document.querySelectorAll('.sidebar-menu li:not(.menu-label)').forEach(li => {
    li.addEventListener('click', () => {
      // Bounce the icon
      const icon = li.querySelector('i');
      if (icon) {
        gsap.fromTo(icon,
          { scale: 0.7, rotate: -10 },
          { scale: 1, rotate: 0, duration: 0.35, ease: 'back.out(3)' }
        );
      }
    });
  });
}

// ─── KPI icon hover ──────────────────────────────────────────
function initKpiHover() {
  document.querySelectorAll('.kpi-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      gsap.to(icon, { rotate: 12, scale: 1.18, duration: 0.22, ease: 'power2.out' });
    });
    icon.addEventListener('mouseleave', () => {
      gsap.to(icon, { rotate: 0, scale: 1, duration: 0.22, ease: 'power2.out' });
    });
  });
}

// ─── Notif dot continuous pulse ───────────────────────────────
function initNotifPulse() {
  // The CSS ::after handles the ring animation.
  // Here we add a subtle scale breathe on the dot itself.
  gsap.to('.notif-dot', {
    scale: 1.15,
    duration: 0.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

// ─── Login screen entrance ────────────────────────────────────
function animateLoginEntrance() {
  const left  = document.querySelector('.login-left');
  const right = document.querySelector('.login-right');

  gsap.fromTo(left,
    { x: -60, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
  );
  gsap.fromTo(right,
    { x: 60, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 }
  );
  // Form fields stagger
  const fields = document.querySelectorAll('.login-form-container > *, .login-form .form-group, .form-options, .btn-primary, .login-divider, .social-login, .login-footer');
  gsap.fromTo(fields,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out', delay: 0.45 }
  );
}

// ─── Initialise on DOM ready ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Set the initial active screen visible (login)
  const loginScreen = document.getElementById('screen-login');
  gsap.set(loginScreen, { opacity: 1 });

  // Wire up ripple on all primary/outline buttons
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('click', addRipple);
  });

  // KPI hover (screens already in DOM, no issue)
  initKpiHover();

  // Sidebar micro-bounce
  initSidebarInteractions();

  // Notif pulse
  initNotifPulse();

  // MutationObserver to re-init KPI hover when screens become active
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.target.classList.contains('active')) {
        initKpiHover();
      }
    });
  });
  document.querySelectorAll('.screen').forEach(s => {
    observer.observe(s, { attributes: true, attributeFilter: ['class'] });
  });

  // Animate the login screen on first load
  animateLoginEntrance();
});

// ─── Sidebar toggle ───────────────────────────────────────────
function toggleSidebar() {
  document.querySelectorAll('.sidebar').forEach(s => s.classList.toggle('collapsed'));
}
