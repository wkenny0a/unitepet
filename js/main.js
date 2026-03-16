/* ============================================
   Unite Pet — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollAnimations();
  initContactForm();
  initStickyHeader();
});

/* ---- Mobile Navigation ---- */
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  // Create overlay div outside the header for solid background
  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu on link click
  navLinks.querySelectorAll('a:not(.btn)').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on overlay click
  overlay.addEventListener('click', closeMenu);
}

/* ---- Sticky Header ---- */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ---- Scroll Animations ---- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ---- Contact Form ---- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#C62828';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    // Email validation
    const email = form.querySelector('#email');
    if (email && email.value && !isValidEmail(email.value)) {
      email.style.borderColor = '#C62828';
      valid = false;
    }

    if (!valid) return;

    // Show success message
    form.style.display = 'none';
    const success = document.getElementById('formSuccess');
    if (success) success.classList.add('show');

    // Construct mailto
    const firstName = form.querySelector('#firstName')?.value || '';
    const lastName = form.querySelector('#lastName')?.value || '';
    const emailVal = email?.value || '';
    const phone = form.querySelector('#phone')?.value || '';
    const company = form.querySelector('#company')?.value || '';
    const interest = form.querySelector('#interest')?.value || '';
    const message = form.querySelector('#message')?.value || '';

    const subject = `Inquiry from ${firstName} ${lastName}${company ? ' - ' + company : ''}`;
    const body = `Name: ${firstName} ${lastName}\nEmail: ${emailVal}\nPhone: ${phone}\nCompany: ${company}\nProduct Interest: ${interest}\n\nMessage:\n${message}`;

    const mailtoLink = `mailto:unitepet@unitepet.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open mail client
    setTimeout(() => {
      window.location.href = mailtoLink;
    }, 1500);
  });

  // Remove error styling on input
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function resetForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.reset();
    form.style.display = '';
  }
  if (success) success.classList.remove('show');
}

/* ---- Counter Animation (for stats) ---- */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const text = counter.textContent;
    const match = text.match(/(\d[\d,]*)/);
    if (!match) return;

    const target = parseInt(match[1].replace(/,/g, ''));
    const suffix = text.replace(match[1], '').trim();
    const prefix = text.substring(0, text.indexOf(match[1]));
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      const formatted = current.toLocaleString();
      counter.textContent = prefix + formatted + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  statsObserver.observe(statsSection);
}
