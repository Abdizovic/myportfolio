import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Notes } from "@/components/sections/notes";
import { Projects } from "@/components/sections/projects";
import { Services } from "@/components/sections/services";
import { TechStack } from "@/components/sections/tech-stack";
import { Testimonials } from "@/components/sections/testimonials";

/**
 * The GitHub activity widget is deliberately not mounted here. The profile it
 * reads has almost nothing public on it, and a widget reporting three
 * contributions and two throwaway repos costs more credibility than the empty
 * space does. `src/components/sections/github-activity.tsx` is left intact —
 * put it back once the profile has a year of real commits behind it:
 *
 *   <Section aria-label="GitHub activity">
 *     <Suspense fallback={<GitHubActivitySkeleton />}>
 *       <GitHubActivity />
 *     </Suspense>
 *   </Section>
 *
 * The GitHub link in the header and footer stays either way — a quiet link
 * costs nothing.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Services />
      <Testimonials />
      <Notes />
      <Contact />
    </>
  );
}
