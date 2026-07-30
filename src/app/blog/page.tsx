import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { Badge, Container, Eyebrow } from "@/components/ui";
import { posts, readingTime } from "@/content/posts";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Short technical write-ups on M-Pesa Daraja integrations, Supabase row-level security and building payment flows that hold up in production.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "Notes — M-Pesa, Supabase and payment flows",
    description:
      "Short technical write-ups on M-Pesa Daraja integrations, Supabase row-level security and building payment flows that hold up in production.",
  },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function BlogIndex() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="pb-24">
      <header className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_70%_at_30%_0%,black,transparent)]"
        />
        <Container className="relative py-14 sm:py-20">
          <Eyebrow>Notes</Eyebrow>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.08] sm:text-5xl">
            The bits the tutorials skip.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Mostly M-Pesa and Supabase. I write these up because the answers were
            genuinely hard to find the first time, and the next person shouldn&apos;t
            have to reverse-engineer them from a sandbox.
          </p>
        </Container>
      </header>

      <Container className="py-14">
        {sorted.length === 0 ? (
          <p className="text-muted">Nothing published yet — first note coming soon.</p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {sorted.map((post, index) => (
              <li key={post.slug}>
                <Reveal delay={index * 50}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-3 py-8 sm:flex-row sm:items-baseline sm:gap-8"
                  >
                    <time
                      dateTime={post.date}
                      className="shrink-0 font-mono text-xs text-muted sm:w-28"
                    >
                      {dateFormat.format(new Date(post.date))}
                    </time>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-medium transition-colors group-hover:text-accent sm:text-xl">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {post.description}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        {post.tags.map((tag) => (
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
        )}
      </Container>
    </div>
  );
}
