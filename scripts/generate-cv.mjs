/**
 * Renders src/content/cv.ts (+ site.ts, stack.ts, projects.ts) to
 * public/abdikarim-cv.pdf.
 *
 *   npm run cv
 *
 * Run it after editing CV content, then commit the PDF - it's checked in and
 * linked directly from the site (site.cv), so an unregenerated PDF is a stale
 * one. Mirrors the layout primitives in generate-manuals.mjs so every
 * generated document on the site shares one visual language.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { githubUsername, site, socials } from "../src/content/site.ts";
import { stack } from "../src/content/stack.ts";
import { getProject } from "../src/content/projects.ts";
import {
  cvEducation,
  cvExperience,
  cvPhone,
  cvProfile,
  cvProjectBulletCount,
  cvProjectSlugs,
  cvProjectTagCount,
} from "../src/content/cv.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── Page geometry (A4, in points) ──────────────────────────────────────────
const PAGE = { width: 595.28, height: 841.89 };
const MARGIN = { top: 42, bottom: 34, x: 54 };
const CONTENT_WIDTH = PAGE.width - MARGIN.x * 2;

// ── Palette. Mirrors the rest of the generated docs. ────────────────────────
const INK = rgb(0.09, 0.1, 0.11);
const MUTED = rgb(0.42, 0.44, 0.47);
const ACCENT = rgb(0.85, 0.42, 0.15);
const RULE = rgb(0.86, 0.87, 0.88);

/**
 * pdf-lib's standard fonts are WinAnsi-encoded and throw on anything outside
 * it. Folding typographic punctuation to ASCII keeps output predictable no
 * matter what gets pasted into the content files later.
 */
function ascii(text) {
  return String(text)
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/…/g, "...")
    .replace(/ /g, " ")
    .replace(/[•·]/g, "-")
    .replace(/→/g, "->")
    .replace(/[^\x20-\x7E\n]/g, "");
}

class Doc {
  constructor(pdf, fonts) {
    this.pdf = pdf;
    this.fonts = fonts;
    this.pages = [];
    this.page = null;
    this.y = 0;
    this.newPage();
  }

  newPage() {
    this.page = this.pdf.addPage([PAGE.width, PAGE.height]);
    this.pages.push(this.page);
    this.y = PAGE.height - MARGIN.top;
  }

  need(height) {
    if (this.y - height < MARGIN.bottom) this.newPage();
  }

  space(amount) {
    this.y -= amount;
  }

  wrap(text, font, size, width) {
    const lines = [];
    for (const paragraph of ascii(text).split("\n")) {
      let line = "";
      for (const word of paragraph.split(/\s+/).filter(Boolean)) {
        const candidate = line ? `${line} ${word}` : word;
        if (line && font.widthOfTextAtSize(candidate, size) > width) {
          lines.push(line);
          line = word;
        } else {
          line = candidate;
        }
      }
      lines.push(line);
    }
    return lines;
  }

  text(content, opts = {}) {
    const {
      font = this.fonts.regular,
      size = 10,
      color = INK,
      leading = size * 1.4,
      x = MARGIN.x,
      width = CONTENT_WIDTH,
    } = opts;

    for (const line of this.wrap(content, font, size, width)) {
      this.need(leading);
      this.y -= leading;
      this.page.drawText(line, { x, y: this.y, size, font, color });
    }
  }

  /** Right-aligned text on the current baseline - used for header contact lines. */
  textRight(content, opts = {}) {
    const { font = this.fonts.regular, size = 10, color = INK, y = this.y } = opts;
    const clean = ascii(content);
    const width = font.widthOfTextAtSize(clean, size);
    this.page.drawText(clean, {
      x: MARGIN.x + CONTENT_WIDTH - width,
      y,
      size,
      font,
      color,
    });
  }

  rule(color = RULE, thickness = 0.75) {
    this.need(8);
    this.page.drawLine({
      start: { x: MARGIN.x, y: this.y },
      end: { x: MARGIN.x + CONTENT_WIDTH, y: this.y },
      thickness,
      color,
    });
  }

  sectionHeading(label) {
    this.need(24);
    this.space(4);
    this.text(label.toUpperCase(), {
      font: this.fonts.bold,
      size: 10,
      color: ACCENT,
      leading: 11,
    });
    this.space(1);
    this.rule();
    this.space(8);
  }

