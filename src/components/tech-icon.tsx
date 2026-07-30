import type { ReactNode } from "react";

/**
 * Technology marks, rendered monochrome in a uniform tile.
 *
 * Deliberate choice: no brand colours. A stack section in twelve different
 * brand palettes reads as a sticker sheet; one accent against neutral reads as
 * a system. It also sidesteps rendering an approximated logo in a colour the
 * brand doesn't actually use.
 *
 * Where a mark can't be drawn faithfully at 24px (or has no recognisable mark
 * at all — M-Pesa, Africa's Talking), a semantic glyph or monogram stands in.
 */

export type TechIconKey =
  | "nextjs"
  | "react"
  | "typescript"
  | "tailwind"
  | "reactquery"
  | "supabase"
  | "postgres"
  | "shield"
  | "mpesa"
  | "africastalking"
  | "webhook"
  | "expo"
  | "figma";

const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Monogram({ label }: { label: string }) {
  return (
    <text
      x="12"
      y="12"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={label.length > 2 ? 7 : 9}
      fontWeight="600"
      letterSpacing="-0.5"
      fill="currentColor"
      fontFamily="var(--font-mono), ui-monospace, monospace"
    >
      {label}
    </text>
  );
}

const marks: Record<TechIconKey, ReactNode> = {
  nextjs: (
    <>
      <circle {...s} cx="12" cy="12" r="9" />
      <path {...s} d="M9 16V8l7 8.5M15.2 8v5" />
    </>
  ),
  react: (
    <>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <ellipse {...s} cx="12" cy="12" rx="9.5" ry="3.7" />
      <ellipse {...s} cx="12" cy="12" rx="9.5" ry="3.7" transform="rotate(60 12 12)" />
      <ellipse {...s} cx="12" cy="12" rx="9.5" ry="3.7" transform="rotate(120 12 12)" />
    </>
  ),
  typescript: (
    <>
      <rect {...s} x="3" y="3" width="18" height="18" rx="3" />
      <Monogram label="TS" />
    </>
  ),
  tailwind: (
    <path
      fill="currentColor"
      d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.11 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C16.61 7.15 15.48 6 12 6ZM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35.98 1 2.11 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C11.61 13.15 10.48 12 7 12Z"
    />
  ),
  reactquery: (
    <>
      <circle {...s} cx="12" cy="12" r="9" />
      <Monogram label="RQ" />
    </>
  ),
  supabase: (
    <path
      {...s}
      d="M13.4 2.5 4.6 13.1c-.4.5 0 1.2.6 1.2h5.6l-.4 7.2 8.8-10.6c.4-.5 0-1.2-.6-1.2h-5.6l.4-7.2Z"
    />
  ),
  postgres: (
    <>
      <ellipse {...s} cx="12" cy="6" rx="7.5" ry="3" />
      <path {...s} d="M4.5 6v12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
      <path {...s} d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" />
    </>
  ),
  shield: (
    <>
      <path {...s} d="M12 2.8 4.5 6v6c0 4.5 3.2 7.9 7.5 9.2 4.3-1.3 7.5-4.7 7.5-9.2V6L12 2.8Z" />
      <path {...s} d="m8.8 11.8 2.3 2.3 4.1-4.6" />
    </>
  ),
  // Phone + outbound value: the semantics of a mobile-money push.
  mpesa: (
    <>
      <rect {...s} x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path {...s} d="M10.5 18.5h3" />
      <path {...s} d="M12 6.3v6.4m0 0 2.4-2.4M12 12.7 9.6 10.3" />
    </>
  ),
  africastalking: (
    <>
      <path {...s} d="M4 5.5h16v10.5H9.5L5 20v-4H4V5.5Z" />
      <path {...s} d="M8.5 9.5h7M8.5 12.5h4" />
    </>
  ),
  webhook: (
    <>
      <path {...s} d="M9.4 8.6a3.2 3.2 0 1 1 4.6 3.5" />
      <path {...s} d="M14.6 15.4a3.2 3.2 0 1 1-2.3-5.4" />
      <path {...s} d="M6.5 12.6a3.2 3.2 0 1 0 3 4.9h5.6" />
      <path {...s} d="M12.4 6 9 12.2M14.7 12.3l3.1 5.4" />
    </>
  ),
  expo: (
    <>
      <circle {...s} cx="12" cy="12" r="9" />
      <Monogram label="EX" />
    </>
  ),
  figma: (
    <>
      <path {...s} d="M12 3H9a3 3 0 0 0 0 6h3V3Zm0 0h3a3 3 0 0 1 0 6h-3V3Z" />
      <path {...s} d="M12 9H9a3 3 0 0 0 0 6h3V9Z" />
      <path {...s} d="M12 15H9a3 3 0 1 0 3 3v-3Z" />
      <circle {...s} cx="15" cy="12" r="3" />
    </>
  ),
};

export function TechIcon({
  name,
  className,
}: {
  name: TechIconKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {marks[name]}
    </svg>
  );
}
