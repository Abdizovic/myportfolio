import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  DownloadIcon,
  GithubIcon,
} from "@/components/icons";
import { LazyVideo } from "@/components/lazy-video";
import { Reveal } from "@/components/reveal";
import { Badge, ButtonLink, Card, Container, Eyebrow } from "@/components/ui";
import { getManual } from "@/content/manuals";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

/** Every case study is known at build time — prerender the lot. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.name} — case study`,
      description: project.tagline,
      url: `${site.url}/projects/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — case study`,
      description: project.tagline,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const manual = getManual(project.slug);

  /** One entry per deployed surface, falling back to the single live URL. */
  const deployments =
    project.deployments ??
    (project.liveUrl
      ? [{ label: "Visit live site", url: project.liveUrl, description: "" }]
      : []);

  return (
    <article className="pb-24">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_70%_at_30%_0%,black,transparent)]"
        />
        <Container className="relative py-14 sm:py-20">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          >
            <ArrowRightIcon className="size-4 rotate-180" />
            All projects
          </Link>

          <div className="mt-8 max-w-3xl">
            <Eyebrow>
              {project.status} · {project.domain} · {project.year}
            </Eyebrow>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-[3.25rem]">
              {project.name}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              {project.summary}
            </p>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            {deployments.map((deployment, deploymentIndex) => (
              <ButtonLink
                key={deployment.url}
                href={deployment.url}
                external
                variant={deploymentIndex === 0 ? "primary" : "secondary"}
              >
                {deployment.label}
                <ArrowUpRightIcon className="size-4" />
              </ButtonLink>
            ))}
            {manual ? (
              <ButtonLink
                href={manual.file}
                external
                variant="secondary"
                download
                aria-label={`Download the ${project.name} user guide as a PDF`}
              >
                <DownloadIcon className="size-4" />
                User guide (PDF)
              </ButtonLink>
            ) : null}
            {project.repoUrl ? (
              <ButtonLink href={project.repoUrl} external variant="secondary">
                <GithubIcon className="size-4" />
                View source
              </ButtonLink>
            ) : null}
            <ButtonLink href="/#contact" variant="ghost">
              Build something similar
            </ButtonLink>
          </div>

          <ul className="mt-9 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>
        </Container>
      </header>

      <Container className="py-14 sm:py-16">
        {/* ── Spec strip ───────────────────────────────────────────────── */}
        <Reveal>
          <dl className="grid gap-6 rounded-xl border border-border bg-surface p-6 sm:grid-cols-2 lg:grid-cols-4">
            {project.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-sm font-medium leading-snug">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-16">
          <div className="min-w-0">
            {/* ── Walkthrough video ──────────────────────────────────── */}
            {project.demoVideoUrl ? (
              <Reveal>
                <section aria-labelledby="walkthrough" className="mb-14">
                  <h2 id="walkthrough" className="text-xl font-semibold sm:text-2xl">
                    Walkthrough
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    A short screen recording of the real product.
                  </p>
                  <div className="mt-5">
                    <LazyVideo
                      url={project.demoVideoUrl}
                      title={`${project.name} walkthrough`}
                    />
                  </div>
                </section>
              </Reveal>
            ) : null}

            {/* ── Case study body ────────────────────────────────────── */}
            <div className="space-y-12">
              {project.caseStudy.map((section, sectionIndex) => (
                <Reveal key={section.title} delay={sectionIndex * 40}>
                  <section aria-labelledby={`cs-${sectionIndex}`}>
                    <h2
                      id={`cs-${sectionIndex}`}
                      className="text-xl font-semibold sm:text-2xl"
                    >
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-4">
                      {section.body.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 40)}
                          className="text-base leading-relaxed text-muted"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {section.list ? (
                      <ul className="mt-6 space-y-3 border-l-2 border-accent/30 pl-5">
                        {section.list.map((item) => (
                          <li
                            key={item}
                            className="text-sm leading-relaxed text-muted"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ── Sticky feature rail ──────────────────────────────────── */}
          <Reveal delay={80}>
            <aside className="lg:sticky lg:top-24">
              {/* Everything needed to go and use the thing, in one block: the
                  addresses, what each one is, and the guide holding the demo
                  sign-in. */}
              {deployments.length > 0 || manual ? (
                <Card className="mb-4 p-6">
                  <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                    Try it yourself
                  </h2>

                  {deployments.length > 0 ? (
                    <ul className="mt-5 space-y-4">
                      {deployments.map((deployment) => (
                        <li key={deployment.url}>
                          <a
                            href={deployment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-accent"
                          >
                            {deployment.label}
                            <ArrowUpRightIcon className="size-3.5 shrink-0 text-muted transition-colors group-hover/link:text-accent" />
                          </a>
                          <p className="mt-1 break-all font-mono text-[11px] text-muted">
                            {deployment.url.replace(/^https?:\/\//, "")}
                          </p>
                          {deployment.description ? (
                            <p className="mt-1.5 text-xs leading-relaxed text-muted">
                              {deployment.description}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {manual ? (
                    <div
                      className={
                        deployments.length > 0
                          ? "mt-5 border-t border-border pt-5"
                          : "mt-5"
                      }
                    >
                      <p className="text-sm leading-relaxed text-muted">
                        The user guide walks through every screen and carries the
                        demo sign-in details, so you can go straight into the admin
                        side without emailing me first.
                      </p>
                      <ButtonLink
                        href={manual.file}
                        external
                        download
                        size="sm"
                        variant="secondary"
                        className="mt-4 w-full"
                      >
                        <DownloadIcon className="size-4" />
                        Download user guide
                      </ButtonLink>
                    </div>
                  ) : null}
                </Card>
              ) : null}

              <Card className="p-6">
                <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                  Key features
                </h2>
                <ul className="mt-5 space-y-3.5">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                      <span className="text-sm leading-relaxed text-muted">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="mt-4 p-6">
                <h2 className="text-sm font-semibold">Need something like this?</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  I take on M-Pesa integrations and full product builds for Kenyan and
                  international clients.
                </p>
                <ButtonLink
                  href="/#contact"
                  size="sm"
                  className="mt-5 w-full"
                >
                  Get in touch
                  <ArrowRightIcon className="size-4" />
                </ButtonLink>
              </Card>
            </aside>
          </Reveal>
        </div>

        {/* ── Next project ─────────────────────────────────────────────── */}
        {next.slug !== project.slug ? (
          <Reveal>
            <nav
              aria-label="Next project"
              className="mt-20 border-t border-border pt-10"
            >
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                Next case study
              </p>
              <Link
                href={`/projects/${next.slug}`}
                className="group mt-4 flex flex-wrap items-end justify-between gap-4"
              >
                <span>
                  <span className="block text-2xl font-semibold transition-colors group-hover:text-accent sm:text-3xl">
                    {next.name}
                  </span>
                  <span className="mt-2 block max-w-xl text-sm leading-relaxed text-muted">
                    {next.tagline}
                  </span>
                </span>
                <ArrowRightIcon className="size-6 shrink-0 text-muted transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            </nav>
          </Reveal>
        ) : null}
      </Container>
    </article>
  );
}
