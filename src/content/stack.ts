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
    title: "Mobile & design",
    blurb: "Shipping the same product beyond the browser.",
    items: [
      { name: "React Native", note: "Cross-platform mobile", icon: "react" },
      { name: "Expo", note: "Managed builds and OTA updates", icon: "expo" },
      { name: "Figma", note: "UI/UX design, then straight to code", icon: "figma" },
    ],
  },
];
