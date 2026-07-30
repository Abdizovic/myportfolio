import type { Metadata } from "next";

import { ArrowRightIcon } from "@/components/icons";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-20">
      <div className="max-w-xl">
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          The link may be out of date, or the page may have moved. The work is all
          still here.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">
            Back home
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
          <ButtonLink href="/#projects" variant="secondary">
            See the projects
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
