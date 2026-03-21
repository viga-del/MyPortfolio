/* =============================================
   VIGASHINI S — PORTFOLIO JAVASCRIPT
   ============================================= */

// ── Custom CSS Cursor ────────────────────────
const cursorDot = document.createElement('div');
cursorDot.className = 'cur-dot';
document.body.appendChild(cursorDot);

const cursorRing = document.createElement('div');
cursorRing.className = 'cur-ring';
document.body.appendChild(cursorRing);

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let rx = mx, ry = my;

// Move dot instantly with mouse
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursorDot.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
});

// Ring follows with smooth lag
function followRing() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  cursorRing.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
  requestAnimationFrame(followRing);
}
followRing();

// Grow ring + change dot on hover
document.querySelectorAll('a, button, .project-card, .skill-card, .cert-card, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.classList.add('hovered');
    cursorDot.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.classList.remove('hovered');
    cursorDot.classList.remove('hovered');
  });
});

// Remove old canvas if present
const oldCanvas = document.getElementById('cursorCanvas');
if (oldCanvas) oldCanvas.remove();

// ── Nav scroll effect ────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Mobile nav toggle ────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Typing effect ────────────────────────────
const roles = [
  'Java Developer',
  'AI/ML Enthusiast',
  'Computer Vision Builder',
  'Problem Solver',
  'CS Engineering Student'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typingText');

function type() {
  const current = roles[roleIndex];

  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => { isDeleting = true; }, 1800);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  const speed = isDeleting ? 50 : 90;
  setTimeout(type, speed);
}

setTimeout(type, 800);

// ── Intersection Observer for reveals ────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animate on scroll (sections) ────────────
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Trigger skill bar animations
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
      });

      // Trigger skill card stagger
      entry.target.querySelectorAll('.skill-card').forEach((card, i) => {
        const delay = card.getAttribute('data-delay') || i * 100;
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, parseInt(delay));
      });

      // Trigger project cards
      entry.target.querySelectorAll('.project-card').forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 150);
      });

      // Trigger cert cards
      entry.target.querySelectorAll('.cert-card').forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateX(0)';
        }, i * 100);
      });
    }
  });
}, { threshold: 0.1 });

// Initial hide for animated elements
document.querySelectorAll('.skill-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

document.querySelectorAll('.project-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.5s ease, background 0.3s ease, margin 0.3s ease, padding 0.3s ease, border-color 0.3s ease';
});

document.querySelectorAll('.cert-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateX(-20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease';
});

document.querySelectorAll('.section').forEach(s => sectionObserver.observe(s));

// ── Stat counter animation ───────────────────
function animateCounter(el, target, suffix) {
  let current = 0;
  const duration = 2000;
  const step = target / (duration / 16);

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseFloat(el.getAttribute('data-count'));
        animateCounter(el, target);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── Hero reveals on load ─────────────────────
window.addEventListener('load', () => {
  const heroItems = document.querySelectorAll('.hero .reveal');
  heroItems.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + i * 150);
  });
});

// ── Contact form ─────────────────────────────
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  btn.textContent = '✅ Message Sent!';
  btn.style.background = 'rgba(124, 255, 203, 0.2)';
  btn.style.color = 'var(--accent)';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.style.color = '';
    btn.disabled = false;
    contactForm.reset();
  }, 3000);
});

// ── Smooth active nav link ───────────────────
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < bottom) {
        document.querySelectorAll('.nav-links a').forEach(a => a.style.color = '');
        link.style.color = 'var(--accent)';
      }
    }
  });
});

// hero name stays static — no parallax