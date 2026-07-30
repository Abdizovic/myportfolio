import {
  ArrowRightIcon,
  CheckIcon,
  LayoutIcon,
  PaymentsIcon,
  StackIcon,
} from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { TechIcon } from "@/components/tech-icon";
import { ButtonLink, Card, Container, Section, SectionHeading } from "@/components/ui";
import { services, workflow } from "@/content/services";

const iconFor = {
  layout: LayoutIcon,
  payments: PaymentsIcon,
  stack: StackIcon,
} as const;

export function Services() {
  return (
    <Section id="services" aria-labelledby="services-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="services-heading"
            eyebrow="Services"
            title="What I can build for you."
            lede="Available for freelance and contract work, remote from Kenya. Comfortable owning a project end to end or slotting into an existing team."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon === "figma" ? null : iconFor[service.icon];
            return (
              <Reveal key={service.title} delay={index * 60}>
                <Card className="flex h-full flex-col p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 sm:p-7">
                  <span
                    aria-hidden="true"
                    className="grid size-11 place-items-center rounded-xl bg-accent-soft text-[22px] text-accent"
                  >
                    {Icon ? <Icon /> : <TechIcon name="figma" />}
                  </span>

                  <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>

                  <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span className="text-sm leading-relaxed text-muted">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <div className="mt-16 border-t border-border pt-10">
            <h3 className="text-lg font-semibold">How a project runs</h3>
            <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {workflow.map((step) => (
                <li key={step.step}>
                  <span className="font-mono text-xs text-accent">{step.step}</span>
                  <h4 className="mt-2 text-sm font-semibold">{step.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.detail}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10">
              <ButtonLink href="/#contact">
                Start a project
                <ArrowRightIcon className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
