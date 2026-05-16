/* ============================================================
   script.js — Adnan Ardiansyah Portfolio
   All JavaScript centralized here
   ============================================================ */

/* ── THEME ───────────────────────────────────── */
(function() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

function initTheme() {
  const toggleBtns = document.querySelectorAll('.theme-toggle, .mobile-theme-btn');
  if (!toggleBtns.length) return;

  function updateThemeLabel() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.theme-label').forEach(el => {
      el.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    });
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeLabel();
    });
  });

  updateThemeLabel();
}

/* ── CUSTOM CURSOR ───────────────────────────── */
function initCursor() {
  const dot = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(pointer:coarse)').matches) return;

  let mx = -100, my = -100, rx = -100, ry = -100;
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  document.addEventListener('mousedown', () => document.body.classList.add('clicking'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('clicking'));

  (function anim() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    rafId = requestAnimationFrame(anim);
  })();

  const hoverEls = 'a,button,.svc,.proj-card,.sk-card,.hstat,.exp-sidebar-item,.soc-btn,.theme-toggle';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('h'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('h'));
  });
}

/* ── NAV SCROLL EFFECT ───────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 50) {
      nav.style.backdropFilter = 'blur(28px) saturate(1.8)';
    } else {
      nav.style.backdropFilter = 'blur(20px) saturate(1.6)';
    }
  }, { passive: true });
}

/* ── ACTIVE NAV ON SCROLL ────────────────────── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('on'));
        const id = entry.target.id;
        const active = document.querySelector(`.nav-menu a[href="#${id}"]`) ||
                       document.querySelector(`.nav-menu a[href*="${id}"]`);
        if (active) active.classList.add('on');
      }
    });
  }, { threshold: 0.3, rootMargin: '-60px 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ── MOBILE MENU ─────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── REVEAL ON SCROLL ────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.rv, .sk-card');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => obs.observe(el));
}

/* ── COUNT-UP ANIMATION ──────────────────────── */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '+';
      let current = 0;
      const duration = 900;
      const step = target / (duration / 16);

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 16);

      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
}

/* ── EXPERIENCE SIDEBAR ──────────────────────── */
function initExpSidebar() {
  const items = document.querySelectorAll('.exp-sidebar-item');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('on'));
      item.classList.add('on');
    });
  });
}

/* ── CONTACT FORM (Formspree) ────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('formBtn');
  const status = document.getElementById('formStatus');
  if (!form || !btn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    if (!name || !email || !message) {
      showStatus('error', 'Mohon isi semua field yang wajib diisi.');
      return;
    }

    // Loading state
    btn.disabled = true;
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin .8s linear infinite"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0"/></svg> Mengirim...';

    try {
      // ⚠️  GANTI "YOUR_FORM_ID" dengan ID form Formspree kamu
      // Daftar gratis di https://formspree.io → New Form → copy ID-nya
      const FORMSPREE_ID = 'YOUR_FORM_ID';

      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });

      if (res.ok) {
        showStatus('success', '✓ Pesan terkirim! Saya akan membalas dalam 1–2 hari kerja.');
        form.reset();
      } else {
        const data = await res.json();
        const msg = data?.errors?.map(e => e.message).join(', ') || 'Terjadi kesalahan.';
        showStatus('error', msg);
      }
    } catch (err) {
      showStatus('error', 'Gagal mengirim pesan. Coba hubungi via email langsung.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Kirim Pesan <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    }
  });

  function showStatus(type, msg) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status ' + type;
    setTimeout(() => { status.className = 'form-status'; }, 6000);
  }
}

/* ── SMOOTH SCROLL FOR SAME-PAGE ANCHORS ─────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── SPIN KEYFRAME (for loading spinner) ─────── */
const style = document.createElement('style');
style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(style);

/* ── INIT ALL ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCursor();
  initNav();
  initScrollSpy();
  initMobileMenu();
  initReveal();
  initCountUp();
  initExpSidebar();
  initContactForm();
  initSmoothScroll();
});