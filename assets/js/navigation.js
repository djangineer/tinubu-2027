/* navigation.js — mobile menu, dropdowns, keyboard behaviour.
   The header/footer markup is in each HTML file (no build step); this file only adds behaviour. */
(function () {
  'use strict';
  const nav = document.getElementById('primary-nav');
  const btn = document.querySelector('.menu-btn');
  const backdrop = document.querySelector('.nav-backdrop');
  if (!nav || !btn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  const drops = Array.from(nav.querySelectorAll('.has-drop'));

  function closeDrops(except) {
    drops.forEach((d) => {
      if (d === except) return;
      d.classList.remove('is-open');
      d.querySelector('.nav-toggle-btn').setAttribute('aria-expanded', 'false');
    });
  }
  function toggleDrop(d, force) {
    const b = d.querySelector('.nav-toggle-btn');
    const open = force !== undefined ? force : !d.classList.contains('is-open');
    closeDrops(open ? d : null);
    d.classList.toggle('is-open', open);
    b.setAttribute('aria-expanded', String(open));
  }
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    backdrop && backdrop.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-lock', open && mq.matches);
    if (!open) closeDrops();
  }

  btn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  backdrop && backdrop.addEventListener('click', () => setMenu(false));

  drops.forEach((d) => {
    const b = d.querySelector('.nav-toggle-btn');
    b.addEventListener('click', () => toggleDrop(d));
    // Desktop: open on hover as a convenience (click and keyboard still work)
    d.addEventListener('mouseenter', () => { if (!mq.matches) toggleDrop(d, true); });
    d.addEventListener('mouseleave', () => { if (!mq.matches) toggleDrop(d, false); });
    d.addEventListener('keydown', (e) => {
      const links = Array.from(d.querySelectorAll('.drop a'));
      if (e.key === 'ArrowDown' && document.activeElement === b) { e.preventDefault(); toggleDrop(d, true); links[0] && links[0].focus(); }
      else if (e.key === 'ArrowDown' && links.includes(document.activeElement)) { e.preventDefault(); links[(links.indexOf(document.activeElement) + 1) % links.length].focus(); }
      else if (e.key === 'ArrowUp' && links.includes(document.activeElement)) { e.preventDefault(); links[(links.indexOf(document.activeElement) - 1 + links.length) % links.length].focus(); }
      else if (e.key === 'Escape' && d.classList.contains('is-open')) { toggleDrop(d, false); b.focus(); e.stopPropagation(); }
    });
    d.addEventListener('focusout', (e) => { if (!d.contains(e.relatedTarget) && !mq.matches) toggleDrop(d, false); });
  });

  // Close on link click (mobile), outside click, Escape, or when leaving mobile width
  nav.addEventListener('click', (e) => { if (e.target.closest('a') && mq.matches) setMenu(false); });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target) && !btn.contains(e.target)) closeDrops(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); btn.focus(); }
  });
  (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(() => setMenu(false));

  // Mark ancestors of the current page's dropdown link
  drops.forEach((d) => { if (d.querySelector('[aria-current="page"]')) d.querySelector('.nav-toggle-btn').classList.add('is-current'); });
})();
