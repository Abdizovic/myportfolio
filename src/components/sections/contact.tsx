import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { SocialLinks } from "@/components/social-links";
import {
  AvailabilityBadge,
  Card,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import { site } from "@/content/site";

export function Contact() {
  return (
    <Section id="contact" aria-labelledby="contact-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
          <Reveal>
            <div>
              <SectionHeading
                id="contact-heading"
                eyebrow="Contact"
                title="Let's build something."
                lede="Whether it's a full product, an M-Pesa integration on an app you already have, or a second pair of hands on a deadline — tell me what you need."
              />

              <div className="mt-8">
                <AvailabilityBadge
                  open={site.availability.open}
                  label={site.availability.label}
                />
                <p className="mt-3 text-sm text-muted">{site.availability.detail}</p>
              </div>

              <dl className="mt-10 space-y-5 border-t border-border pt-8">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">Email</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${site.email}`}
                      className="text-sm font-medium underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">
                    Based in
                  </dt>
                  <dd className="mt-1 text-sm font-medium">
                    {site.location} — working remotely, EAT (UTC+3)
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">
                    Elsewhere
                  </dt>
                  <dd className="mt-3">
                    <SocialLinks size="sm" />
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <Card className="p-6 sm:p-8">
              <ContactForm />
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
