import { ImageResponse } from "next/og";

import { site } from "@/content/site";

/**
 * Social share card, generated at build time.
 *
 * No web fonts are fetched — Satori falls back to the system sans, which keeps
 * the build hermetic and fast. Layout uses only the flexbox subset Satori
 * supports, so every element that has children declares `display: flex`.
 */
export const alt = `${site.fullName} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0c0e",
          padding: 72,
          position: "relative",
        }}
      >
        {/* Accent rule along the top edge. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 8,
            background: "#00d181",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#00d181",
              color: "#04150e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div
            style={{
              display: "flex",
              color: "#949ca4",
              fontSize: 24,
              letterSpacing: 2,
            }}
          >
            {site.location.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#e8eaec",
              fontSize: 82,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            {site.fullName}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              color: "#00d181",
              fontSize: 34,
              fontWeight: 600,
            }}
          >
            {site.role}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              color: "#949ca4",
              fontSize: 30,
              lineHeight: 1.35,
              maxWidth: 900,
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            borderTop: "1px solid #232a30",
            paddingTop: 28,
          }}
        >
          {["Next.js", "TypeScript", "Supabase", "M-Pesa Daraja"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                border: "1px solid #232a30",
                borderRadius: 8,
                padding: "8px 16px",
                color: "#949ca4",
                fontSize: 22,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
