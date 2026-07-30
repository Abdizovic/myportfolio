import { Reveal } from "@/components/reveal";
import { TechIcon } from "@/components/tech-icon";
import { Container, Section, SectionHeading } from "@/components/ui";
import { stack } from "@/content/stack";

export function TechStack() {
  return (
    <Section id="stack" aria-labelledby="stack-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="stack-heading"
            eyebrow="Tech stack"
            title="What I reach for, and why."
            lede="A deliberately small toolkit. I'd rather know four things deeply than twelve things enough to get stuck."
          />
        </Reveal>

        <div className="mt-14 space-y-12">
          {stack.map((group, groupIndex) => (
            <Reveal key={group.title} delay={groupIndex * 60}>
              <div className="grid gap-6 border-t border-border pt-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12">
                <div>
                  <h3 className="text-lg font-semibold">{group.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {group.blurb}
                  </p>
                </div>

                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((tech) => (
                    <li
                      key={`${group.title}-${tech.name}`}
                      className="group flex items-start gap-3.5 rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40"
                    >
                      <span
                        aria-hidden="true"
                        className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface-2 text-[22px] text-muted transition-colors duration-200 group-hover:text-accent"
                      >
                        <TechIcon name={tech.icon} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">{tech.name}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                          {tech.note}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
