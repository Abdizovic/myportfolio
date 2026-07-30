/**
 * Single source of truth for identity, links and SEO defaults.
 *
 * ── EDIT ME FIRST ────────────────────────────────────────────────────────────
 * Anything tagged `TODO:` below is a best guess and should be confirmed before
 * you deploy. Links set to `null` are simply not rendered anywhere in the UI,
 * so it is always safe to null out something you don't have yet rather than
 * ship a dead link.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Abdikarim",
  /** Used in <title>, structured data and the CV filename. */
  fullName: "Abdikarim",
  role: "Frontend Developer & Freelancer",
  subrole: "CS Student @ Umma University",
  tagline: "Building fast, M-Pesa-ready web apps for African businesses.",
  location: "Kajiado, Kenya",
  email: "abdkarimochieng@gmail.com",

  /**
   * Canonical production URL. Vercel injects VERCEL_PROJECT_PRODUCTION_URL on
   * every deployment, so this only needs editing once you attach a custom
   * domain. Used for canonical tags, OG images, sitemap and robots.txt.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  /** Drives the "Open to freelance work" badge in the hero and contact section. */
  availability: {
    open: true,
    label: "Open to freelance work",
    detail: "Available for new projects from August 2026",
  },

  /** Public path to the CV. Replace the file in /public with your real PDF. */
  cv: "/abdikarim-cv.pdf",
  avatar: "/abdikarim.png",
} as const;

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
  icon: "github" | "linkedin" | "mail" | "whatsapp";
};

/**
 * GitHub username, also used by the activity widget. The env var is only an
 * override — the default is the real handle, so nothing needs configuring on
 * Vercel for the GitHub link and widget to work.
 */
export const githubUsername =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Abdizovic";

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    href: `https://github.com/${githubUsername}`,
    handle: `@${githubUsername}`,
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abdkarim-ochieng-6946983a1",
    handle: "/in/abdkarim-ochieng",
    icon: "linkedin",
  },
  {
    label: "Email",
    href: `mailto:${site.email}`,
    handle: site.email,
    icon: "mail",
  },
  {
    // Set to null-out by removing this entry if you'd rather not publish a number.
    label: "WhatsApp",
    href: "https://wa.me/254794935317",
    handle: "Chat on WhatsApp",
    icon: "whatsapp",
  },
];

export const nav = [
  { label: "About", href: "/#about" },
  { label: "Stack", href: "/#stack" },
  { label: "Projects", href: "/#projects" },
  { label: "Services", href: "/#services" },
  { label: "Notes", href: "/blog" },
  { label: "Contact", href: "/#contact" },
] as const;
