import type { TechIconKey } from "@/components/tech-icon";

export type Tech = {
  name: string;
  /** One short line — what it's actually for, not what it is. */
  note: string;
  icon: TechIconKey;
};

export type StackGroup = {
  title: string;
  blurb: string;
  items: Tech[];
};

export const stack: StackGroup[] = [
  {
    title: "Frontend",
    blurb: "Where most of my time goes — typed, server-first React.",
    items: [
      {
        name: "Next.js",
        note: "App Router, server components, route handlers",
        icon: "nextjs",
      },
      { name: "React", note: "Component architecture and state", icon: "react" },
      {
        name: "TypeScript",
        note: "Strict mode, end-to-end typed data",
        icon: "typescript",
      },
      {
        name: "Tailwind CSS",
        note: "Design systems without the CSS sprawl",
        icon: "tailwind",
      },
      {
        name: "React Query",
        note: "Server state, caching, optimistic updates",
        icon: "reactquery",
      },
    ],
  },
  {
    title: "Backend & data",
    blurb: "Postgres-backed, with authorisation enforced in the database.",
    items: [
      {
        name: "Supabase",
        note: "Postgres, Auth, Storage, Realtime",
        icon: "supabase",
      },
      {
        name: "PostgreSQL",
        note: "Schema design, migrations, SQL",
        icon: "postgres",
      },
      {
        name: "Row-Level Security",
        note: "Multi-tenant isolation at the row level",
        icon: "shield",
      },
    ],
  },
  {
    title: "Payments & integrations",
    blurb: "The differentiator — money that actually moves, in Kenya.",
    items: [
      {
        name: "M-Pesa Daraja",
        note: "STK Push, C2B paybill, B2C payouts",
        icon: "mpesa",
      },
      {
        name: "Africa's Talking",
        note: "Transactional and bulk SMS",
        icon: "africastalking",
      },
      {
        name: "Webhooks",
        note: "Idempotent callback handling, reconciliation",
        icon: "webhook",
      },
    ],
  },
  {
    title: "Design & UI/UX",
    blurb: "Drawn before it's built — I design the thing I then ship.",
    items: [
      { name: "Figma", note: "Wireframes to high-fidelity screens", icon: "figma" },
      {
        name: "Design systems",
        note: "Type scale, spacing, colour, components",
        icon: "pen",
      },
      {
        name: "Accessibility",
        note: "WCAG AA, keyboard and screen-reader paths",
        icon: "shield",
      },
    ],
  },
  {
    title: "AI & mobile",
    blurb: "Where the work is heading next.",
    items: [
      {
        name: "Claude API",
        note: "Assistants grounded in live product data",
        icon: "claude",
      },
      { name: "React Native", note: "Cross-platform mobile", icon: "react" },
      { name: "Expo", note: "Managed builds and OTA updates", icon: "expo" },
    ],
  },
];
