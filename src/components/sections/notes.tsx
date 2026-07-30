import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Badge, Container, Section, SectionHeading } from "@/components/ui";
import { posts, readingTime } from "@/content/posts";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function Notes() {
  if (posts.length === 0) return null;

  const latest = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <Section id="notes" aria-labelledby="notes-heading">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              id="notes-heading"
              eyebrow="Notes"
              title="Writing about the under-documented bits."
              lede="M-Pesa and Supabase patterns are badly served by the existing tutorials. These are the notes I wish I'd found."
            />
          </Reveal>
          <Reveal delay={60}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
            >
              All notes
              <ArrowRightIcon className="size-4" />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-12 divide-y divide-border border-y border-border">
          {latest.map((post, index) => (
            <li key={post.slug}>
              <Reveal delay={index * 60}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-3 py-7 transition-colors sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <time
                    dateTime={post.date}
                    className="shrink-0 font-mono text-xs text-muted sm:w-28"
                  >
                    {dateFormat.format(new Date(post.date))}
                  </time>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-medium transition-colors group-hover:text-accent">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {post.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                      <span className="ml-1 font-mono text-[11px] text-muted">
                        {readingTime(post)} min read
                      </span>
                    </div>
                  </div>

                  <ArrowRightIcon className="hidden size-4 shrink-0 self-center text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent sm:block" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
