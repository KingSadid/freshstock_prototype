// ============================================================
//  FreshStock — Interactive Prototype
//  Animations powered by GSAP 3  |  Dark/Light theme support
// ============================================================

// ─── State ───────────────────────────────────────────────────
let isNavigating = false;
let currentScreenId = 'screen-login';

// ─── Core navigation with GSAP overlay transition ────────────
function navigateTo(screenId) {
  if (isNavigating || screenId === currentScreenId) return;
  isNavigating = true;

  const current = document.getElementById(currentScreenId);
  const next    = document.getElementById(screenId);
  const overlay = document.getElementById('transition-overlay');
  if (!next) { isNavigating = false; return; }

  // Highlight the matching sidebar item on the incoming screen
  next.querySelectorAll('.sidebar-menu li:not(.menu-label)').forEach(li => {
    const attr = li.getAttribute('onclick') || '';
    const match = attr.match(/navigateTo\(['"]([^'"]+)['"]\)/);
    const target = match ? match[1] : null;
    li.classList.toggle('active', target === screenId);
  });

  // ── Full overlay wipe transition ──
  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete: () => { isNavigating = false; }
  });

  tl
    // 1. Wipe IN — overlay scales up from bottom
    .to(overlay, {
      scaleY: 1,
      transformOrigin: 'bottom',
      duration: 0.35,
      ease: 'power3.in',
    })
    // 2. Swap screens at the peak of the wipe
    .add(() => {
      current.classList.remove('active');
      current.style.pointerEvents = 'none';
      gsap.set(current, { opacity: 0, y: 0 });

      next.classList.add('active');
      next.style.pointerEvents = 'all';
      gsap.set(next, { opacity: 1, y: 0 });
      currentScreenId = screenId;

      // Reset scroll
      const ca = next.querySelector('.content-area');
      if (ca) ca.scrollTop = 0;
    })
    // 3. Wipe OUT — overlay slides away to top
    .to(overlay, {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 0.35,
      ease: 'power3.out',
    })
    // 4. Once revealed, stagger content children
    .add(() => {
      const children = next.querySelectorAll('.content-area > *');
      if (children.length) {
        gsap.fromTo(children,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out' }
        );
      }
      // Sidebar items subtle entrance
      const sideItems = next.querySelectorAll('.sidebar-menu li:not(.menu-label)');
      gsap.fromTo(sideItems,
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out' }
      );

      triggerScreenAnimations(screenId, next);
    }, '-=0.15');
}

// ─── Screen-specific entrance animations ─────────────────────
function triggerScreenAnimations(screenId, container) {
  switch (screenId) {
    case 'screen-login':
      animateLoginEntrance();
      break;
    case 'screen-dashboard':
      animateNumbers(container);
      animateKpiCards(container);
      animateDonut(container);
      animateWelcomeBanner(container);
      animateExpiryItems(container);
      animateActivityItems(container);
      break;
    case 'screen-products':
      animateStockBars(container);
      animateProductCards(container);
      break;
    case 'screen-product-detail':
      animateDetailEntrance(container);
      break;
    case 'screen-alerts':
      animateAlerts(container);
      break;
    case 'screen-lots':
      animateTableRows(container);
      animatePepsBanner(container);
      break;
    case 'screen-lot-register':
      animateScannerEntrance(container);
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
      animateMermaItems(container);
      break;
  }
}

// ─── Dashboard: welcome banner ────────────────────────────────
function animateWelcomeBanner(container) {
  const banner = container.querySelector('.welcome-banner');
  if (!banner) return;
  gsap.fromTo(banner,
    { opacity: 0, scale: 0.97, y: 16 },
    { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'power3.out', delay: 0.05 }
  );
  const icon = banner.querySelector('.wb-illustration');
  if (icon) {
    gsap.fromTo(icon,
      { scale: 0.6, opacity: 0, rotate: -20 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 0.3 }
    );
  }
}

