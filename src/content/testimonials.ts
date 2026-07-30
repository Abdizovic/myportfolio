export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** e.g. "Upwork", "Direct client" — shown as a small source label. */
  source?: string;
};

/**
 * Real client quotes only. The section renders nothing on the production site
 * while this array is empty — an empty testimonials section is better than a
 * fabricated one, and reviewers can smell filler quotes instantly.
 *
 * In `next dev` you'll see outlined placeholder slots showing exactly where
 * quotes will land, so you can design against them. Those never ship.
 *
 * To add one, uncomment and edit:
 *
 * {
 *   quote: "Abdikarim rebuilt our checkout on M-Pesa in under two weeks...",
 *   name: "Jane Wanjiru",
 *   role: "Founder, Example Ltd",
 *   source: "Upwork",
 * },
 */
export const testimonials: Testimonial[] = [];
