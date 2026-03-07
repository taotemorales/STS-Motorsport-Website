// S2S Motorsport — Shared JS (nav, mobile menu, scroll-reveal)

// Dynamic year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Nav scroll shadow
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('nav-scrolled', window.scrollY > 10);
  }, { passive: true });
}

// Mobile menu
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
  const bars = menuBtn.querySelectorAll('.menu-bar');
  let open = false;

  menuBtn.addEventListener('click', () => {
    open = !open;
    menuBtn.setAttribute('aria-expanded', open);
    mobileMenu.classList.toggle('hidden', !open);
    if (open) {
      bars[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    }
  });

  window.closeMobile = function() {
    open = false;
    menuBtn.setAttribute('aria-expanded', false);
    mobileMenu.classList.add('hidden');
    bars[0].style.transform = '';
    bars[1].style.opacity = '';
    bars[2].style.transform = '';
  };
}

window.toggleMobileDropdown = function(btn) {
  const sub = btn.nextElementSibling;
  const chevron = btn.querySelector('.dropdown-chevron');
  const isOpen = !sub.classList.toggle('hidden');
  chevron.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen);
};

// Desktop dropdown aria-expanded (CSS-driven hover/focus)
document.querySelectorAll('[data-dropdown]').forEach(wrapper => {
  const btn = wrapper.querySelector('button[aria-haspopup]');
  if (!btn) return;
  wrapper.addEventListener('mouseenter', () => btn.setAttribute('aria-expanded', 'true'));
  wrapper.addEventListener('mouseleave', () => btn.setAttribute('aria-expanded', 'false'));
  wrapper.addEventListener('focusin',    () => btn.setAttribute('aria-expanded', 'true'));
  wrapper.addEventListener('focusout', e => {
    if (!wrapper.contains(e.relatedTarget)) btn.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile menu on nav link click (replaces inline onclick="closeMobile()")
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { if (window.closeMobile) window.closeMobile(); });
  });
  // Mobile dropdown toggle (replaces inline onclick="toggleMobileDropdown(this)")
  mobileMenu.querySelectorAll('[data-mobile-dropdown] > button').forEach(btn => {
    btn.addEventListener('click', () => window.toggleMobileDropdown(btn));
  });
}

// Scroll-reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .member-card, .portrait-card, .sponsor-card, .league-card, .section-heading, .race-card').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

document.querySelectorAll('.reveal-stagger-container').forEach(container => {
  container.classList.add('reveal-stagger');
});

// Fade-in on scroll (series pages)
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => {
  fadeObserver.observe(el);
});
