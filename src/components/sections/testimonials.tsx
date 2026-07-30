import { QuoteIcon, StarIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Card, Container, Section, SectionHeading } from "@/components/ui";
import { testimonials } from "@/content/testimonials";

/**
 * Renders nothing in production while there are no real quotes. An empty or
 * filler-quoted social proof section actively costs credibility — the honest
 * move is to omit it until it's earned.
 *
 * In `next dev` you get outlined slots so the layout is visible while you work.
 */
export function Testimonials() {
  const isDev = process.env.NODE_ENV === "development";

  if (testimonials.length === 0 && !isDev) return null;

  return (
    <Section id="testimonials" aria-labelledby="testimonials-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="testimonials-heading"
            eyebrow="Social proof"
            title="What clients say."
            lede="Selected feedback from freelance engagements and Upwork contracts."
          />
        </Reveal>

        {testimonials.length > 0 ? (
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 60}>
                <Card className="flex h-full flex-col p-6 sm:p-7">
                  <QuoteIcon
                    className="size-7 text-accent/60"
                    aria-hidden="true"
                  />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-border pt-5">
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{testimonial.role}</p>
                    {testimonial.source ? (
                      <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-accent">
                        <StarIcon className="size-3.5" />
                        via {testimonial.source}
                      </p>
                    ) : null}
                  </figcaption>
                </Card>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((slot) => (
              <div
                key={slot}
                className="flex min-h-56 flex-col justify-between rounded-xl border border-dashed border-border p-6"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  Slot {slot + 1} — dev only
                </p>
                <div className="space-y-2" aria-hidden="true">
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-11/12 rounded" />
                  <div className="skeleton h-3 w-8/12 rounded" />
                </div>
                <p className="text-xs text-muted">
                  Add a real quote in{" "}
                  <code className="font-mono text-accent">
                    src/content/testimonials.ts
                  </code>
                  . This section is hidden entirely in production until then.
                </p>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
