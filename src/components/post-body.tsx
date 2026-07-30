import type { Block } from "@/content/posts";

/**
 * Renders a post's typed blocks. No syntax highlighter: shipping a tokeniser to
 * the browser for three articles is a poor trade, and monospace on a tinted
 * panel is perfectly readable. Revisit if the notes section grows a lot.
 */
export function PostBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={index}
                className="scroll-mt-24 pt-6 text-xl font-semibold sm:text-2xl"
              >
                {block.text}
              </h2>
            );

          case "p":
            return (
              <p key={index} className="text-base leading-relaxed text-muted">
                {block.text}
              </p>
            );

          case "ul":
            return (
              <ul key={index} className="space-y-2.5 pl-1">
                {block.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span className="text-base leading-relaxed text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={index} className="space-y-2.5 pl-1">
                {block.items.map((item, i) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 font-mono text-sm text-accent"
                    >
                      {i + 1}.
                    </span>
                    <span className="text-base leading-relaxed text-muted">{item}</span>
                  </li>
                ))}
              </ol>
            );

          case "code":
            return (
              <figure
                key={index}
                className="overflow-hidden rounded-xl border border-border bg-surface"
              >
                <figcaption className="border-b border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  {block.lang}
                </figcaption>
                {/* Long lines scroll inside the block, never the page. */}
                <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
                  <code className="font-mono">{block.code}</code>
                </pre>
              </figure>
            );

          case "callout":
            return (
              <aside
                key={index}
                className="rounded-xl border border-accent/30 bg-accent-soft px-5 py-4"
              >
                <p className="text-sm leading-relaxed">
                  <strong className="font-semibold text-accent">Note — </strong>
                  <span className="text-foreground">{block.text}</span>
                </p>
              </aside>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
