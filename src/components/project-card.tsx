import Link from "next/link";

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  DownloadIcon,
  GithubIcon,
  PlayIcon,
} from "@/components/icons";
import { Badge } from "@/components/ui";
import { getManual } from "@/content/manuals";
import type { Project } from "@/content/projects";

/** Strip the protocol so live URLs read as a domain, not a URL bar. */
function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const manual = getManual(project.slug);

  /**
   * A monorepo exposes more than one address. Label those by what they are —
   * two bare domains side by side tell a reader nothing about which to open.
   */
  const deploymentLinks = project.deployments
    ? project.deployments.map((deployment) => ({
        href: deployment.url,
        label: deployment.label,
        icon: ArrowUpRightIcon,
        accent: true,
      }))
    : project.liveUrl
      ? [
          {
            href: project.liveUrl,
            label: displayUrl(project.liveUrl),
            icon: ArrowUpRightIcon,
            accent: true,
          },
        ]
      : [];

  const links = [
    ...deploymentLinks,
    manual && {
      href: manual.file,
      label: "User guide (PDF)",
      icon: DownloadIcon,
      accent: false,
    },
    project.demoVideoUrl && {
      href: project.demoVideoUrl,
      label: "Watch demo",
      icon: PlayIcon,
      accent: false,
    },
    project.repoUrl && {
      href: project.repoUrl,
      label: "Source",
      icon: GithubIcon,
      accent: false,
    },
  ].filter(Boolean) as {
    href: string;
    label: string;
    icon: typeof ArrowUpRightIcon;
    accent: boolean;
  }[];

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-accent/40">
      <div className="grid lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
        {/* Identity panel. A monogram rather than a stock screenshot — an honest
            placeholder beats a misleading mockup. */}
        <div className="dot-grid relative flex items-center justify-between gap-4 border-b border-border bg-surface-2 p-6 lg:flex-col lg:items-start lg:border-b-0 lg:border-r">
          <div className="relative">
            <span className="font-mono text-xs text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              aria-hidden="true"
              className="mt-3 block font-mono text-5xl font-bold leading-none tracking-tighter text-accent/85 sm:text-6xl"
            >
              {project.name.slice(0, 2).toUpperCase()}
            </span>
          </div>

          <dl className="relative space-y-3 text-right lg:mt-auto lg:pt-8 lg:text-left">
            <div>
              <dt className="sr-only">Status</dt>
              <dd className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {project.status}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Domain</dt>
              <dd className="text-xs text-muted">{project.domain}</dd>
            </div>
            <div>
              <dt className="sr-only">Year</dt>
              <dd className="font-mono text-xs text-muted">{project.year}</dd>
            </div>
          </dl>
        </div>

        <div className="p-6 sm:p-8">
          <h3 className="text-xl font-semibold sm:text-2xl">
            <Link
              href={`/projects/${project.slug}`}
              className="transition-colors hover:text-accent"
            >
              {project.name}
            </Link>
          </h3>

          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {project.tagline}
          </p>

          {links.length > 0 ? (
            <ul className="relative mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      link.accent
                        ? "text-accent hover:text-accent-hover"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    <link.icon className="size-4 shrink-0" />
                    <span className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          <ul className="mt-6 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>

          <h4 className="mt-7 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Key features
          </h4>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                <span className="text-sm leading-relaxed text-muted">{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href={`/projects/${project.slug}`}
            className="relative mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            Read the case study
            <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
