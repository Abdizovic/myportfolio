import { Reveal } from "@/components/reveal";
import { Card, Container, Section, SectionHeading } from "@/components/ui";
import { site } from "@/content/site";

const facts = [
  { label: "Based in", value: `${site.location}` },
  { label: "Studying", value: "BSc Computer Science, Umma University" },
  { label: "Focus", value: "Next.js · Supabase · M-Pesa integrations" },
  { label: "Working with", value: "Kenyan SMEs and international clients" },
];

const exploring = [
  "UI/UX design in Figma",
  "Full-stack web development",
  "React Native & Expo",
  "Blockchain fundamentals",
];

export function About() {
  return (
    <Section id="about" aria-labelledby="about-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="about-heading"
            eyebrow="About"
            title="I build the unglamorous parts properly."
          />
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal delay={60}>
            <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
              <p>
                I&apos;m a Computer Science student at{" "}
                <strong className="font-medium text-foreground">Umma University</strong>{" "}
                in Kajiado, Kenya, and a freelance developer working mostly in Next.js,
                TypeScript and Supabase.
              </p>
              <p>
                What I keep coming back to is the seam between a nice interface and real
                money moving. Plenty of developers can build a checkout page. Far fewer
                will sit with the{" "}
                <strong className="font-medium text-foreground">
                  M-Pesa Daraja API
                </strong>{" "}
                long enough to handle retried callbacks, unmatched paybill payments and
                the difference between sandbox and production — which is exactly the part
                a business feels when it goes wrong.
              </p>
              <p>
                So that&apos;s where I&apos;ve pointed myself: practical, fintech-adjacent
                tools for local and global clients. A school that needs fees reconciled
                automatically. A shop that needs an STK Push checkout instead of a card
                form. A savings group that needs a ledger everyone can trust.
              </p>
              <p>
                Alongside that I care a lot about how things look and feel — I design in
                Figma before I write components — and I&apos;m steadily widening the
                circle into mobile with React Native, and into blockchain because the
                settlement problems rhyme with the ones I already work on.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                  At a glance
                </h3>
                <dl className="mt-5 space-y-4">
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="text-xs uppercase tracking-wide text-muted">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium leading-snug">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Card>

              <Card className="p-6">
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                  Also exploring
                </h3>
                <ul className="mt-5 space-y-2.5">
                  {exploring.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <span
                        aria-hidden="true"
                        className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