// ─── Dashboard: KPI cards stagger + icon bounce ───────────────
function animateKpiCards(container) {
  const cards = container.querySelectorAll('.kpi-card');
  gsap.fromTo(cards,
    { opacity: 0, y: 35, scale: 0.92 },
    { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)', delay: 0.15 }
  );
  // Icon pop-in with spring
  const icons = container.querySelectorAll('.kpi-icon');
  gsap.fromTo(icons,
    { scale: 0, opacity: 0, rotate: -30 },
    { scale: 1, opacity: 1, rotate: 0, duration: 0.45, stagger: 0.1, ease: 'back.out(2.5)', delay: 0.35 }
  );
  // Trend badges fade in
  const trends = container.querySelectorAll('.kpi-trend');
  gsap.fromTo(trends,
    { opacity: 0, x: 10 },
    { opacity: 1, x: 0, duration: 0.3, stagger: 0.08, ease: 'power2.out', delay: 0.55 }
  );
}

// ─── Dashboard: Donut segments draw-in ───────────────────────
function animateDonut(container) {
  const segs = container.querySelectorAll('.donut-seg');
  segs.forEach((seg, i) => {
    const totalLength = seg.getTotalLength ? seg.getTotalLength() : 200;
    gsap.set(seg, { strokeDasharray: totalLength, strokeDashoffset: totalLength });
    gsap.to(seg, {
      strokeDashoffset: 0,
      duration: 1.0,
      ease: 'power2.inOut',
      delay: 0.4 + i * 0.12
    });
  });
  // Legend items
  const legendItems = container.querySelectorAll('.dl-item');
  gsap.fromTo(legendItems,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out', delay: 0.8 }
  );
}

// ─── Dashboard: expiry items cascade ─────────────────────────
function animateExpiryItems(container) {
  const items = container.querySelectorAll('.expiry-item');
  gsap.fromTo(items,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out', delay: 0.3 }
  );
}

// ─── Dashboard: activity items cascade ───────────────────────
function animateActivityItems(container) {
  const items = container.querySelectorAll('.activity-item');
  gsap.fromTo(items,
    { opacity: 0, x: 18 },
    { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out', delay: 0.35 }
  );
}

// ─── Products: stock bars fill from 0 ────────────────────────
function animateStockBars(container) {
  container.querySelectorAll('.stock-fill').forEach((fill, i) => {
    const target = fill.style.width || '0%';
    gsap.fromTo(fill,
      { width: '0%' },
      { width: target, duration: 0.8, ease: 'power2.out', delay: 0.2 + i * 0.05 }
    );
  });
}

// ─── Products: cards cascade in ──────────────────────────────
function animateProductCards(container) {
  const cards = container.querySelectorAll('.product-card');
  gsap.fromTo(cards,
    { opacity: 0, y: 32, scale: 0.94 },
    { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07, ease: 'back.out(1.3)', delay: 0.1 }
  );
  // Chips
  const chips = container.querySelectorAll('.chip');
  gsap.fromTo(chips,
    { opacity: 0, scale: 0.85 },
    { opacity: 1, scale: 1, duration: 0.3, stagger: 0.04, ease: 'back.out(2)', delay: 0.05 }
  );
}

// ─── Product Detail: hero + sidebar ──────────────────────────
function animateDetailEntrance(container) {
  const hero = container.querySelector('.detail-header-visual');
  if (hero) {
    gsap.fromTo(hero,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', delay: 0.1 }
    );
  }
  const sidebar = container.querySelector('.detail-sidebar');
  if (sidebar) {
    gsap.fromTo(sidebar.children,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.25 }
    );
  }
  // Table rows in detail
  animateTableRows(container);
}

// ─── Alerts: slide in from left ──────────────────────────────
function animateAlerts(container) {
  // Summary cards pop
  const sumCards = container.querySelectorAll('.alert-sum-card');
  gsap.fromTo(sumCards,
    { opacity: 0, scale: 0.88, y: 16 },
    { opacity: 1, scale: 1, y: 0, duration: 0.42, stagger: 0.08, ease: 'back.out(1.8)', delay: 0.05 }
  );
  // Alert items slide in
  const items = container.querySelectorAll('.alert-item');
  gsap.fromTo(items,
    { opacity: 0, x: -36, scale: 0.98 },
    { opacity: 1, x: 0, scale: 1, duration: 0.4, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
  );
  // Alert icon wraps pop
  const icons = container.querySelectorAll('.alert-icon-wrap');
  gsap.fromTo(icons,
    { scale: 0.5, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.35, stagger: 0.08, ease: 'back.out(2)', delay: 0.35 }
  );
}

// ─── Generic table rows stagger ──────────────────────────────
function animateTableRows(container) {
  const rows = container.querySelectorAll('.data-table tbody tr');
  gsap.fromTo(rows,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.32, stagger: 0.04, ease: 'power2.out', delay: 0.2 }
  );
}

