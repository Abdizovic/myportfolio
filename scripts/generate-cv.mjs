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
 *
 * Layout: a dark header band carrying the name, role and contact row; then a
 * single-column flow of sections. Every block measures itself and asks the
 * cursor for room, so content can grow without anyone tuning page breaks.
 * Email, phone, profile and project URLs are real clickable annotations, not
 * just printed text.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { PDFDocument, PDFName, PDFString, StandardFonts, rgb } from "pdf-lib";

import { githubUsername, site, socials } from "../src/content/site.ts";
import { stack } from "../src/content/stack.ts";
import { getProject } from "../src/content/projects.ts";
import {
  cvCompetencies,
  cvEducation,
  cvExperience,
  cvFooter,
  cvHighlights,
  cvPhone,
  cvProfile,
  cvProjectBulletCount,
  cvProjectSlugs,
  cvProjectTagCount,
  cvQuickFacts,
} from "../src/content/cv.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── Page geometry (A4, in points) ──────────────────────────────────────────
const PAGE = { width: 595.28, height: 841.89 };
const MARGIN = { top: 40, bottom: 46, x: 50 };
const CONTENT_WIDTH = PAGE.width - MARGIN.x * 2;
const HEADER_HEIGHT = 122;

// ── Palette. Mirrors the rest of the generated docs. ────────────────────────
const INK = rgb(0.09, 0.1, 0.11);
const MUTED = rgb(0.42, 0.44, 0.47);
const ACCENT = rgb(0.85, 0.42, 0.15);
const RULE = rgb(0.86, 0.87, 0.88);
const PAPER = rgb(1, 1, 1);
const BAND = rgb(0.09, 0.1, 0.11);
const ON_BAND = rgb(0.99, 0.99, 0.99);
const ON_BAND_MUTED = rgb(0.72, 0.74, 0.76);
const CHIP = rgb(0.965, 0.965, 0.972);

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
    .replace(/[   ]/g, " ")
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
    /** Link annotations, collected per page and attached once at save time. */
    this.annots = new Map();
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

  /**
   * A clickable region. pdf-lib has no link helper, so the annotation is built
   * by hand and pushed onto the page's /Annots array in `finish()`.
   */
  link(url, { x, y, width, height }) {
    const ref = this.pdf.context.register(
      this.pdf.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [x, y, x + width, y + height],
        // Zero-width border: the underline is drawn, so a box would double up.
        Border: [0, 0, 0],
        A: {
          Type: "Action",
          S: "URI",
          URI: PDFString.of(url),
        },
      }),
    );
    const list = this.annots.get(this.page) ?? [];
    list.push(ref);
    this.annots.set(this.page, list);
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

  width(text, font, size) {
    return font.widthOfTextAtSize(ascii(text), size);
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

  /** Draw at an absolute baseline without moving the cursor. */
  at(content, { x, y, font = this.fonts.regular, size = 10, color = INK }) {
    this.page.drawText(ascii(content), { x, y, size, font, color });
  }

  /** Right-aligned text on a given baseline - used for dates and meta. */
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

  /** Section heading: an accent tick, the label, and a hairline across. */
  sectionHeading(label) {
    this.need(30);
    this.space(6);
    const size = 9.6;
    this.y -= size + 2;

    this.page.drawRectangle({
      x: MARGIN.x,
      y: this.y - 1,
      width: 15,
      height: size - 1,
      color: ACCENT,
    });

    const text = ascii(label).toUpperCase();
    this.page.drawText(text, {
      x: MARGIN.x + 22,
      y: this.y,
      size,
      font: this.fonts.bold,
      color: INK,
    });

    const labelEnd =
      MARGIN.x + 22 + this.fonts.bold.widthOfTextAtSize(text, size) + 10;
    this.page.drawLine({
      start: { x: labelEnd, y: this.y + size / 2 - 1 },
      end: { x: MARGIN.x + CONTENT_WIDTH, y: this.y + size / 2 - 1 },
      thickness: 0.7,
      color: RULE,
    });

    this.space(10);
  }

  bullet(content, { size = 9.5, leading = size * 1.36, x = MARGIN.x, width = CONTENT_WIDTH } = {}) {
    const gutter = 11;
    const lines = this.wrap(content, this.fonts.regular, size, width - gutter);
    lines.forEach((line, index) => {
      this.need(leading);
      this.y -= leading;
      if (index === 0) {
        this.page.drawCircle({
          x: x + 3,
          y: this.y + size * 0.32,
          size: 1.6,
          color: ACCENT,
        });
      }
      this.page.drawText(line, {
        x: x + gutter,
        y: this.y,
        size,
        font: this.fonts.regular,
        color: INK,
      });
    });
  }

  /**
   * Tag row: flat filled boxes that wrap across the content width. Used for
   * competencies and per-project stacks - the block a scanner reads first.
   */
  chips(items, { size = 8.4, fill = CHIP, color = INK, font = this.fonts.regular } = {}) {
    const padX = 7;
    const height = size + 9;
    const gap = 5;
    const rows = [];
    let row = [];
    let used = 0;

    for (const item of items) {
      const label = ascii(item);
      const boxWidth = font.widthOfTextAtSize(label, size) + padX * 2;
      if (row.length && used + boxWidth > CONTENT_WIDTH) {
        rows.push(row);
        row = [];
        used = 0;
      }
      row.push({ label, boxWidth });
      used += boxWidth + gap;
    }
    if (row.length) rows.push(row);

    for (const line of rows) {
      this.need(height + gap);
      this.y -= height;
      let x = MARGIN.x;
      for (const { label, boxWidth } of line) {
        this.page.drawRectangle({
          x,
          y: this.y,
          width: boxWidth,
          height,
          color: fill,
        });
        this.page.drawText(label, {
          x: x + padX,
          y: this.y + (height - size) / 2 + 1.2,
          size,
          font,
          color,
        });
        x += boxWidth + gap;
      }
      this.space(gap);
    }
  }

  /** Page footer: hairline, name, and "page n of m", stamped once at the end. */
  stampFooters() {
    const total = this.pages.length;
    const left = ascii(`${site.fullName} - ${site.role}`);

    this.pages.forEach((page, index) => {
      page.drawLine({
        start: { x: MARGIN.x, y: MARGIN.bottom - 14 },
        end: { x: MARGIN.x + CONTENT_WIDTH, y: MARGIN.bottom - 14 },
        thickness: 0.5,
        color: RULE,
      });
      page.drawText(left, {
        x: MARGIN.x,
        y: MARGIN.bottom - 26,
        size: 7.6,
        font: this.fonts.regular,
        color: MUTED,
      });

      const label = `Page ${index + 1} of ${total}`;
      const width = this.fonts.regular.widthOfTextAtSize(label, 7.6);
      page.drawText(label, {
        x: MARGIN.x + CONTENT_WIDTH - width,
        y: MARGIN.bottom - 26,
        size: 7.6,
        font: this.fonts.regular,
        color: MUTED,
      });
    });
  }

  finish() {
    for (const [page, refs] of this.annots) {
      page.node.set(PDFName.of("Annots"), this.pdf.context.obj(refs));
    }
  }
}

