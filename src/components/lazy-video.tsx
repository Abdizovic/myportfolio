"use client";

import { useState } from "react";

import { ArrowUpRightIcon, PlayIcon } from "@/components/icons";

/**
 * Click-to-load video embed.
 *
 * Nothing from YouTube, Loom or Vimeo is requested until the visitor actually
 * asks for the video — an idle embed otherwise costs several hundred KB and a
 * pile of third-party cookies on a page most visitors will only scroll past.
 *
 * Anything we can't turn into an embed URL degrades to a plain external link,
 * so an unrecognised host is never a broken player.
 */
function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
      const short = parsed.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)/)?.[1];
      return short ? `https://www.youtube-nocookie.com/embed/${short}?autoplay=1` : null;
    }

    if (host === "loom.com") {
      const id = parsed.pathname.match(/\/(?:share|embed)\/([\w-]+)/)?.[1];
      return id ? `https://www.loom.com/embed/${id}?autoplay=1` : null;
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return /^\d+$/.test(id ?? "")
        ? `https://player.vimeo.com/video/${id}?autoplay=1`
        : null;
    }

    return null;
  } catch {
    return null;
  }
}

export function LazyVideo({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const embed = toEmbedUrl(url);

  if (!embed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex aspect-video items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
      >
        Watch the walkthrough
        <ArrowUpRightIcon className="size-4" />
      </a>
    );
  }

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play video: ${title}`}
        className="dot-grid group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-2 transition-colors hover:border-accent/50"
      >
        <span className="relative flex flex-col items-center gap-3">
          <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-contrast transition-transform duration-200 group-hover:scale-105">
            <PlayIcon className="size-7" />
          </span>
          <span className="text-sm font-medium">Play walkthrough</span>
          <span className="font-mono text-[11px] text-muted">
            Loads only when you press play
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-xl border border-border bg-black">
      <iframe
        src={embed}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="h-full w-full"
      />
    </div>
  );
}
