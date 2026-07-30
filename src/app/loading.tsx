import { Container } from "@/components/ui";

/**
 * Route-level skeleton. Every page here is statically rendered, so this is
 * mostly seen on a cold navigation or a slow connection — it exists so a
 * transition never shows a blank frame.
 */
export default function Loading() {
  return (
    <Container className="py-20">
      <div className="space-y-4" aria-hidden="true">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-12 w-3/4 max-w-2xl rounded-lg" />
        <div className="skeleton h-4 w-full max-w-xl rounded" />
        <div className="skeleton h-4 w-5/6 max-w-lg rounded" />
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-40 rounded-xl" />
        ))}
      </div>
      <span className="sr-only" role="status">
        Loading page
      </span>
    </Container>
  );
}
