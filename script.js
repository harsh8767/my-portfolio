/* =========================================================
   HARSH CHAVAN — PORTFOLIO SCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const scrollBar = document.getElementById('scrollBar');
  const scrollTopBtn = document.getElementById('scrollTop');

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    scrollTopBtn.classList.toggle('visible', y > 500);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
    scrollBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  navToggle.addEventListener('click', () => {
    const isNowOpen = navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open', isNowOpen);
    navToggle.setAttribute('aria-expanded', String(isNowOpen));
  });

  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navLinks = document.querySelectorAll('[data-nav]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => navObserver.observe(section));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), (i % 3) * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Typewriter effect ---------- */
  const roles = ['Python Developer', 
    'Machine Learning Enthusiast', 
    'Computer Engineering Graduate', 
    'Data Science Enthusiast'];
  const typewriterEl = document.getElementById('typewriter');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
    } else {
      charIndex--;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
  }

  if (prefersReducedMotion) {
    typewriterEl.textContent = roles[0];
  } else {
    typeLoop();
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat__num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 30));
        const tick = () => {
          current += step;
          if (current >= target) {
            el.textContent = target;
          } else {
            el.textContent = current;
            requestAnimationFrame(tick);
          }
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------- Contact form (sends real email via Web3Forms) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form__submit');
    const btnText = btn.querySelector('.btn-text');
    const originalText = btnText.textContent;

    const accessKey = form.querySelector('[name="access_key"]').value;
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      formNote.textContent = 'Form not connected yet — add your Web3Forms access key in index.html.';
      return;
    }

    btnText.textContent = 'Sending...';
    btn.disabled = true;
    formNote.textContent = '';

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        formNote.textContent = `Thanks! Your message has been sent — I'll get back to you soon.`;
        form.reset();
      } else {
        formNote.textContent = 'Something went wrong. Please try again or email me directly.';
      }
    } catch (err) {
      formNote.textContent = 'Network error. Please try again or email me directly.';
    } finally {
      btnText.textContent = originalText;
      btn.disabled = false;
      setTimeout(() => { formNote.textContent = ''; }, 6000);
    }
  });

  /* ---------- Particle canvas (ambient background) ---------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let particleAnimationId = null;
  let w, h;

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = Math.min(window.innerHeight * 1.6, document.body.scrollHeight * 0.4);
  }

  function initParticles() {
    const count = window.innerWidth < 720 ? 34 : 70;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.15,
      hue: Math.random() > 0.5 ? '59,130,246' : '34,211,238'
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue}, ${p.alpha})`;
      ctx.fill();
    });
    particleAnimationId = requestAnimationFrame(drawParticles);
  }

  function startParticles() {
    if (particleAnimationId === null) drawParticles();
  }

  function stopParticles() {
    if (particleAnimationId !== null) {
      cancelAnimationFrame(particleAnimationId);
      particleAnimationId = null;
      ctx.clearRect(0, 0, w, h);
    }
  }

  // The particles are only visible in the dark theme, so they only run there.
  if (!prefersReducedMotion) {
    resizeCanvas();
    initParticles();
    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
  }

  /* ---------- Subtle parallax on hero visual ---------- */
  const heroVisual = document.querySelector('.hero__visual');
  if (heroVisual && !prefersReducedMotion && window.innerWidth > 1024) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      heroVisual.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  /* ---------- Light / dark theme toggle ---------- */
  const rootElement = document.documentElement;
  const themeToggleButton = document.getElementById('themeToggle');

  function syncParticlesWithTheme() {
    if (prefersReducedMotion) return;
    if (rootElement.dataset.theme === 'dark') startParticles();
    else stopParticles();
  }

  function applyTheme(themeName) {
    const isDark = themeName === 'dark';
    rootElement.dataset.theme = isDark ? 'dark' : 'light';
    themeToggleButton.setAttribute('aria-pressed', String(isDark));
    themeToggleButton.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    syncParticlesWithTheme();
  }

  themeToggleButton.addEventListener('click', () => {
    const nextTheme = rootElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('portfolio-theme', nextTheme);
    } catch (err) {
      // Storage can be blocked; the theme still switches for this visit.
    }
    applyTheme(nextTheme);
  });

  applyTheme(rootElement.dataset.theme);
});
