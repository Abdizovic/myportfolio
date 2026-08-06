import { Avatar } from "@/components/avatar";
import { ArrowRightIcon, DownloadIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SocialLinks } from "@/components/social-links";
import { AvailabilityBadge, ButtonLink, Container } from "@/components/ui";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      {/* Decorative ground: dot grid faded out toward the bottom of the section. */}
      <div
        aria-hidden="true"
        className="dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />

      <Container className="relative py-20 sm:py-28 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
          <div>
            <Reveal>
              <AvailabilityBadge
                open={site.availability.open}
                label={site.availability.label}
              />
            </Reveal>

            <Reveal delay={60}>
              <h1
                id="hero-heading"
                className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4.25rem]"
              >
                {site.name}
                <span className="text-accent">.</span>
              </h1>
            </Reveal>

            <Reveal delay={110}>
              <p className="mt-5 text-lg font-medium sm:text-xl">
                {site.role}
                <span aria-hidden="true" className="mx-2.5 text-border">
                  /
                </span>
                <span className="text-muted">{site.subrole}</span>
              </p>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {site.tagline} {site.experience.label} working with Kenyan SMEs and
                international clients on Next.js products backed by Supabase —
                including the M-Pesa integrations most developers would rather not
                touch.
              </p>
            </Reveal>

            <Reveal delay={210}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <ButtonLink href="/#projects">
                  View projects
                  <ArrowRightIcon className="size-4" />
                </ButtonLink>
                <ButtonLink href="/#contact" variant="secondary">
                  Contact me
                </ButtonLink>
                {/*
                  `external` renders a plain <a>. The CV is a static file in
                  /public, not a route — routing it through next/link would send
                  the client router after a page that doesn't exist.
                */}
                <ButtonLink href={site.cv} variant="ghost" external download>
                  <DownloadIcon className="size-4" />
                  Download CV
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-10 flex items-center gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                  Find me
                </span>
                <span aria-hidden="true" className="h-px flex-1 max-w-8 bg-border" />
                <SocialLinks size="sm" />
              </div>
            </Reveal>
          </div>

          <Reveal delay={140} className="order-first lg:order-none">
            <div className="relative mx-auto w-48 sm:w-56 lg:w-72">
              {/* Soft accent halo behind the frame. */}
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-full bg-accent/10 blur-2xl"
              />
              <div className="relative aspect-square overflow-hidden rounded-full border border-border bg-surface ring-1 ring-accent/20 ring-offset-4 ring-offset-background">
                <Avatar
                  src={site.avatar}
                  alt={`${site.fullName}, ${site.role}`}
                  size={288}
                  priority
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
