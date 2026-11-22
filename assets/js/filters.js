/* filters.js — generic search / category filtering / load-more for any list.
   Markup contract:
     <div data-filter-root data-page-size="6">
       <input data-search>  <select data-filter="category">  or  <button data-chip="value" aria-pressed>
       <div data-item data-category="x" data-text="searchable text">…</div>
       <p data-count aria-live="polite"></p>  <div data-empty hidden>…</div>  <button data-more>…</button>
*/
(function () {
  'use strict';
  document.querySelectorAll('[data-filter-root]').forEach((root) => {
    const items = Array.from(root.querySelectorAll('[data-item]'));
    const search = root.querySelector('[data-search]');
    const selects = Array.from(root.querySelectorAll('[data-filter]'));
    const chips = Array.from(root.querySelectorAll('[data-chip]'));
    const count = root.querySelector('[data-count]');
    const empty = root.querySelector('[data-empty]');
    const more = root.querySelector('[data-more]');
    const reset = root.querySelector('[data-reset]');
    const size = parseInt(root.dataset.pageSize || '0', 10);
    let shown = size || Infinity;
    let chipVal = 'all';

    const norm = (s) => (s || '').toLowerCase();

    function matches(el) {
      const q = norm(search && search.value).trim();
      if (q && !norm(el.dataset.text || el.textContent).includes(q)) return false;
      for (const s of selects) {
        if (s.value && s.value !== 'all' && !(' ' + norm(el.dataset[s.dataset.filter]) + ' ').includes(' ' + norm(s.value) + ' ')) return false;
      }
      if (chipVal !== 'all' && !(' ' + norm(el.dataset.category) + ' ').includes(' ' + norm(chipVal) + ' ')) return false;
      return true;
    }

    function apply(resetPage) {
      if (resetPage) shown = size || Infinity;
      const hits = items.filter(matches);
      items.forEach((el) => { el.hidden = true; });
      hits.slice(0, shown).forEach((el) => { el.hidden = false; });
      if (count) count.textContent = hits.length === 0 ? 'No results.' : 'Showing ' + Math.min(shown, hits.length) + ' of ' + hits.length + (hits.length === 1 ? ' result' : ' results') + '.';
      if (empty) empty.hidden = hits.length !== 0;
      if (more) more.hidden = hits.length <= shown;
      root.dispatchEvent(new CustomEvent('filtered', { detail: { hits: hits.length } }));
    }

    search && search.addEventListener('input', () => apply(true));
    search && search.addEventListener('keydown', (e) => { if (e.key === 'Enter') e.preventDefault(); });
    selects.forEach((s) => s.addEventListener('change', () => apply(true)));
    chips.forEach((c) => c.addEventListener('click', () => {
      chipVal = c.dataset.chip;
      chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      apply(true);
    }));
    more && more.addEventListener('click', () => {
      const before = items.filter((i) => !i.hidden).length;
      shown += size; apply(false);
      const next = items.filter((i) => !i.hidden)[before];
      if (next) { const f = next.querySelector('a, button') || next; f.focus && f.focus({ preventScroll: false }); }
    });
    reset && reset.addEventListener('click', () => {
      if (search) search.value = '';
      selects.forEach((s) => { s.value = ''; });
      chipVal = 'all';
      chips.forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.chip === 'all')));
      apply(true);
    });
    apply(true);
  });
})();
