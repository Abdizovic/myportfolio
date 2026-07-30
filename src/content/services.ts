export type Service = {
  title: string;
  description: string;
  deliverables: string[];
  icon: "layout" | "figma" | "payments" | "stack";
};

export const services: Service[] = [
  {
    title: "Frontend development",
    description:
      "Next.js and React interfaces that stay fast on a mid-range Android over a patchy connection — because that is what your users are actually on.",
    deliverables: [
      "Next.js App Router build, TypeScript throughout",
      "Responsive, accessible, keyboard-navigable UI",
      "Performance budget honoured, not just promised",
    ],
    icon: "layout",
  },
  {
    title: "UI/UX design → code",
    description:
      "Design in Figma, then build it myself. No handoff gap, no 'that's not what the mockup said' — the person who drew it is the person who ships it.",
    deliverables: [
      "Figma wireframes and high-fidelity screens",
      "A real design system: type scale, spacing, colour, components",
      "Pixel-faithful implementation",
    ],
    icon: "figma",
  },
  {
    title: "M-Pesa payment integration",
    description:
      "Daraja done properly for Kenyan SMEs — STK Push, paybill collection, or B2C payouts, with the callback handling and reconciliation that most integrations skip.",
    deliverables: [
      "STK Push, C2B paybill or B2C, sandbox through to go-live",
      "Idempotent callbacks — no double-credits from retried webhooks",
      "Reconciliation and an audit trail you can defend to a customer",
    ],
    icon: "payments",
  },
  {
    title: "Full-stack app builds",
    description:
      "The whole thing: schema, auth, row-level security, API and interface. Supabase-backed, so you own your Postgres database and can walk away with it.",
    deliverables: [
      "Schema design and migrations",
      "Auth and role-based access enforced in the database",
      "Deployed on Vercel with analytics and monitoring wired up",
    ],
    icon: "stack",
  },
];

/**
 * Rough shape of how I work — sets expectations before the first call.
 * Named `workflow`, not `process`: importing `process` would shadow the Node
 * global in any module that also reads `process.env`.
 */
export const workflow = [
  {
    step: "01",
    title: "Scope",
    detail:
      "A short call, then a written scope: what it does, what it doesn't, and what it costs. No surprises later.",
  },
  {
    step: "02",
    title: "Design",
    detail:
      "Figma screens you can click through, so we resolve disagreements on a canvas rather than in code.",
  },
  {
    step: "03",
    title: "Build",
    detail:
      "Shipped in slices to a live preview URL. You see progress weekly instead of waiting for a reveal.",
  },
  {
    step: "04",
    title: "Launch & hand over",
    detail:
      "Deployment, a walkthrough, and documentation. You keep the keys to everything.",
  },
] as const;
