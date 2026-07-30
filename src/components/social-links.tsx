import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  UpworkIcon,
  WhatsappIcon,
} from "@/components/icons";
import { socials, type SocialLink } from "@/content/site";

const iconFor = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  upwork: UpworkIcon,
  mail: MailIcon,
  whatsapp: WhatsappIcon,
} as const;

function isExternal(link: SocialLink) {
  return !link.href.startsWith("mailto:");
}

export function SocialLinks({
  className = "",
  size = "md",
  only,
}: {
  className?: string;
  size?: "sm" | "md";
  /** Restrict to a subset, in the order given. */
  only?: SocialLink["icon"][];
}) {
  const items = only
    ? only
        .map((key) => socials.find((s) => s.icon === key))
        .filter((s): s is SocialLink => Boolean(s))
    : socials;

  const box = size === "sm" ? "size-9" : "size-10";
  const glyph = size === "sm" ? "size-[17px]" : "size-4.5";

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map((link) => {
        const Icon = iconFor[link.icon];
        return (
          <li key={link.label}>
            <a
              href={link.href}
              {...(isExternal(link)
                ? { target: "_blank", rel: "noopener noreferrer me" }
                : {})}
              // The visible icon has no text, so the link carries its own name.
              aria-label={`${link.label} — ${link.handle}`}
              title={link.label}
              className={`inline-flex ${box} items-center justify-center rounded-lg border border-border bg-surface text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent`}
            >
              <Icon className={glyph} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
