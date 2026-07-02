/* =========================================
   CUSTOM CURSOR (canvas-based)
   ========================================= */
(function initCursor() {
  const canvas = document.getElementById('cursorCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Skip the custom cursor entirely on touch devices
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouch) {
    canvas.style.display = 'none';
    return;
  }

  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent').trim() || '#7cffcb';

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX, dotY = mouseY;
  let trailX = mouseX, trailY = mouseY;
  let visible = false;
  let hoveringInteractive = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      visible = true;
      dotX = mouseX; dotY = mouseY;
      trailX = mouseX; trailY = mouseY;
    }
  });

  window.addEventListener('mouseleave', () => { visible = false; });
  window.addEventListener('mouseenter', () => { visible = true; });

  // Grow the trail ring slightly over links/buttons
  const interactiveSelector = 'a, button, input, textarea, .project-card, .cert-card, .contact-item, .skill-card';
  document.addEventListener('mouseover', (e) => {
    hoveringInteractive = !!e.target.closest(interactiveSelector);
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (visible) {
      // Dot follows mouse tightly
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      // Trail ring follows more loosely
      trailX += (mouseX - trailX) * 0.14;
      trailY += (mouseY - trailY) * 0.14;

      const dotRadius = hoveringInteractive ? 5 : 6;
      const trailRadius = hoveringInteractive ? 26 : 18;

      // Dot
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();

      // Trail ring
      ctx.beginPath();
      ctx.arc(trailX, trailY, trailRadius, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* =========================================
   NAV: scroll state + mobile toggle
   ========================================= */
(function initNav() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
})();

/* =========================================
   HERO: typing effect
   ========================================= */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'Computer Science engineer',
    'AI / ML Enthusiast',
    'Problem Solver',
    'Building Scalable Systems'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(tick, deleting ? 40 : 80);
  }
  tick();
})();

/* =========================================
   REVEAL ON SCROLL
   ========================================= */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => observer.observe(el));
})();

/* =========================================
   HERO STATS: count up
   ========================================= */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => observer.observe(el));
})();

/* =========================================
   SKILLS: animate bar widths in view
   ========================================= */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width') || '0';
        requestAnimationFrame(() => {
          bar.style.width = width + '%';
        });
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach((bar) => observer.observe(bar));
})();

/* =========================================
   CONTACT FORM (front-end only placeholder)
   ========================================= */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = 'Message sent ✓';
    btn.disabled = true;
    form.reset();
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 2500);
  });
})();