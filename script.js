/* ============================================================
   T.DRE PORTFOLIO — MASTER SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- NAVBAR SCROLL ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- HAMBURGER ---------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  /* ---------- NAV DROPDOWN ---------- */
  document.querySelectorAll('.nav-dropdown').forEach(dd => {
    const toggle = dd.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dd.classList.toggle('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  });

  /* ---------- HERO CANVAS (topology mesh) ---------- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [];
    const NUM = 60, DIST = 140;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); initNodes(); }, { passive: true });

    class Node {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }
    }

    function initNodes() {
      nodes = Array.from({ length: NUM }, () => new Node());
    }
    initNodes();

    let mouse = { x: -9999, y: -9999 };
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }, { passive: true });

    function draw() {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(n => n.update());

      // lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,224,255,${(1 - d / DIST) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        // mouse interaction
        const dx = nodes[i].x - mouse.x;
        const dy = nodes[i].y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,224,255,${(1 - d / 180) * 0.4})`;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // dots
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,224,255,0.5)';
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------- TYPED.JS ---------- */
  const typingEl = document.getElementById('typing');
  if (typingEl && typeof Typed !== 'undefined') {
    new Typed('#typing', {
      strings: [
        'Web Developer.',
        'UI/UX Designer.',
        'Network Engineer.',
        'Cloud Enthusiast.',
        'Problem Solver.'
      ],
      typeSpeed: 55,
      backSpeed: 35,
      backDelay: 2000,
      loop: true,
    });
  }

  /* ---------- AOS (custom lightweight) ---------- */
  function initAOS() {
    const els = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = parseInt(e.target.dataset.aosDelay) || 0;
          setTimeout(() => e.target.classList.add('aos-animate'), delay);
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => observer.observe(el));
  }
  initAOS();

  /* ---------- COUNTER ANIMATION ---------- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ---------- SKILL BAR ANIMATION ---------- */
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.width;
        e.target.style.width = w + '%';
        barObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-bar-fill[data-width]').forEach(b => {
    b.style.width = '0%';
    barObserver.observe(b);
  });

  /* ---------- PROGRESS BAR ---------- */
  const progObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.progress;
        e.target.style.width = w + '%';
        progObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.progress-fill[data-progress]').forEach(b => {
    b.style.width = '0%';
    progObserver.observe(b);
  });

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- CONTACT/QUOTE FORM ---------- */
  const forms = document.querySelectorAll('.contact-form, .quote-form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      // Let formsubmit.co handle it, but show success message after
      // If using native POST, the page reloads — so this is just UI polish
    });
  });

  /* ---------- SMOOTH BACK TO TOP ---------- */
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- ACTIVE NAV LINK ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });

});