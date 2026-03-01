// FreshStock - Interactive Prototype Navigation
function navigateTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    // Reset scroll
    const contentArea = target.querySelector('.content-area');
    if (contentArea) contentArea.scrollTop = 0;
  }
}

function toggleSidebar() {
  document.querySelectorAll('.sidebar').forEach(s => s.classList.toggle('collapsed'));
}

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', () => {
  // Animate KPI values on screen change
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains('active')) {
        animateNumbers(mutation.target);
      }
    });
  });

  document.querySelectorAll('.screen').forEach(screen => {
    observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
  });
});

function animateNumbers(container) {
  container.querySelectorAll('.kpi-value').forEach(el => {
    const text = el.textContent;
    const num = parseInt(text.replace(/[^0-9]/g, ''));
    if (isNaN(num) || num === 0) return;
    
    let current = 0;
    const increment = Math.ceil(num / 30);
    const prefix = text.match(/^[^0-9]*/)[0];
    const suffix = text.match(/[^0-9]*$/)[0];
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        current = num;
        clearInterval(timer);
      }
      el.textContent = prefix + current.toLocaleString() + suffix;
    }, 30);
  });
}
