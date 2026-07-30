# Abdikarim — Portfolio

Personal site and case-study portfolio. Next.js 16 (App Router) · TypeScript ·
Tailwind CSS v4 · statically rendered · deployed on Vercel.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
npm run manuals      # regenerate the per-project user-guide PDFs
```

---

## Before you deploy

Five things are placeholders. All of them live in **`src/content/site.ts`** and
are marked `TODO:`.

| # | What | Where |
| - | ---- | ----- |
| 1 | ~~LinkedIn, WhatsApp~~ done; Upwork removed (GitHub is done) | `src/content/site.ts` → `socials` |
| 2 | Profile photo | drop `abdikarim.jpg` into `public/` |
| 3 | CV | replace `public/abdikarim-cv.pdf` |
| 4 | Demo video links for every project | `src/content/projects.ts` |
| 5 | Contact email delivery | set `RESEND_API_KEY` (see `.env.example`) |
| 6 | Two live URLs are currently broken — see below | `src/content/projects.ts` |

The contact email currently defaults to `abdkarimochieng@gmail.com` — confirm
that's the address you want published.

**Links you don't have yet should stay `null`.** Every link in the UI is
conditionally rendered, so a `null` is simply omitted. A dead link costs more
credibility than a missing one.

### Broken project URLs

Checked at the time of writing:

- **Booking & Appointment Portal** — `booking-appointment-portal-56m9.vercel.app`
  returns **404** on every path, as does `booking-appointment-portal.vercel.app`.
  The project is listed with that URL as supplied, but the "Visit live site"
  button and the address printed in the PDF guide are both dead until the real
  production alias is filled in (`src/content/projects.ts` and
  `src/content/manuals.ts`).
- **Duka POS** — the URL supplied
  (`duka-pos-urit-hxj763x8h-griffin9.vercel.app`) is a per-deployment preview
  URL sitting behind Vercel SSO, so a visitor is bounced to a Vercel login. The
  production alias `duka-pos-urit.vercel.app` serves the same app publicly and
  is what's used here.

### User-guide PDFs

Each project ships a downloadable PDF guide, linked from its card and its case
study. Content lives in **`src/content/manuals.ts`**; `npm run manuals` renders
it to `public/manuals/*.pdf` via `scripts/generate-manuals.mjs`. The PDFs are
committed, so **edit the content file and rerun the script** — editing one
without the other leaves a stale download.

The guides publish demo admin credentials on purpose, so a visitor can walk into
the admin side of a project without emailing first. That means anyone on the
internet can sign in to those deployments: keep them as showcases holding
disposable data, never reuse the passwords elsewhere, and update
`src/content/manuals.ts` whenever they rotate. Mwangaza Academy deliberately
publishes none, since its data model is school and pupil records.

### Profile photo

There is no image file yet, so the hero renders a monogram tile instead. Drop a
square JPG at `public/abdikarim.jpg` (800×800 or larger) and it swaps in
automatically on the next build — `src/components/avatar.tsx` checks for the
file at build time, so there is never a broken image in between.

### GitHub widget

Wired to `Abdizovic` as the default in `src/content/site.ts`, so it needs no
configuration. `NEXT_PUBLIC_GITHUB_USERNAME` is an optional override if you ever
want to point it at a different account.

**The widget is currently unmounted from the homepage.** The profile has three
public repos and three contributions in the last year, and a widget saying so
costs more credibility than the empty space. `src/app/page.tsx` carries the
snippet to put it back — do that once the profile has real commit history. The
component itself is untouched and still degrades to a profile link if GitHub is
unreachable or rate-limited.

---

## Where things live

```text
src/
  app/
    layout.tsx              root layout, metadata, JSON-LD, analytics
    page.tsx                the one-page site — sections composed in order
    opengraph-image.tsx     social share card, generated at build
    sitemap.ts / robots.ts  SEO plumbing, derived from content files
    projects/[slug]/        case study pages (prerendered)
    blog/[slug]/            notes (prerendered)
    actions/contact.ts      contact form server action
  components/
    sections/               one file per homepage section
    ui.tsx                  Container, Section, Button, Card, Badge…
    icons.tsx               UI + social icons
    tech-icon.tsx           technology marks
  content/                  ← ALL copy and data lives here
    site.ts  projects.ts  manuals.ts  stack.ts  services.ts  posts.ts
    testimonials.ts
scripts/
  generate-manuals.mjs      renders manuals.ts → public/manuals/*.pdf
```

**Everything you'd want to edit is in `src/content/`.** Components read from it;
none of them hardcode copy. Adding a project or a note means adding an object to
an array — routes, sitemap entries, metadata and prerendering all follow.

---

## Design system

Defined once as CSS custom properties in `src/app/globals.css`, exposed to
Tailwind through `@theme inline`. Use the semantic tokens (`bg-surface`,
`text-muted`, `border-border`, `text-accent`) rather than raw palette colours —
they switch with the theme automatically, so almost nothing needs a `dark:`
variant.

- **Dark by default**, light as a first-class alternative. The theme is applied
  by an inline script in `<head>` before first paint, so there's no flash.
- **One accent** — a signal green — against neutral near-black. No gradients.
- Every foreground/background pair in both themes was checked against WCAG AA
  (lowest ratio in the system is 5.2:1, against a 4.5:1 requirement).

---

## Decisions worth knowing about

**Testimonials render nothing in production while the array is empty.** Filler
quotes are worse than no quotes. In `next dev` you'll see outlined placeholder
slots so you can see the layout; those never ship. Add a real quote to
`src/content/testimonials.ts` and the section appears.

**Case-study "results" are qualitative, not numeric.** No metrics were invented.
Adding real numbers — invoices reconciled, checkout completion rate, payout
volume — is the single highest-leverage edit you can make to those pages.

**No animation library.** Scroll reveals are a ~40-line IntersectionObserver
component (`src/components/reveal.tsx`). A `<noscript>` rule makes everything
visible if JavaScript fails.

**Videos are click-to-load.** Nothing is requested from YouTube/Loom/Vimeo until
a visitor presses play. Paste any YouTube, Loom or Vimeo URL into
`demoVideoUrl`; unrecognised hosts degrade to a plain link rather than a broken
player.

**No syntax highlighter in the notes.** Shipping a tokeniser to the browser for
three articles isn't a good trade. Worth revisiting if the section grows.

---

## Deploying

1. Push to GitHub, import the repo at [vercel.com/new](https://vercel.com/new).
2. Add the environment variables from `.env.example` in the Vercel dashboard.
3. Attach your domain, then set `NEXT_PUBLIC_SITE_URL` to it so canonical URLs,
   Open Graph tags and `sitemap.xml` point at the right host.

Vercel Analytics and Speed Insights are already wired up in `layout.tsx` — they
start reporting once enabled on the project in the dashboard.

### Known audit noise

`npm audit` reports advisories in `postcss` and `sharp`. Both are transitive
dependencies of Next.js itself, both are build-time only, and there's no patched
Next release yet — `npm audit fix --force` would "fix" it by downgrading to
Next 9. Leave it; re-check after the next Next.js release.
