/**
 * CV-specific copy.
 *
 * Contact details, socials, the stack and project details all live in
 * site.ts / stack.ts / projects.ts already — this file holds only what's
 * unique to the CV, so the PDF can never drift out of sync with the rest of
 * the site. Run `npm run cv` after editing to regenerate public/abdikarim-cv.pdf.
 */

/** Not published elsewhere as a plain dialable string (site.ts only has the wa.me link). */
export const cvPhone = "+254 794 935 317";

export const cvProfile =
  "Frontend-leaning full-stack developer specialising in Next.js and TypeScript, with hands-on production experience wiring M-Pesa Daraja (STK Push, C2B paybill, B2C payouts) into real business workflows: school fee collection, e-commerce checkout, and savings-group contributions and payouts. Builds fast, typed, server-first React on Supabase/Postgres with authorisation enforced at the database layer, and designs in Figma before writing a line of code. Currently reading Computer Science at Umma University while shipping production software for Kenyan SMEs as a freelancer.";

export type CvExperience = {
  title: string;
  org: string;
  dates: string;
  bullets: string[];
};

export const cvExperience: CvExperience[] = [
  {
    title: "Freelance Frontend Developer",
    org: "Upwork & direct clients",
    dates: "2024 - Present",
    bullets: [
      "Design and ship production Next.js, TypeScript and Supabase applications end to end (schema, auth, row-level security, frontend) for Kenyan SMEs across education, e-commerce, fintech and retail.",
      "Integrate M-Pesa Daraja payments (STK Push, C2B paybill, B2C payouts) with idempotent webhook handling, eliminating the double-credit and reconciliation failures common to naive integrations.",
      "Take projects from Figma design through to pixel-faithful implementation, working directly with clients from scope to launch.",
    ],
  },
];

export const cvEducation = {
  degree: "BSc Computer Science",
  school: "Umma University",
  location: "Kajiado, Kenya",
  status: "In progress",
};

/** Slugs of projects.ts entries to feature on the CV, in display order. */
export const cvProjectSlugs = [
  "mwangaza-academy",
  "horology",
  "chama-management-platform",
] as const;

/** How many `features` bullets to pull per project - keeps the CV to one page. */
export const cvProjectBulletCount = 2;

/** How many `tags` to show per project on the CV. */
export const cvProjectTagCount = 5;
