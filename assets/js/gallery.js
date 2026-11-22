/* gallery.js — accessible image lightbox (native <dialog>) + before/after compare slider.
   Usage: <button class="gal-item" data-lightbox="groupName" data-caption="…"> <figure|img> </button> */
(function () {
  'use strict';

  const triggers = Array.from(document.querySelectorAll('[data-lightbox]'));
  if (triggers.length) {
    const dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Image viewer');
    dlg.innerHTML =
      '<div class="lb-stage"><div data-lb-media></div>' +
      '<div class="lb-bar"><p data-lb-cap style="margin:0" aria-live="polite"></p>' +
      '<div class="btn-row" style="gap:.5rem;flex-wrap:nowrap">' +
      '<button type="button" class="icon-btn" data-lb-prev aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button type="button" class="icon-btn" data-lb-next aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '<button type="button" class="icon-btn" data-lb-close aria-label="Close image viewer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</div></div></div>';
    document.body.appendChild(dlg);
    const media = dlg.querySelector('[data-lb-media]');
    const cap = dlg.querySelector('[data-lb-cap]');
    let group = [], idx = 0, opener = null;

    const visible = () => triggers.filter((t) => t.dataset.lightbox === group[0]?.dataset.lightbox && !t.closest('[hidden]'));

    function show(i) {
      const list = visible();
      idx = (i + list.length) % list.length;
      const t = list[idx];
      const src = t.querySelector('img');
      media.innerHTML = '';
      if (src) {
        const im = document.createElement('img');
        im.src = t.dataset.full || src.currentSrc || src.src; im.alt = src.alt;
        media.appendChild(im);
      } else {
        const fig = t.querySelector('.ph').cloneNode(true);
        fig.classList.remove('r-3-4', 'r-2-3', 'r-4-3', 'r-1-1'); fig.classList.add('r-16-9');
        media.appendChild(fig);
      }
      cap.textContent = (t.dataset.caption || '') + '  (' + (idx + 1) + ' of ' + list.length + ')';
    }
    triggers.forEach((t) => t.addEventListener('click', () => {
      opener = t; group = [t]; show(visible().indexOf(t));
      dlg.showModal();
      dlg.querySelector('[data-lb-close]').focus();
    }));
    dlg.querySelector('[data-lb-prev]').addEventListener('click', () => show(idx - 1));
    dlg.querySelector('[data-lb-next]').addEventListener('click', () => show(idx + 1));
    dlg.querySelector('[data-lb-close]').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); }); // backdrop click
    dlg.addEventListener('close', () => opener && opener.focus());
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  document.querySelectorAll('[data-compare]').forEach((c) => {
    const r = c.querySelector('input[type=range]');
    const set = () => c.style.setProperty('--pos', r.value + '%');
    r.addEventListener('input', set); set();
  });
})();