  bullet(content, { size = 9.6, leading = size * 1.34 } = {}) {
    const gutter = 12;
    const lines = this.wrap(content, this.fonts.regular, size, CONTENT_WIDTH - gutter);
    lines.forEach((line, index) => {
      this.need(leading);
      this.y -= leading;
      if (index === 0) {
        this.page.drawText("-", {
          x: MARGIN.x,
          y: this.y,
          size,
          font: this.fonts.bold,
          color: ACCENT,
        });
      }
      this.page.drawText(line, {
        x: MARGIN.x + gutter,
        y: this.y,
        size,
        font: this.fonts.regular,
        color: INK,
      });
    });
  }
}

function renderHeader(doc, fonts) {
  doc.text(site.fullName.toUpperCase(), { font: fonts.bold, size: 23, leading: 26 });
  doc.space(3);
  doc.text(`${site.role}`, { font: fonts.regular, size: 12.5, color: ACCENT, leading: 16 });
  doc.space(6);

  const linkedin = socials.find((s) => s.icon === "linkedin");
  const contactLine = [
    site.location,
    site.email,
    cvPhone,
    `github.com/${githubUsername}`,
    linkedin ? `linkedin.com${linkedin.handle}` : null,
  ]
    .filter(Boolean)
    .join("   |   ");
  doc.text(contactLine, { size: 9, color: MUTED, leading: 13 });
  doc.space(7);
  doc.rule(INK, 1.25);
  doc.space(12);
}

function renderProfile(doc) {
  doc.sectionHeading("Profile");
  doc.text(cvProfile, { size: 9.8, leading: 13.8 });
  doc.space(9);
}

function renderExperience(doc) {
  doc.sectionHeading("Experience");
  for (const job of cvExperience) {
    doc.need(14);
    doc.text(job.title, { font: doc.fonts.bold, size: 10.3, leading: 13 });
    const y = doc.y;
    doc.textRight(job.dates, { size: 9, color: MUTED, y });
    doc.text(job.org, { size: 9.3, color: MUTED, leading: 13 });
    doc.space(3);
    for (const bullet of job.bullets) doc.bullet(bullet);
    doc.space(8);
  }
}

function renderProjects(doc) {
  doc.sectionHeading("Selected Projects");
  for (const slug of cvProjectSlugs) {
    const project = getProject(slug);
    if (!project) continue;

    doc.need(14);
    doc.text(project.name, { font: doc.fonts.bold, size: 10.3, leading: 13 });
    const y = doc.y;
    doc.textRight(`${project.year}  |  ${project.domain}`, { size: 9, color: MUTED, y });
    doc.space(2);
    doc.text(project.tagline, { size: 9.5, leading: 13 });
    doc.space(2);
    for (const feature of project.features.slice(0, cvProjectBulletCount)) {
      doc.bullet(feature);
    }
    doc.space(2);
    doc.text(project.tags.slice(0, cvProjectTagCount).join("  -  "), {
      font: doc.fonts.mono,
      size: 8,
      color: MUTED,
      leading: 11,
    });
    doc.space(9);
  }
}

function renderSkills(doc) {
  doc.sectionHeading("Skills");
  for (const group of stack) {
    doc.need(13);
    doc.text(`${group.title}:  ${group.items.map((item) => item.name).join(", ")}`, {
      size: 9.4,
      leading: 13.2,
    });
  }
  doc.space(10);
}

function renderEducation(doc) {
  doc.sectionHeading("Education");
  doc.text(`${cvEducation.degree} - ${cvEducation.school}`, {
    font: doc.fonts.bold,
    size: 10.5,
    leading: 14,
  });
  doc.text(`${cvEducation.location}  |  ${cvEducation.status}`, {
    size: 9.3,
    color: MUTED,
    leading: 13,
  });
}

async function main() {
  await mkdir(join(root, "public"), { recursive: true });

  const pdf = await PDFDocument.create();
  const fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    mono: await pdf.embedFont(StandardFonts.Courier),
  };

  pdf.setTitle(ascii(`${site.fullName} - CV`));
  pdf.setSubject(ascii(site.role));
  pdf.setAuthor(site.fullName);
  pdf.setCreator(`${site.fullName} - portfolio`);

  const doc = new Doc(pdf, fonts);
  renderHeader(doc, fonts);
  renderProfile(doc);
  renderExperience(doc);
  renderProjects(doc);
  renderSkills(doc);
  renderEducation(doc);

  const bytes = await pdf.save();
  const target = join(root, "public", site.cv.replace(/^\//, ""));
  await writeFile(target, bytes);

  console.log(
    `  ${site.cv.padEnd(28)} ${String(doc.pages.length).padStart(2)} page(s)  ${(bytes.length / 1024).toFixed(0)} KB  ->  ${target.slice(root.length + 1)}`,
  );
}

await main();
