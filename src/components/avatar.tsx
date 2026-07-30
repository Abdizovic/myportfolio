import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * Renders the profile photo when one exists in /public, and a deliberate
 * monogram tile when it doesn't.
 *
 * The existence check runs at build time on the server, so the page never ships
 * a broken image while the real photo is still pending — drop `abdikarim.jpg`
 * into /public and it swaps automatically on the next build.
 */
function hasPublicFile(src: string) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
  } catch {
    return false;
  }
}

export function Avatar({
  src,
  alt,
  size = 288,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  if (hasPublicFile(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        sizes={`(max-width: 640px) 12rem, ${size}px`}
        className={`h-full w-full object-cover object-top ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${alt} — placeholder`}
      className={`grid h-full w-full place-items-center bg-surface-2 ${className}`}
    >
      <span
        aria-hidden="true"
        className="font-mono text-[28%] font-bold leading-none tracking-tighter text-accent"
      >
        A
      </span>
    </div>
  );
}