// ─── PEPS banner slide ───────────────────────────────────────
function animatePepsBanner(container) {
  const banner = container.querySelector('.peps-info-banner');
  if (!banner) return;
  gsap.fromTo(banner,
    { opacity: 0, y: -16, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out', delay: 0.1 }
  );
}

// ─── Scanner entrance ────────────────────────────────────────
function animateScannerEntrance(container) {
  const viewport = container.querySelector('.scanner-viewport');
  if (viewport) {
    gsap.fromTo(viewport,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)', delay: 0.15 }
    );
    // Scanner corners pop in
    const corners = viewport.querySelectorAll('.scanner-corner');
    gsap.fromTo(corners,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, stagger: 0.08, ease: 'back.out(3)', delay: 0.4 }
    );
  }
  // Form fields stagger
  const formGroups = container.querySelectorAll('.lot-form .form-group');
  gsap.fromTo(formGroups,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.3 }
  );
}

// ─── Suppliers: cards scale+fade ─────────────────────────────
function animateSupplierCards(container) {
  const cards = container.querySelectorAll('.supplier-card');
  gsap.fromTo(cards,
    { opacity: 0, scale: 0.9, y: 24 },
    { opacity: 1, scale: 1, y: 0, duration: 0.48, stagger: 0.1, ease: 'back.out(1.5)', delay: 0.1 }
  );
  // Avatars pop
  const avatars = container.querySelectorAll('.sc-avatar');
  gsap.fromTo(avatars,
    { scale: 0.5, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.35, stagger: 0.1, ease: 'back.out(2.5)', delay: 0.35 }
  );
}

// ─── Users: cards fade up ────────────────────────────────────
function animateUserCards(container) {
  const cards = container.querySelectorAll('.user-card');
  gsap.fromTo(cards,
    { opacity: 0, y: 35, scale: 0.92 },
    { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.09, ease: 'back.out(1.4)', delay: 0.1 }
  );
  // Avatars
  const avatars = container.querySelectorAll('.uc-avatar');
  gsap.fromTo(avatars,
    { scale: 0.4, opacity: 0, rotate: -20 },
    { scale: 1, opacity: 1, rotate: 0, duration: 0.4, stagger: 0.09, ease: 'back.out(2.5)', delay: 0.3 }
  );
}

// ─── Reports: bar fills animate from 0 ───────────────────────
function animateBarChart(container) {
  container.querySelectorAll('.bar-fill').forEach((fill, i) => {
    const target = fill.style.width || '0%';
    gsap.fromTo(fill,
      { width: '0%' },
      { width: target, duration: 1.0, ease: 'power2.out', delay: 0.25 + i * 0.1 }
    );
  });
}

// ─── Reports: merma items ────────────────────────────────────
function animateMermaItems(container) {
  const items = container.querySelectorAll('.merma-item');
  gsap.fromTo(items,
    { opacity: 0, x: 20 },
    { opacity: 1, x: 0, duration: 0.32, stagger: 0.06, ease: 'power2.out', delay: 0.3 }
  );
}

// ─── KPI number counter ──────────────────────────────────────
function animateNumbers(container) {
  container.querySelectorAll('.kpi-value').forEach(el => {
    const text = el.textContent;
    const num  = parseInt(text.replace(/[^0-9]/g, ''));
    if (isNaN(num) || num === 0) return;

    const prefix    = text.match(/^[^0-9]*/)[0];
    const suffix    = text.match(/[^0-9]*$/)[0];
    const obj       = { val: 0 };

    gsap.to(obj, {
      val: num,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.3,
      onUpdate: () => {
        el.textContent = prefix + Math.round(obj.val).toLocaleString('es-CO') + suffix;
      }
    });
  });
}

// ─── Ripple effect on buttons ─────────────────────────────────
function addRipple(e) {
  const btn    = e.currentTarget;
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height) * 2;
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
    { scale: 0, opacity: 0.6 },
    {
      scale: 1, opacity: 0, duration: 0.6, ease: 'power2.out',
      onComplete: () => ripple.remove()
    }
  );
}

