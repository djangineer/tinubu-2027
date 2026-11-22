/* main.js — site-wide behaviour: reveal, back-to-top, cookie notice, accordion, calendar, scroll-spy */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sticky header shadow */
  const header = $('.site-header');
  const toTop = $('.to-top');
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-stuck', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* Smooth in-page anchors (CSS handles the scrolling; this moves focus for keyboard/screen-reader users) */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const t = document.getElementById(a.getAttribute('href').slice(1));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
    history.pushState(null, '', a.getAttribute('href'));
  });

  /* Reveal on scroll */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* Meters animate to their value when seen */
  $$('.meter[data-value]').forEach((m) => {
    const v = m.dataset.value + '%';
    const bar = m.firstElementChild;
    if (!bar) return;
    if (!('IntersectionObserver' in window) || reduce) { bar.style.setProperty('--v', v); return; }
    new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { bar.style.setProperty('--v', v); o.disconnect(); } }).observe(m);
  });

  /* Accordion (FAQ) — one trigger button per panel, aria-expanded + aria-controls */
  $$('[data-accordion]').forEach((acc) => {
    const single = acc.hasAttribute('data-single');
    $$('.acc-btn', acc).forEach((btn) => {
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        if (single && !open) $$('.acc-btn[aria-expanded="true"]', acc).forEach(close);
        open ? close(btn) : openIt(btn);
      });
      btn.addEventListener('keydown', (e) => {
        const btns = $$('.acc-btn', acc).filter((b) => !b.closest('[hidden]'));
        const i = btns.indexOf(btn);
        const go = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: btns.length - 1 }[e.key];
        if (go !== undefined && btns.length) { e.preventDefault(); btns[(go + btns.length) % btns.length].focus(); }
      });
    });
    function openIt(b) { b.setAttribute('aria-expanded', 'true'); document.getElementById(b.getAttribute('aria-controls')).classList.add('is-open'); }
    function close(b) { b.setAttribute('aria-expanded', 'false'); document.getElementById(b.getAttribute('aria-controls')).classList.remove('is-open'); }
  });
  /* Deep link to a FAQ item */
  if (location.hash) {
    const b = document.querySelector('.acc-btn[aria-controls="' + location.hash.slice(1) + '"]');
    if (b) b.click();
  }

  /* Scroll-spy for sticky side navigation */
  const spy = $$('.aside-nav a[href^="#"]');
  if (spy.length && 'IntersectionObserver' in window) {
    const map = new Map(spy.map((a) => [a.getAttribute('href').slice(1), a]));
    const so = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { spy.forEach((a) => a.classList.remove('is-active')); map.get(en.target.id)?.classList.add('is-active'); }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) so.observe(s); });
  }

  /* Calendar (events page) — a plain month view; events are listed below it */
  const cal = $('[data-calendar]');
  if (cal) {
    let d = new Date(); d.setDate(1);
    const title = $('[data-cal-title]', cal), grid = $('[data-cal-grid]', cal);
    const render = () => {
      const y = d.getFullYear(), m = d.getMonth();
      title.textContent = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      const first = (new Date(y, m, 1).getDay() + 6) % 7; // Monday start
      const days = new Date(y, m + 1, 0).getDate();
      const now = new Date();
      let h = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((x) => '<span class="dow" aria-hidden="true">' + x + '</span>').join('');
      for (let i = 0; i < first; i++) h += '<span aria-hidden="true"></span>';
      for (let i = 1; i <= days; i++) {
        const t = now.getFullYear() === y && now.getMonth() === m && now.getDate() === i;
        h += '<span' + (t ? ' class="today" aria-current="date"' : '') + '>' + i + '</span>';
      }
      grid.innerHTML = h;
    };
    $('[data-cal-prev]', cal).addEventListener('click', () => { d.setMonth(d.getMonth() - 1); render(); });
    $('[data-cal-next]', cal).addEventListener('click', () => { d.setMonth(d.getMonth() + 1); render(); });
    render();
  }

  /* Cookie notice — stores only the user's choice in localStorage */
  const KEY = 'cookie-choice-v1';
  const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const set = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* storage unavailable */ } };
  function showCookie() {
    if (get() || $('.cookie')) return;
    const el = document.createElement('div');
    el.className = 'cookie';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Cookie notice');
    el.innerHTML = '<h2>Your cookie choices</h2><p>This demonstration site sets no tracking cookies. If analytics are added later, they will only run if you accept. Read our <a href="cookie-policy.html">cookie policy</a>.</p>' +
      '<div class="btn-row"><button type="button" class="btn btn--primary btn--sm" data-c="accepted">Accept analytics</button><button type="button" class="btn btn--ghost btn--sm" data-c="essential">Essential only</button></div>';
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-c]'); if (!b) return;
      set(b.dataset.c); el.remove();
      document.dispatchEvent(new CustomEvent('cookie-choice', { detail: b.dataset.c }));
    });
    document.body.appendChild(el);
  }
  setTimeout(showCookie, 800);
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); try { localStorage.removeItem(KEY); } catch (x) { /* ignore */ } showCookie(); }
  });

  /* Current year */
  $$('[data-year]').forEach((n) => { n.textContent = new Date().getFullYear(); });
})();
