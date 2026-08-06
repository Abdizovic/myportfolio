import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeScript } from "@/components/theme-script";
import { githubUsername, site, socials } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const description = `${site.role} in ${site.location} with ${site.experience.label} of production experience. I build fast, accessible Next.js apps with Supabase, M-Pesa (Daraja) payments and AI integrations for Kenyan and international clients.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName} — ${site.role}`,
    // Page titles become "Projects · Abdikarim".
    template: `%s · ${site.fullName}`,
  },
  description,
  keywords: [
    "Next.js developer Kenya",
    "M-Pesa Daraja API integration",
    "Supabase developer",
    "React developer Nairobi",
    "freelance frontend developer Kenya",
    "STK Push integration",
    "TypeScript developer",
    "UI/UX designer Nairobi",
    "AI chatbot integration Kenya",
  ],
  authors: [{ name: site.fullName, url: site.url }],
  creator: site.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: site.url,
    siteName: `${site.fullName} — ${site.role}`,
    title: `${site.fullName} — ${site.role}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} — ${site.role}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c0e" },
  ],
};

/** Person schema — helps search engines connect the name, role and profiles. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.fullName,
  url: site.url,
  email: `mailto:${site.email}`,
  telephone: site.phone,
  jobTitle: site.role,
  description,
  address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Umma University" },
  knowsAbout: [
    "Next.js",
    "TypeScript",
    "React",
    "Supabase",
    "M-Pesa Daraja API",
    "Tailwind CSS",
    "UI/UX design",
    "AI chatbot integration",
  ],
  sameAs: socials
    .filter((s) => s.icon !== "mail" && s.icon !== "whatsapp")
    .map((s) => s.href),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: ThemeScript mutates <html> before React hydrates.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <ThemeScript />
        <link rel="me" href={`https://github.com/${githubUsername}`} />
        {/*
          .reveal starts at opacity 0 and is animated in by JavaScript. If
          scripts are blocked or fail, this makes the content visible anyway —
          a portfolio that renders blank without JS is not a portfolio.
        */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-accent-contrast"
        >
          Skip to content
        </a>

        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />

        <script
          type="application/ld+json"
          // Static, developer-authored object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