// ─── Sidebar item micro-bounce ────────────────────────────────
function initSidebarInteractions() {
  document.querySelectorAll('.sidebar-menu li:not(.menu-label)').forEach(li => {
    li.addEventListener('click', () => {
      const icon = li.querySelector('i');
      if (icon) {
        gsap.timeline()
          .to(icon, { scale: 0.6, rotate: -15, duration: 0.12, ease: 'power2.in' })
          .to(icon, { scale: 1.2, rotate: 5, duration: 0.2, ease: 'back.out(3)' })
          .to(icon, { scale: 1, rotate: 0, duration: 0.15, ease: 'power2.out' });
      }
    });
  });
}

// ─── KPI icon hover ──────────────────────────────────────────
function initKpiHover() {
  document.querySelectorAll('.kpi-icon').forEach(icon => {
    // Avoid duplicating listeners
    if (icon._hoverBound) return;
    icon._hoverBound = true;

    icon.addEventListener('mouseenter', () => {
      gsap.to(icon, { rotate: 14, scale: 1.2, duration: 0.25, ease: 'back.out(2)' });
    });
    icon.addEventListener('mouseleave', () => {
      gsap.to(icon, { rotate: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
    });
  });
}

// ─── Card hover enhancement ──────────────────────────────────
function initCardHover() {
  document.querySelectorAll('.product-card, .supplier-card, .user-card').forEach(card => {
    if (card._hoverBound) return;
    card._hoverBound = true;

    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -6, duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: 0.35, ease: 'power2.out' });
    });
  });
}

// ─── Notif dot continuous pulse ───────────────────────────────
function initNotifPulse() {
  gsap.to('.notif-dot', {
    scale: 1.2,
    duration: 0.9,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

// ─── Login screen entrance ────────────────────────────────────
function animateLoginEntrance() {
  const left  = document.querySelector('.login-left');
  const right = document.querySelector('.login-right');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    .fromTo(left,
      { x: -80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo(right,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    );

  // Float cards cascade
  const floatCards = document.querySelectorAll('.float-card');
  gsap.fromTo(floatCards,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(2)', delay: 0.6 }
  );

  // Form elements stagger
  const formEls = document.querySelectorAll(
    '.login-form-header, .login-form .form-group, .form-options, .login-form .btn-primary, .login-divider, .social-login, .login-footer'
  );
  gsap.fromTo(formEls,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.45 }
  );

  // Logo icon bounce
  const logoIcon = document.querySelector('.logo-icon-big');
  if (logoIcon) {
    gsap.fromTo(logoIcon,
      { scale: 0, rotate: -45 },
      { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2.5)', delay: 0.3 }
    );
  }
}

// ─── Theme toggle ─────────────────────────────────────────────
function toggleTheme() {
  const html  = document.documentElement;
  const btn   = document.getElementById('theme-toggle');
  const isDark = html.getAttribute('data-theme') === 'dark';

  // Animate the toggle button
  gsap.timeline()
    .to(btn, { scale: 0.7, rotate: 180, duration: 0.2, ease: 'power2.in' })
    .add(() => {
      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('freshstock-theme', 'light');
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('freshstock-theme', 'dark');
      }
    })
    .to(btn, { scale: 1, rotate: 360, duration: 0.35, ease: 'back.out(2)' });
}

function loadSavedTheme() {
  const saved = localStorage.getItem('freshstock-theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

// ─── Chip filter toggle ──────────────────────────────────────
function initChipInteractions() {
  document.querySelectorAll('.filters-left').forEach(group => {
    const chips = group.querySelectorAll('.chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        // Remove active from siblings
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        // Pop animation
        gsap.fromTo(chip,
          { scale: 0.88 },
          { scale: 1, duration: 0.3, ease: 'back.out(3)' }
        );
      });
    });
  });
}

// ─── Initialise on DOM ready ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Load saved theme preference
  loadSavedTheme();

  // Set the initial active screen visible (login)
  const loginScreen = document.getElementById('screen-login');
  gsap.set(loginScreen, { opacity: 1 });

  // Wire up ripple on all primary/outline buttons
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('click', addRipple);
  });

  // Micro-interactions
  initKpiHover();
  initCardHover();
  initSidebarInteractions();
  initNotifPulse();
  initChipInteractions();

  // Re-init hover listeners when screens become active
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.target.classList.contains('active')) {
        initKpiHover();
        initCardHover();
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
