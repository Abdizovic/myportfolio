/**
 * CV-specific copy.
 *
 * Contact details, socials, the stack and project details all live in
 * site.ts / stack.ts / projects.ts already — this file holds only what's
 * unique to the CV, so the PDF can never drift out of sync with the rest of
 * the site. Run `npm run cv` after editing to regenerate public/abdikarim-cv.pdf.
 *
 * Deliberately dependency-free, like manuals.ts: the generator imports it with
 * Node's TypeScript stripping, which resolves like plain ESM and cannot follow
 * an extensionless relative import. The generator holds `site` as well and
 * composes the two — anything below that echoes site.ts is noted as such.
 */

/** Not published elsewhere as a plain dialable string (site.ts only has the wa.me link). */
export const cvPhone = "+254 794 935 317";

/** Opening line. The "3+ years" here mirrors `site.experience.label`. */
export const cvProfile = `Frontend-leaning full-stack developer with 3+ years building and shipping production Next.js and TypeScript applications, and hands-on experience wiring M-Pesa Daraja (STK Push, C2B paybill, B2C payouts) into real business workflows: school fee collection, e-commerce checkout, vehicle marketplaces and savings-group contributions and payouts. Builds fast, typed, server-first React on Supabase/Postgres with authorisation enforced at the database layer, integrates AI assistants over the Anthropic Claude API, and works from a UI/UX foundation — wireframing and designing in Figma before writing a line of code. Currently reading Computer Science at Umma University while shipping production software for Kenyan SMEs as a freelancer.`;

/**
 * The four-box strip under the header. Only the entries that carry no site.ts
 * data live here — the generator prepends Experience, Based in and
 * Availability from `site`, then fills the remaining slots from this list.
 */
export const cvQuickFacts: { label: string; value: string }[] = [
  { label: "Focus", value: "Next.js · TypeScript · Supabase · M-Pesa" },
];

/**
 * Skimmable competency chips. Recruiters read this block before anything
 * else, so it carries the keywords a CV filter looks for.
 */
export const cvCompetencies: string[] = [
  "Next.js App Router & Server Components",
  "TypeScript (strict, end-to-end typed)",
  "M-Pesa Daraja — STK Push, C2B, B2C",
  "Supabase / PostgreSQL & migrations",
  "Row-Level Security & multi-tenancy",
  "UI/UX design foundations — Figma to code",
  "AI integration (Anthropic Claude API)",
  "Idempotent webhooks & reconciliation",
  "Monorepos & multi-surface deploys",
  "Technical SEO & Core Web Vitals",
  "Accessible interfaces (WCAG AA)",
];

/** Outcome statements, kept above the experience block for immediate signal. */
export const cvHighlights: string[] = [
  "Shipped six production applications across education, e-commerce, fintech, retail and scheduling — each one live, documented and handed over with a written user guide.",
  "Designed an append-only payments ledger that made every balance traceable to the M-Pesa transaction behind it, and made every Daraja callback idempotent — removing double-credits, double-disbursements and manual end-of-day reconciliation.",
  "Built a Claude-powered sales assistant for a car marketplace that answers stock questions from live inventory rather than from a scripted FAQ.",
];

export type CvExperience = {
  title: string;
  org: string;
  dates: string;
  bullets: string[];
};

export const cvExperience: CvExperience[] = [
  {
    title: "Freelance Full-Stack Developer",
    org: "Direct clients — Kenyan SMEs and international",
    /** Start year mirrors `site.experience.since`. */
    dates: "2023 - Present",
    bullets: [
      "Design and ship production Next.js, TypeScript and Supabase applications end to end (schema, auth, row-level security, frontend) for Kenyan SMEs across education, e-commerce, fintech, retail and scheduling.",
      "Integrate M-Pesa Daraja payments (STK Push, C2B paybill, B2C payouts) with idempotent webhook handling, eliminating the double-credit and reconciliation failures common to naive integrations.",
      "Architect monorepos that deploy a public storefront and an authenticated admin console as separate applications over one database, so customers never load admin code and either surface can be released independently.",
      "Integrate AI assistants over the Anthropic Claude API, grounding responses in live catalogue and order data so answers reflect real stock rather than a static script.",
      "Take projects from Figma wireframe through to pixel-faithful implementation, working directly with clients from scope to launch and handing over written user documentation.",
    ],
  },
];

export const cvEducation = {
  degree: "BSc Computer Science",
  school: "Umma University",
  location: "Kajiado, Kenya",
  status: "In progress",
};

/**
 * Footer strip. `verify` points a reader at something they can actually
 * click — every claim above it is demonstrable from the live deployments.
 */
export const cvFooter = {
  languages: "English (professional), Kiswahili (native)",
  /** Only printed when a real production URL is configured — see generate-cv.mjs. */
  portfolio: "Case studies, demo sign-ins and user guides for every project above:",
  references: "References and client introductions available on request.",
};

/** Slugs of projects.ts entries to feature on the CV, in display order. */
export const cvProjectSlugs = [
  "autohub-marketplace",
  "mwangaza-academy",
  "horology",
  "chama-management-platform",
] as const;

/** How many `features` bullets to pull per project - keeps the CV tight. */
export const cvProjectBulletCount = 2;

/** How many `tags` to show per project on the CV. */
export const cvProjectTagCount = 4;
