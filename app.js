// ============================================================
//  FreshStock — Interactive Prototype
//  Animations powered by GSAP 3  |  Dark/Light theme support
// ============================================================

// ─── State ───────────────────────────────────────────────────
let isNavigating = false;
let currentScreenId = 'screen-login';

// ─── Core navigation with Loading animation ────────────
function navigateTo(screenId) {
  if (isNavigating || screenId === currentScreenId) return;
  isNavigating = true;

  const current = document.getElementById(currentScreenId);
  const next    = document.getElementById(screenId);
  const loadingOverlay = document.getElementById('loading-overlay');
  if (!next) { isNavigating = false; return; }

  // Highlight the matching sidebar item on the incoming screen
  next.querySelectorAll('.sidebar-menu li:not(.menu-label)').forEach(li => {
    const attr = li.getAttribute('onclick') || '';
    const match = attr.match(/navigateTo\(['"]([^'"]+)['"]\)/);
    const target = match ? match[1] : null;
    li.classList.toggle('active', target === screenId);
  });

  // Show loading overlay
  loadingOverlay.classList.add('active');

  // Wait for loading overlay to become fully opaque (CSS transition is 0.3s)
  setTimeout(() => {
    // 1. Swap screens under the overlay
    current.classList.remove('active');
    current.style.pointerEvents = 'none';
    gsap.set(current, { opacity: 0, y: 0 });

    next.classList.add('active');
    next.style.pointerEvents = 'all';
    currentScreenId = screenId;

    // Reset scroll
    const ca = next.querySelector('.content-area');
    if (ca) ca.scrollTop = 0;

    // 2. Hide loading overlay (begins CSS fade-out)
    loadingOverlay.classList.remove('active');

    // 3. Fade in the new screen's base layout (backgrounds, lines)
    gsap.fromTo(next, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.3, ease: 'power2.inOut' }
    );

    // 4. Stagger the inner contents with a slight delay so they appear AFTER the layout is ready
    const children = next.querySelectorAll('.content-area > *');
    const sideItems = next.querySelectorAll('.sidebar-menu li:not(.menu-label)');
    const topBarElements = next.querySelectorAll('.top-bar-left, .top-bar-right');

    if (children.length) {
      gsap.fromTo(children,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.15 }
      );
    }
    
    if (sideItems.length) {
      gsap.fromTo(sideItems,
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.03, ease: 'power2.out', delay: 0.15 }
      );
    }

    if (topBarElements.length) {
      gsap.fromTo(topBarElements,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 }
      );
    }

    triggerScreenAnimations(screenId, next);

    // Unlock navigation when animations are roughly done
    setTimeout(() => {
      isNavigating = false;
    }, 800);

  }, 350); // Delay matches the CSS transition time + a 50ms buffer
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

  // Fade in the structural backgrounds
  gsap.fromTo(left,
    { opacity: 0 },
    { opacity: 1, duration: 0.5, ease: 'power2.inOut' }
  );
  gsap.fromTo(right,
    { opacity: 0 },
    { opacity: 1, duration: 0.5, ease: 'power2.inOut' }
  );

  // Logo text and subtitle stagger
  const heroEls = document.querySelectorAll('.logo-big h1, .hero-subtitle, .hero-features .hf');
  gsap.fromTo(heroEls,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out', delay: 0.15 }
  );

  // Logo icon bounce
  const logoIcon = document.querySelector('.logo-icon-big');
  if (logoIcon) {
    gsap.fromTo(logoIcon,
      { scale: 0, rotate: -45 },
      { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2.5)', delay: 0.1 }
    );
  }

  // Float cards cascade
  const floatCards = document.querySelectorAll('.float-card');
  gsap.fromTo(floatCards,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(2)', delay: 0.35 }
  );

  // Form elements stagger
  const formEls = document.querySelectorAll(
    '.login-form-header, .login-form .form-group, .form-options, .login-form .btn-primary, .login-divider, .social-login, .login-footer'
  );
  gsap.fromTo(formEls,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out', delay: 0.2 }
  );
}

