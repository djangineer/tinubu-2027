/* forms.js — client-side validation + honest submission feedback.

   BACKEND INTEGRATION POINT
   -------------------------
   Forms carry data-form="newsletter|contact|volunteer". If a form has a data-endpoint attribute
   (e.g. data-endpoint="https://api.example.org/volunteers") the validated data is POSTed there as JSON.
   With no endpoint (the default in this package) NOTHING is sent or stored, and the success
   message says so. Replace/set the endpoint only once a lawful backend and privacy notice exist. */
(function () {
  'use strict';
  const PHONE = /^(\+?234|0)[789][01]\d{8}$/;               // Nigerian mobile numbers, e.g. 0803 123 4567 or +234 803 123 4567
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function label(el) {
    const l = el.id && document.querySelector('label[for="' + el.id + '"]');
    return l ? l.textContent.replace('*', '').replace('(optional)', '').trim() : (el.getAttribute('aria-label') || 'This field');
  }
  function check(el) {
    const v = (el.type === 'checkbox' ? (el.checked ? 'y' : '') : el.value).trim();
    const name = label(el);
    if (el.required && !v) return el.type === 'checkbox' ? 'Tick the box to confirm you agree before continuing.' : (el.tagName === 'SELECT' ? 'Choose an option for ' + name.toLowerCase() + '.' : 'Enter ' + name.toLowerCase() + '.');
    if (!v) return '';
    if (el.type === 'email' && !EMAIL.test(v)) return 'Enter an email address in the format name@example.com.';
    if (el.type === 'tel') { const p = v.replace(/[\s-]/g, ''); if (!PHONE.test(p)) return 'Enter a Nigerian mobile number, like 0803 123 4567 or +234 803 123 4567.'; }
    const min = parseInt(el.getAttribute('minlength') || '0', 10);
    if (min && v.length < min) return name + ' needs at least ' + min + ' characters (you have ' + v.length + ').';
    return '';
  }
  function errEl(el) {
    let e = document.getElementById(el.id + '-error');
    if (!e) {
      e = document.createElement('span'); e.className = 'error-msg'; e.id = el.id + '-error';
      e.setAttribute('role', 'status');
      (el.type === 'checkbox' ? el.closest('.check') : el).insertAdjacentElement('afterend', e);
    }
    return e;
  }
  function mark(el, msg) {
    const e = errEl(el);
    const field = el.closest('.field') || el.parentElement;
    e.textContent = msg;
    field.classList.toggle('has-error', !!msg);
    if (msg) {
      el.setAttribute('aria-invalid', 'true');
      const ids = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (!ids.includes(e.id)) { ids.push(e.id); el.setAttribute('aria-describedby', ids.join(' ')); }
    } else {
      el.removeAttribute('aria-invalid');
      el.setAttribute('aria-describedby', (el.getAttribute('aria-describedby') || '').split(' ').filter((x) => x && x !== e.id).join(' ') || '');
      if (!el.getAttribute('aria-describedby')) el.removeAttribute('aria-describedby');
    }
    return !msg;
  }

  document.querySelectorAll('form[data-form]').forEach((form) => {
    form.noValidate = true;                                  // we provide our own, accessible messages
    const controls = Array.from(form.querySelectorAll('input:not([type=hidden]):not([type=submit]), select, textarea'));
    const summary = form.querySelector('[data-summary]');
    const success = form.parentElement.querySelector('[data-success]') || form.querySelector('[data-success]');
    const status = form.querySelector('[data-status]');
    const counter = form.querySelector('[data-counter]');

    // Validate on blur; once invalid, re-validate as the person types so the message clears
    controls.forEach((c) => {
      c.addEventListener('blur', () => { if (c.type !== 'checkbox' || c.dataset.touched) mark(c, check(c)); });
      c.addEventListener('input', () => { if (c.getAttribute('aria-invalid')) mark(c, check(c)); });
      c.addEventListener('change', () => { c.dataset.touched = '1'; if (c.tagName === 'SELECT' || c.type === 'checkbox') mark(c, check(c)); });
    });
    const msg = form.querySelector('textarea[maxlength]');
    if (msg && counter) { const up = () => { counter.textContent = msg.value.length + ' / ' + msg.maxLength; }; msg.addEventListener('input', up); up(); }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errors = [];
      controls.forEach((c) => { const m = check(c); mark(c, m); if (m) errors.push({ c, m }); });

      if (errors.length) {
        if (summary) {                                        // multi-field forms: linked summary, focus it
          summary.hidden = false;
          summary.innerHTML = '<h2 id="' + form.id + '-sum-h">Fix ' + errors.length + (errors.length === 1 ? ' problem' : ' problems') + ' to continue</h2><ul>' +
            errors.map((x) => '<li><a href="#' + x.c.id + '">' + x.m + '</a></li>').join('') + '</ul>';
          summary.setAttribute('tabindex', '-1'); summary.focus();
          summary.querySelectorAll('a').forEach((a) => a.addEventListener('click', (ev) => { ev.preventDefault(); document.getElementById(a.getAttribute('href').slice(1)).focus(); }));
        } else {
          errors[0].c.focus();
          if (status) { status.textContent = errors[0].m; status.className = 'form-msg'; status.style.color = ''; }
        }
        return;
      }
      if (summary) { summary.hidden = true; summary.innerHTML = ''; }

      const data = {};
      controls.forEach((c) => { if (c.type === 'checkbox') { data[c.name] = c.checked; } else data[c.name] = c.value.trim(); });
      const endpoint = form.dataset.endpoint;
      const btn = form.querySelector('[type=submit]');
      const orig = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        if (endpoint) {
          const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
          if (!res.ok) throw new Error('Server responded ' + res.status);
        } else {
          await new Promise((r) => setTimeout(r, 450));       // demo only: no network request is made
        }
        const demo = !endpoint;
        const kind = form.dataset.form;
        const text = {
          newsletter: 'Thank you. Your address passed validation.',
          contact: 'Your message passed validation.',
          volunteer: 'Your registration passed validation.'
        }[kind] || 'Form passed validation.';
        const note = demo ? ' This is a demonstration build: no server is connected, so nothing has been sent or saved. Operators connect a backend through the data-endpoint attribute (see README).' : ' We will respond using the details you provided.';
        if (success) {
          success.innerHTML = '<h3>' + (demo ? 'Validated — not submitted' : 'Received') + '</h3><p style="margin:0">' + text + note + '</p>';
          success.hidden = false; success.setAttribute('tabindex', '-1');
          if (kind !== 'newsletter') form.hidden = true;
          success.focus();
        } else if (status) {
          status.textContent = text + note; status.className = 'form-msg'; status.style.color = 'inherit';
        }
        form.reset();
        controls.forEach((c) => mark(c, ''));
        if (counter) counter.textContent = '0 / ' + (msg ? msg.maxLength : 0);
      } catch (err) {
        const m = 'We could not send this. Check your connection and try again.';
        if (status) { status.textContent = m; status.className = 'form-msg'; }
        else if (summary) { summary.hidden = false; summary.innerHTML = '<h2>Not sent</h2><p style="margin:0">' + m + '</p>'; summary.focus(); }
      } finally {
        btn.disabled = false; btn.textContent = orig;
      }
    });
  });
})();
