# Terminjäger — Placeholder swap guide

Drop real files into `assets/` using the **exact filenames** below and they appear automatically.
Each image placeholder shows a fallback (gradient + label) until the real file exists, then the
`<img>` covers it. No HTML edits needed for the image ones.

## Images — just drop the file (exact name)

| File | Where it shows | Notes |
|------|----------------|-------|
| `logo2.png` | Navbar logo | ✅ already provided |
| `leon.jpg` | "Über Leon Ioakeim" portrait | portrait, ~square (1:1.08) |
| `team-leon.jpg` | Team card – Leon Ioakeim | portrait (1:1.12) |
| `team-eren.jpg` | Team card – Eren Akkus | portrait |
| `team-jakob.jpg` | Team card – Jakob Niethammer | portrait |
| `team-kevin.jpg` | Team card – Kevin Grunert | portrait |
| `faq.jpg` | FAQ section photo | portrait (4:5) |

## Videos — replace the placeholder block in `index.html`

For each, swap the inner placeholder for a `<video>` or `<iframe>` (already styled to fill the frame
via `object-fit: cover`).

- **Hero video** — `<div class="tj-hero__video">…</div>`
- **Case studies** (3×) — each `<div class="tj-case__video">…</div>`
- **Video-Kundenstimmen** (9×) — each `<div class="tj-vcard__video">…</div>`

Example:
```html
<div class="tj-vcard__video">
  <video src="assets/testimonial-1.mp4" controls poster="assets/testimonial-1.jpg"></video>
</div>
```

## Client logos (marquee "Diese Marktführer setzen auf uns")

Currently text names in `#tjMarquee`. Replace each
`<span class="tj-marquee__item">Name</span>` with
`<img class="tj-marquee__item" src="assets/client-x.png" alt="Name">`.

## Partner logos (Wachstumspartner grid)

Drop files here for the partner logos in order:

- `partner-nuhi.png`
- `partner-sichtbar.png`
- `partner-anufaktur.png`
- `partner-bp-blackout.png`
- `partner-flowagentur.png`
- `partner-bl-digital.png`
- `partner-optinize.png`
- `partner-marketing-affen.png`
- `partner-die-revolte.png`

## Text still using sample data

- Case studies #1 and #2 (Max Mustermann / Platzhalter) — names, quotes, numbers are sample.
  (Case study #3, Martin Niewerth / WebAn, uses real content.)
