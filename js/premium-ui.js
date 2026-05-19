/**
 * JNNCE MCA Portal — Premium UI Engine v2.1
 * Handles: Scroll-Reveal, Stat Counters, Hamburger Animation
 * Lightweight Vanilla JS — no dependencies
 */

(function () {
  'use strict';

  /* ── 1. SCROLL-REVEAL ENGINE ──────────────────────────────────────────── */
  const revealTargets = [
    ...document.querySelectorAll('.reveal, .reveal-left, .reveal-right'),
    ...document.querySelectorAll('.reveal-stagger > *')
  ];

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealTargets.forEach((el) => el.classList.add('reveal-visible'));
  }


  /* ── 2. ANIMATED STAT COUNTERS ────────────────────────────────────────── */
  const countEls = document.querySelectorAll('.stat-number[data-target]');

  if (countEls.length && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          const duration = 1400;
          const step = 16;
          const increment = target / (duration / step);
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current);
            }
          }, step);

          statObserver.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    countEls.forEach((el) => statObserver.observe(el));
  }


  /* ── 3. HAMBURGER ANIMATED X & OVERLAY ────────────────────────────────── */
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    let overlay = document.querySelector('.mobile-nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mobile-nav-overlay';
      document.body.appendChild(overlay);
    }

    const closeMenu = () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = toggle.classList.toggle('open');
      navLinks.classList.toggle('active', isOpen);
      overlay.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMenu();
      }
    });

    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        closeMenu();
      }
    });
  }


  /* ── 4. FACILITY CARD STAGGER REVEAL ──────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const facilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            facilityObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll(
      '.facilities-grid .facility-card, .facilities-page-grid .facility-card'
    ).forEach((card, i) => {
      card.classList.add('reveal');
      card.style.transitionDelay = `${i * 80}ms`;
      facilityObserver.observe(card);
    });
  }


  /* ── 5. FACULTY CARD STAGGER REVEAL ──────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const facultyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            facultyObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll('.faculty-card').forEach((card, i) => {
      card.classList.add('reveal');
      card.style.transitionDelay = `${i * 50}ms`;
      facultyObserver.observe(card);
    });
  }


  /* ── 6. BACK-TO-TOP VISIBILITY ────────────────────────────────────────── */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

})();
