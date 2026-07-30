import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { Container, Section, SectionHeading } from "@/components/ui";
import { projects } from "@/content/projects";

export function Projects() {
  return (
    <Section id="projects" aria-labelledby="projects-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="projects-heading"
            eyebrow="Selected work"
            title="Five products, one recurring theme."
            lede="Each of these moves real money through M-Pesa. Click through for the full case study — the problem, the approach, and the parts that were genuinely hard. Most ship with a downloadable user guide and demo sign-in, so you can walk into the admin side yourself."
          />
        </Reveal>

        <div className="mt-14 space-y-6">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 70}>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
