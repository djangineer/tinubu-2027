# Support Tinubu 2027 — independent supporters' platform

A complete static website: **HTML5, CSS3 and vanilla JavaScript only**. No frameworks, no build step, no Node.js, no backend.

> **Read this first.** This is an *independent supporters' platform*, not an official site of the President, the Presidency, the Government of Nigeria or any party. It ships with **placeholder content on purpose**: no statistics, quotations, project completions, endorsements or affiliations have been invented. Everything marked *Sample* or *Placeholder* must be replaced with verified, sourced material before launch. Do not remove the disclosure strip or footer disclaimer unless the operator has written authorisation to present the site as official.

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8080      # then visit http://localhost:8080
```

Hosting: upload the folder to any static host (cPanel, Netlify, GitHub Pages, S3). `404.html` is the not-found page.

## Pages (22 HTML files)

index, about, agenda, achievements, projects, manifesto, news, news-article (reusable template), speeches, events, support-groups, get-involved, volunteer, media, voter-information, faq, contact, privacy-policy, terms-of-use, cookie-policy, campaign-disclaimer, 404. Plus `sitemap.xml`, `robots.txt`, `assets/icons/favicon.svg`.

## Structure

```
assets/css/   style.css (design system + components) · responsive.css · animations.css
assets/js/    main.js (reveal, accordion, calendar, cookie, back-to-top, scroll-spy)
              navigation.js (menu, dropdowns, keyboard)   filters.js (search/filter/load-more)
              projects.js (directory + data)               forms.js (validation, submission)
              gallery.js (lightbox, before/after slider)
assets/docs/  manifesto-placeholder.txt   assets/images/…  (empty folders for your photos)
```

Design tokens (colours, type, spacing, radii) are CSS variables at the top of `style.css`. The primary green is the Nigerian flag green (`--green-700: #008751`); `--green-900` is a deeper accent used for the footer. Fonts: Manrope + Inter via Google Fonts.

## Replacing content

Each page is plain HTML: edit the text directly. Every shared header/footer is repeated in each file; to change navigation, edit the `<header>`/`<footer>` in every page (a find-and-replace across files works, as the markup is identical).

| To replace | Do this |
|---|---|
| **Operator name / disclosure** | Search all files for `[Operator name]`; replace with the real operator. Keep the disclosure unless authorised otherwise. |
| **Photographs** | Find `<figure class="ph …">` blocks. Replace the whole figure with `<img src="assets/images/…" alt="Descriptive alt text" width="…" height="…" loading="lazy">` inside a `div` with the same `r-…` aspect class, and add a credit/caption. Use only officially released or properly licensed images. |
| **Projects** | Edit the `PROJECTS` array in `assets/js/projects.js`. Set `verified: true` **only** with a `source` URL. |
| **News / speeches / events / groups** | Duplicate an existing `data-item` block. `data-category` drives filters; `data-text` drives search. For articles copy `news-article.html`. |
| **Statistics** | In `achievements.html`, replace `[value]`, the source and the date together. Never publish a figure without a primary source. |
| **Manifesto** | Quote the official document verbatim in the *Published* column; keep supporter ideas in *Proposed*. Replace `assets/docs/manifesto-placeholder.txt` with the real PDF and update the link. |
| **Contact / social links** | Search for `[contact email]`, `[contact phone]`, `[office address]`; update footer social icons (they point to `contact.html#social` until accounts exist). |
| **Site URL / SEO** | Replace `https://www.example.org/` in each page's canonical/Open Graph tags and in `sitemap.xml` / `robots.txt`; add `assets/images/general/og-placeholder.png` (1200×630). |
| **Legal pages** | Drafts for legal review; they are not legal advice. |

## Frontend-only functionality and backend integration

Working in the browser: responsive navigation with dropdowns and keyboard support, search and filters (news, speeches, events, FAQ, groups, media, projects), load-more, accordion, lightbox, before/after slider, calendar view, back-to-top, scroll reveal, cookie notice (stores only the choice in `localStorage`), and form validation with accessible errors.

**Forms do not send or store anything.** Without a backend the volunteer, contact and newsletter forms validate in the browser and show an honest "validated, not submitted" message. To connect one, add a `data-endpoint` attribute to the form:

```html
<form data-form="volunteer" data-endpoint="https://api.example.org/volunteers" …>
```

`forms.js` then POSTs the fields as JSON and shows a received message on a 2xx response. Before doing so: stand up a lawful endpoint, update the privacy policy (Nigeria Data Protection Act 2023), add spam protection, and decide retention. The **Local Government Area** field is free text (a full 774-LGA dataset can replace it later). Analytics are not included; add them only behind the cookie choice (`cookie-choice` event in `main.js`).

## Quality checks performed

Internal links and anchors resolve; no JavaScript errors across all pages; no horizontal overflow at 1440, 1024, 768, 375 and 320 px; 23 scripted interaction checks pass (menus, accordion, filters, dialogs, lightbox, forms). Still to do by a human before launch: real-device and screen-reader testing, colour-contrast audit with final imagery, and legal/editorial sign-off.