// ─── Theme toggle ─────────────────────────────────────────────
function toggleTheme() {
  const html  = document.documentElement;
  const btn   = document.getElementById('theme-toggle');
  const isDark = html.getAttribute('data-theme') === 'dark';

  const switchTheme = () => {
    if (isDark) {
      html.removeAttribute('data-theme');
      localStorage.setItem('freshstock-theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('freshstock-theme', 'dark');
    }
  };

  // Animate the toggle button
  gsap.timeline()
    .to(btn, { scale: 0.7, rotate: 180, duration: 0.2, ease: 'power2.in' })
    .add(() => {
      // Modern browsers: View Transitions API for perfectly smooth cross-fade
      if (document.startViewTransition) {
        document.startViewTransition(switchTheme);
      } else {
        // Fallback for Firefox/Safari: CSS transitions on all elements
        html.classList.add('theme-transition');
        switchTheme();
        
        // Remove the transition class after animation to restore hover speeds
        setTimeout(() => {
          html.classList.remove('theme-transition');
        }, 450);
      }
    })
    .to(btn, { scale: 1, rotate: 360, duration: 0.35, ease: 'back.out(2)' });
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


// ─── Toast Notifications ──────────────────────────────────────
function showToast(title, message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const iconMap = {
    'success': 'fa-check-circle',
    'warning': 'fa-exclamation-triangle',
    'error': 'fa-times-circle',
    'info': 'fa-info-circle'
  };
  const colorMap = {
    'success': 'var(--primary)',
    'warning': 'var(--warning)',
    'error': 'var(--danger)',
    'info': 'var(--info)'
  };
  
  toast.innerHTML = `
    <div class="toast-icon" style="color: ${colorMap[type]}">
      <i class="fas ${iconMap[type]}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <div class="toast-progress" style="background: ${colorMap[type]}"></div>
  `;
  
  container.appendChild(toast);
  
  // Animate in
  gsap.fromTo(toast, 
    { y: 50, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }
  );
  
  // Progress bar
  const progress = toast.querySelector('.toast-progress');
  gsap.to(progress, {
    scaleX: 0,
    duration: duration / 1000,
    ease: 'linear'
  });
  
  // Animate out
  setTimeout(() => {
    gsap.to(toast, {
      x: 100, opacity: 0, duration: 0.4, ease: 'power2.in',
      onComplete: () => toast.remove()
    });
  }, duration);
}

// ─── Button Loading State ─────────────────────────────────────
function setBtnLoading(btn, isLoading) {
  if (isLoading) {
    btn.classList.add('btn-loading');
    btn.dataset.originalText = btn.innerHTML;
  } else {
    btn.classList.remove('btn-loading');
  }
}

// ─── Interactive Form Elements ────────────────────────────────
function initFormInteractions() {
  // Password toggle
  document.querySelectorAll('.toggle-pass').forEach(icon => {
    icon.addEventListener('click', function() {
      const input = this.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
      }
      // 3D flip animation
      gsap.fromTo(this, 
        { rotateX: 180, opacity: 0 }, 
        { rotateX: 0, opacity: 1, duration: 0.4, ease: 'back.out(2)' }
      );
    });
  });

  // Login form submission mock
  const loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.onsubmit = function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      setBtnLoading(btn, true);
      
      setTimeout(() => {
        setBtnLoading(btn, false);
        // Show success briefly before navigating
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
          navigateTo('screen-dashboard');
          // Reset button for when user logs out
          setTimeout(() => {
            btn.innerHTML = btn.dataset.originalText;
            btn.style.backgroundColor = '';
          }, 1000);
        }, 500);
      }, 1200);
    };
  }
  
  // Lot form submission mock
  const lotForm = document.querySelector('.lot-form');
  if (lotForm) {
    const btnSubmit = lotForm.querySelector('.btn-primary');
    if (btnSubmit) {
      btnSubmit.onclick = function(e) {
        e.preventDefault();
        setBtnLoading(this, true);
        
        setTimeout(() => {
          setBtnLoading(this, false);
          showToast('Lote Registrado', 'El lote L-2026-0905 ha sido guardado con éxito.', 'success');
          navigateTo('screen-lots');
        }, 1000);
      };
    }
  }
}

// ─── Smooth Delete (Swipe Out) ────────────────────────────────
function initDeleteInteractions() {
  // For any button with fa-trash or fa-minus-circle
  document.querySelectorAll('.data-table .fa-minus-circle, .data-table .fa-trash, .btn-danger-outline').forEach(icon => {
    const btn = icon.closest('button');
    if (!btn) return;
    
    // Remove old listeners if any by replacing clone
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const row = this.closest('tr') || this.closest('.alert-item') || this.closest('.merma-item');
      if (!row) return;
      
      // Flash red background
      gsap.to(row, { backgroundColor: 'rgba(239, 68, 68, 0.15)', duration: 0.2 });
      
      // Slide out
      gsap.to(row, {
        x: 100, 
        opacity: 0, 
        duration: 0.4, 
        delay: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          // Collapse height to reflow DOM smoothly
          gsap.to(row, {
            height: 0, 
            paddingTop: 0, 
            paddingBottom: 0, 
            border: 'none',
            duration: 0.3,
            onComplete: () => {
              row.remove();
              showToast('Elemento Eliminado', 'El registro ha sido eliminado del sistema.', 'info', 2500);
            }
          });
        }
      });
    });
  });
}

// ─── Initialise on DOM ready ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Set the initial active screen visible (login)
  const loginScreen = document.getElementById('screen-login');

  // Wire up ripple on all primary/outline buttons
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('click', addRipple);
  });

  // Micro-interactions
  initKpiHover();
  initCardHover();
        initDeleteInteractions();
  initSidebarInteractions();
  initNotifPulse();
  initChipInteractions();
  initFormInteractions();
  initDeleteInteractions();

  // Re-init hover listeners when screens become active
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.target.classList.contains('active')) {
        initKpiHover();
        initCardHover();
        initDeleteInteractions();
      }
    });
  });
  document.querySelectorAll('.screen').forEach(s => {
    observer.observe(s, { attributes: true, attributeFilter: ['class'] });
  });

  // Animate the login screen on first load after a brief loading period
  setTimeout(() => {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('active');
    
    gsap.set(loginScreen, { opacity: 1 });
    animateLoginEntrance();
  }, 400); // Wait for initial loading spinner before showing the screen
});

// ─── Sidebar toggle ───────────────────────────────────────────
function toggleSidebar() {
  document.querySelectorAll('.sidebar').forEach(s => s.classList.toggle('collapsed'));
}
