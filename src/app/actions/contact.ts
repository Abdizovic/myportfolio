"use server";

import { headers } from "next/headers";

import { site } from "@/content/site";
import type { ContactState } from "@/app/actions/contact-state";

/**
 * Best-effort rate limit. In-memory means it resets on cold start and isn't
 * shared across serverless instances — it is a speed bump for casual abuse,
 * not a security control. The honeypot below catches most bots; move this to
 * Upstash/Redis if the form ever gets seriously targeted.
 */
const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 };
const attempts = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT.windowMs,
  );
  recent.push(now);
  attempts.set(key, recent);

  // Opportunistic cleanup so the map can't grow without bound.
  if (attempts.size > 500) {
    for (const [k, times] of attempts) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) attempts.delete(k);
    }
  }

  return recent.length > RATE_LIMIT.max;
}

// Intentionally permissive: the point is to catch typos, not to police RFC 5322.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("company") ?? "").trim();
  const values = { name, email, message };

  // Hidden field: a human never fills this in, most bots always do.
  if (honeypot) {
    return { status: "success", message: "Thanks — your message is on its way." };
  }

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = "Please tell me your name.";
  if (name.length > 100) fieldErrors.name = "That name is a little too long.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "That email doesn't look right.";
  if (message.length < 20)
    fieldErrors.message = "A little more detail helps — 20 characters minimum.";
  if (message.length > 5000) fieldErrors.message = "Please keep it under 5,000 characters.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return {
      status: "error",
      message: "That's a few messages in a short window. Try again in ten minutes.",
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Loud in dev, graceful in prod — the UI offers a mailto fallback either way.
    console.warn(
      "[contact] RESEND_API_KEY is not set. See .env.example to enable delivery.",
    );
    return {
      status: "error",
      message: `Email delivery isn't configured yet. Please reach me directly at ${site.email}.`,
      values,
    };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || site.email],
      replyTo: email,
      subject: `Portfolio enquiry from ${name}`,
      text: [
        `Name:  ${name}`,
        `Email: ${email}`,
        `IP:    ${ip}`,
        "",
        message,
      ].join("\n"),
    });

    if (error) {
      console.error("[contact] Resend rejected the message:", error);
      return {
        status: "error",
        message: `Something went wrong sending that. Please email me directly at ${site.email}.`,
        values,
      };
    }

    return {
      status: "success",
      message: "Thanks — message received. I usually reply within a day.",
    };
  } catch (error) {
    console.error("[contact] Unexpected failure:", error);
    return {
      status: "error",
      message: `Something went wrong sending that. Please email me directly at ${site.email}.`,
      values,
    };
  }
}