// ── Sections ────────────────────────────────────────────────────────────────

/**
 * Contact entries for the header band. `url` is optional - a plain string is
 * printed without an annotation.
 */
function contactEntries() {
  const linkedin = socials.find((s) => s.icon === "linkedin");
  const entries = [
    { label: site.location },
    { label: cvPhone, url: `tel:${site.phoneE164}` },
    { label: site.email, url: `mailto:${site.email}` },
    { label: `github.com/${githubUsername}`, url: `https://github.com/${githubUsername}` },
  ];

  if (linkedin) {
    entries.push({
      label: `linkedin.com${linkedin.handle}`,
      url: linkedin.href,
    });
  }

  // site.url falls back to localhost when NEXT_PUBLIC_SITE_URL is unset -
  // printing that on a CV is worse than omitting the line entirely.
  if (!site.url.includes("localhost")) {
    entries.push({
      label: site.url.replace(/^https?:\/\//, ""),
      url: site.url,
    });
  }

  return entries;
}

/** Split entries into rows that fit the content width. */
function packRows(doc, entries, { font, size, separator }) {
  const sepWidth = doc.width(separator, font, size);
  const rows = [];
  let row = [];
  let used = 0;

  for (const entry of entries) {
    const w = doc.width(entry.label, font, size);
    if (row.length && used + sepWidth + w > CONTENT_WIDTH) {
      rows.push(row);
      row = [];
      used = 0;
    }
    used += (row.length ? sepWidth : 0) + w;
    row.push(entry);
  }
  if (row.length) rows.push(row);
  return rows;
}

function renderHeader(doc) {
  const page = doc.page;

  page.drawRectangle({
    x: 0,
    y: PAGE.height - HEADER_HEIGHT,
    width: PAGE.width,
    height: HEADER_HEIGHT,
    color: BAND,
  });
  // Accent keyline along the bottom of the band.
  page.drawRectangle({
    x: 0,
    y: PAGE.height - HEADER_HEIGHT,
    width: PAGE.width,
    height: 3,
    color: ACCENT,
  });

  let y = PAGE.height - 44;
  doc.at(site.fullName.toUpperCase(), {
    x: MARGIN.x,
    y,
    font: doc.fonts.bold,
    size: 25,
    color: ON_BAND,
  });

  y -= 18;
  doc.at(`${site.role}  |  ${site.experience.label} experience`, {
    x: MARGIN.x,
    y,
    font: doc.fonts.regular,
    size: 11,
    color: ACCENT,
  });

  // Contact rows, laid out left to right with clickable segments.
  const size = 8.6;
  const separator = "   |   ";
  const font = doc.fonts.regular;
  const rows = packRows(doc, contactEntries(), { font, size, separator });

  y -= 20;
  for (const row of rows) {
    let x = MARGIN.x;
    row.forEach((entry, index) => {
      if (index > 0) {
        doc.at(separator, { x, y, font, size, color: ON_BAND_MUTED });
        x += doc.width(separator, font, size);
      }
      const width = doc.width(entry.label, font, size);
      doc.at(entry.label, { x, y, font, size, color: ON_BAND });
      if (entry.url) {
        doc.link(entry.url, { x, y: y - 2.5, width, height: size + 4 });
        page.drawLine({
          start: { x, y: y - 2.2 },
          end: { x: x + width, y: y - 2.2 },
          thickness: 0.4,
          color: ON_BAND_MUTED,
        });
      }
      x += width;
    });
    y -= 13;
  }

  doc.y = PAGE.height - HEADER_HEIGHT - 22;
}

/**
 * Four-column strip of label/value pairs, directly under the header. The
 * site-derived boxes are built here so cv.ts can stay import-free.
 */
function renderQuickFacts(doc) {
  const columns = [
    {
      label: "Experience",
      value: `${site.experience.label} shipping production web apps`,
    },
    ...cvQuickFacts,
    { label: "Based in", value: `${site.location} - remote, EAT (UTC+3)` },
    { label: "Availability", value: site.availability.detail },
  ].slice(0, 4);

  if (columns.length === 0) return;

  const gap = 12;
  const columnWidth = (CONTENT_WIDTH - gap * (columns.length - 1)) / columns.length;
  const labelSize = 6.8;
  const valueSize = 8.4;

  // Measure the tallest column first so the whole strip moves as one block.
  const valueLines = columns.map((fact) =>
    doc.wrap(fact.value, doc.fonts.bold, valueSize, columnWidth - 8),
  );
  const maxLines = Math.max(...valueLines.map((lines) => lines.length));
  const height = 12 + labelSize + 5 + maxLines * (valueSize + 3) + 8;

  doc.need(height + 8);
  doc.y -= height;

  columns.forEach((fact, index) => {
    const x = MARGIN.x + index * (columnWidth + gap);

    doc.page.drawRectangle({
      x,
      y: doc.y,
      width: columnWidth,
      height,
      color: CHIP,
    });
    doc.page.drawRectangle({
      x,
      y: doc.y,
      width: 2,
      height,
      color: ACCENT,
    });

    let cursor = doc.y + height - 12;
    doc.at(fact.label.toUpperCase(), {
      x: x + 8,
      y: cursor,
      font: doc.fonts.bold,
      size: labelSize,
      color: MUTED,
    });

    cursor -= labelSize + 5;
    for (const line of valueLines[index]) {
      doc.at(line, {
        x: x + 8,
        y: cursor,
        font: doc.fonts.bold,
        size: valueSize,
        color: INK,
      });
      cursor -= valueSize + 3;
    }
  });

  doc.space(12);
}

function renderProfile(doc) {
  doc.sectionHeading("Profile");
  doc.text(cvProfile, { size: 9.5, leading: 13.4 });
  doc.space(8);
}

function renderCompetencies(doc) {
  if (cvCompetencies.length === 0) return;
  doc.sectionHeading("Core competencies");
  doc.chips(cvCompetencies);
  doc.space(6);
}

function renderHighlights(doc) {
  if (cvHighlights.length === 0) return;
  doc.sectionHeading("Selected achievements");
  for (const item of cvHighlights) doc.bullet(item);
  doc.space(10);
}

function renderExperience(doc) {
  doc.sectionHeading("Experience");
  for (const job of cvExperience) {
    doc.need(30);
    doc.text(job.title, { font: doc.fonts.bold, size: 10.4, leading: 13 });
    doc.textRight(job.dates, { size: 8.8, color: MUTED, y: doc.y });
    doc.text(job.org, { size: 9.2, color: ACCENT, leading: 12.5 });
    doc.space(3);
    for (const bullet of job.bullets) doc.bullet(bullet);
    doc.space(9);
  }
}

function renderProjects(doc) {
  doc.sectionHeading("Selected projects");
  for (const slug of cvProjectSlugs) {
    const project = getProject(slug);
    if (!project) continue;

    doc.need(52);
    doc.text(project.name, { font: doc.fonts.bold, size: 10.4, leading: 13 });
    doc.textRight(`${project.year}  |  ${project.domain}`, {
      size: 8.8,
      color: MUTED,
      y: doc.y,
    });
    doc.space(2);
    doc.text(project.tagline, { size: 9.3, leading: 12.6 });
    doc.space(3);

    for (const feature of project.features.slice(0, cvProjectBulletCount)) {
      doc.bullet(feature, { size: 9.2 });
    }

    // Live URLs, clickable. A monorepo lists each deployed surface.
    const deployments =
      project.deployments ??
      (project.liveUrl ? [{ label: "Live", url: project.liveUrl }] : []);

    if (deployments.length > 0) {
      const size = 8.2;
      const font = doc.fonts.mono;
      doc.space(4);
      for (const deployment of deployments) {
        const label = `${deployment.label}: ${deployment.url.replace(/^https?:\/\//, "")}`;
        const width = doc.width(label, font, size);
        doc.need(size + 4);
        doc.y -= size + 4;
        doc.at(label, { x: MARGIN.x, y: doc.y, font, size, color: ACCENT });
        doc.link(deployment.url, {
          x: MARGIN.x,
          y: doc.y - 2,
          width,
          height: size + 4,
        });
      }
    }

    doc.space(6);
    doc.chips(project.tags.slice(0, cvProjectTagCount), { size: 7.6 });
    doc.space(7);
  }
}

function renderSkills(doc) {
  doc.sectionHeading("Technical skills");

  const labelWidth = 96;
  const size = 9.2;
  const leading = 12.8;

  for (const group of stack) {
    const items = group.items.map((item) => item.name).join(", ");
    const lines = doc.wrap(items, doc.fonts.regular, size, CONTENT_WIDTH - labelWidth);

    doc.need(lines.length * leading + 4);
    doc.y -= leading;
    doc.at(group.title, {
      x: MARGIN.x,
      y: doc.y,
      font: doc.fonts.bold,
      size,
      color: INK,
    });

    lines.forEach((line, index) => {
      if (index > 0) {
        doc.y -= leading;
      }
      doc.at(line, {
        x: MARGIN.x + labelWidth,
        y: doc.y,
        font: doc.fonts.regular,
        size,
        color: INK,
      });
    });
    doc.space(4);
  }
  doc.space(6);
}

function renderEducation(doc) {
  doc.sectionHeading("Education");
  doc.text(`${cvEducation.degree} - ${cvEducation.school}`, {
    font: doc.fonts.bold,
    size: 10.2,
    leading: 13.5,
  });
  doc.text(`${cvEducation.location}  |  ${cvEducation.status}`, {
    size: 9,
    color: MUTED,
    leading: 12.5,
  });
  doc.space(8);
}

/**
 * Closing strip rather than a full section: a hairline and two short lines.
 * A heading here would cost 30pt for three facts nobody scans for.
 */
function renderFooterBlock(doc) {
  const size = 8.8;
  const leading = 12;
  const hasPortfolio = !site.url.includes("localhost");
  const rows = 2 + (hasPortfolio ? 1 : 0);

  doc.need(rows * leading + 16);
  doc.space(8);
  doc.rule();
  doc.space(4);

  doc.y -= leading;
  doc.at("Languages:", {
    x: MARGIN.x,
    y: doc.y,
    font: doc.fonts.bold,
    size,
    color: INK,
  });
  doc.at(cvFooter.languages, {
    x: MARGIN.x + doc.width("Languages: ", doc.fonts.bold, size),
    y: doc.y,
    size,
    color: INK,
  });

  if (hasPortfolio) {
    doc.y -= leading;
    doc.at(cvFooter.portfolio, { x: MARGIN.x, y: doc.y, size, color: MUTED });
    const label = site.url.replace(/^https?:\/\//, "");
    const x = MARGIN.x + doc.width(`${cvFooter.portfolio} `, doc.fonts.regular, size);
    doc.at(label, { x, y: doc.y, font: doc.fonts.mono, size, color: ACCENT });
    doc.link(site.url, {
      x,
      y: doc.y - 2,
      width: doc.width(label, doc.fonts.mono, size),
      height: size + 4,
    });
  }

  doc.y -= leading;
  doc.at(cvFooter.references, { x: MARGIN.x, y: doc.y, size, color: MUTED });
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
  pdf.setSubject(ascii(`${site.role} - ${site.location}`));
  pdf.setAuthor(site.fullName);
  pdf.setCreator(`${site.fullName} - portfolio`);
  pdf.setProducer("pdf-lib");
  pdf.setKeywords([
    "Next.js",
    "TypeScript",
    "React",
    "Supabase",
    "PostgreSQL",
    "M-Pesa Daraja",
    "UI/UX design",
    "Full-stack developer",
    "Kenya",
  ]);
  pdf.setCreationDate(new Date());

  const doc = new Doc(pdf, fonts);

  // The header band paints over the page background, so nothing above it can
  // rely on the default white - draw the sheet first.
  doc.page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE.width,
    height: PAGE.height,
    color: PAPER,
  });

  renderHeader(doc);
  renderQuickFacts(doc);
  renderProfile(doc);
  renderCompetencies(doc);
  renderHighlights(doc);
  renderExperience(doc);
  renderProjects(doc);
  renderSkills(doc);
  renderEducation(doc);
  renderFooterBlock(doc);

  doc.stampFooters();
  doc.finish();

  const bytes = await pdf.save();
  const target = join(root, "public", site.cv.replace(/^\//, ""));
  await writeFile(target, bytes);

  console.log(
    `  ${site.cv.padEnd(28)} ${String(doc.pages.length).padStart(2)} page(s)  ${(bytes.length / 1024).toFixed(0)} KB  ->  ${target.slice(root.length + 1)}`,
  );
}

await main();
