import Link from "next/link";

import { SocialLinks } from "@/components/social-links";
import { Container } from "@/components/ui";
import { nav, site } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/40">
      <Container className="py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold">
              <span
                aria-hidden="true"
                className="grid size-8 place-items-center rounded-lg bg-accent font-mono text-[13px] font-bold text-accent-contrast"
              >
                A
              </span>
              {site.name}
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">{site.tagline}</p>
            <p className="mt-3 font-mono text-xs text-muted">{site.location}</p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <nav aria-label="Footer">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Navigate
              </h2>
              <ul className="mt-4 space-y-2.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted transition-colors hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Elsewhere
              </h2>
              <SocialLinks className="mt-4" size="sm" />
              <a
                href={`mailto:${site.email}`}
                className="mt-4 inline-block text-sm text-muted underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {site.email}
              </a>
              <a
                href={`tel:${site.phone}`}
                className="mt-2 block text-sm text-muted underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {site.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.fullName}. All rights reserved.
          </p>
          <p>
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground transition-colors hover:text-accent"
            >
              Next.js
            </a>{" "}
            &amp;{" "}
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground transition-colors hover:text-accent"
            >
              Tailwind CSS
            </a>
            .
          </p>
        </div>
      </Container>
    </footer>
  );
}
