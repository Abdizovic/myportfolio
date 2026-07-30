import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Shared layout + typographic primitives. Everything here is a server component. */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
  ...rest
}: ComponentProps<"section">) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 border-t border-border py-20 sm:py-28 ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}

/** Small monospace label that sits above every section title. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-accent">
      <span aria-hidden="true" className="h-px w-6 bg-accent" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  id,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  /** Ties the section's aria-labelledby to its own <h2>. */
  id?: string;
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="mt-4 text-3xl font-semibold sm:text-4xl md:text-[2.75rem] md:leading-[1.1]"
      >
        {title}
      </h2>
      {lede ? (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{lede}</p>
      ) : null}
    </div>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-55";

const buttonVariants = {
  primary:
    "bg-accent text-accent-contrast hover:bg-accent-hover hover:-translate-y-px active:translate-y-0",
  secondary:
    "border border-border bg-surface text-foreground hover:border-accent/50 hover:bg-surface-2 hover:-translate-y-px active:translate-y-0",
  ghost: "text-muted hover:bg-surface-2 hover:text-foreground",
} as const;

const buttonSizes = {
  sm: "h-9 px-3.5",
  md: "h-11 px-5",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export function buttonClass({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: keyof typeof buttonSizes;
  className?: string;
} = {}) {
  return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  external,
  className = "",
  children,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  size?: keyof typeof buttonSizes;
  external?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href" | "children">) {
  const classes = buttonClass({ variant, size, className });

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-border bg-surface-2 px-2 py-1 font-mono text-[11px] tracking-tight text-muted ${className}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface transition-colors duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

/** Live availability pip. Green + label, never colour alone. */
export function AvailabilityBadge({
  label,
  open,
  className = "",
}: {
  label: string;
  open: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium ${className}`}
    >
      <span className="relative flex size-2">
        {open ? (
          <span className="animate-pulse-dot absolute inline-flex size-2 rounded-full bg-accent" />
        ) : null}
        <span
          className={`relative inline-flex size-2 rounded-full ${open ? "bg-accent" : "bg-muted"}`}
        />
      </span>
      {label}
    </span>
  );
}
