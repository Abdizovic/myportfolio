import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowRightIcon } from "@/components/icons";
import { PostBody } from "@/components/post-body";
import { Badge, ButtonLink, Card, Container } from "@/components/ui";
import { getPost, posts, readingTime } from "@/content/posts";
import { site } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return { title: "Note not found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${site.url}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [site.fullName],
      tags: [...post.tags],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Person", name: site.fullName, url: site.url },
    keywords: post.tags.join(", "),
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <div className="pb-24">
      <Container className="py-12 sm:py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
        >
          <ArrowRightIcon className="size-4 rotate-180" />
          All notes
        </Link>

        {/* Narrow measure — ~70 characters is where long-form reading is easiest. */}
        <article className="mx-auto mt-8 max-w-2xl">
          <header>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-muted">
              <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
              <span aria-hidden="true">·</span>
              <span>{readingTime(post)} min read</span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold leading-[1.12] sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{post.description}</p>

            <ul className="mt-6 flex flex-wrap gap-1.5 border-b border-border pb-8">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Badge>{tag}</Badge>
                </li>
              ))}
            </ul>
          </header>

          <div className="mt-10">
            <PostBody blocks={post.body} />
          </div>

          <Card className="mt-14 p-6 sm:p-7">
            <h2 className="text-base font-semibold">
              Need this built rather than explained?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              I take on M-Pesa integrations and Supabase-backed product builds for
              Kenyan SMEs and international clients.
            </p>
            <ButtonLink href="/#contact" size="sm" className="mt-5">
              Start a conversation
              <ArrowRightIcon className="size-4" />
            </ButtonLink>
          </Card>

          {others.length > 0 ? (
            <nav aria-label="More notes" className="mt-14 border-t border-border pt-8">
              <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                More notes
              </h2>
              <ul className="mt-5 space-y-4">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/blog/${other.slug}`}
                      className="group flex items-start justify-between gap-4"
                    >
                      <span>
                        <span className="block font-medium transition-colors group-hover:text-accent">
                          {other.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted">
                          {other.description}
                        </span>
                      </span>
                      <ArrowRightIcon className="mt-1 size-4 shrink-0 text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </article>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </div>
  );
}
