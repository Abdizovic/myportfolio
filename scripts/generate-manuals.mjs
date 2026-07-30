/**
 * Renders every entry in `src/content/manuals.ts` to a PDF in `public/manuals`.
 *
 *   npm run manuals
 *
 * Run it after editing manual content, then commit the PDFs — they are checked
 * in, and the site links to the files on disk, so an unregenerated PDF is a
 * stale one. Deliberately not wired into `npm run build`: it needs Node's
 * `--experimental-strip-types` to read the TypeScript content file, and the
 * build should not be hostage to which Node version the deploy host picked.
 *
 * The layout is a single-column flow with a small set of block renderers. Each
 * one measures itself, asks the cursor for room, and takes a new page if there
 * isn't any — so content can grow freely without anyone tuning page breaks.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { manualAuthor, manuals } from "../src/content/manuals.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "manuals");

// ── Page geometry (A4, in points) ──────────────────────────────────────────
const PAGE = { width: 595.28, height: 841.89 };
const MARGIN = { top: 62, bottom: 64, x: 56 };
const CONTENT_WIDTH = PAGE.width - MARGIN.x * 2;

// ── Palette. Mirrors the site: near-black text, one warm accent. ───────────
const INK = rgb(0.09, 0.1, 0.11);
const MUTED = rgb(0.42, 0.44, 0.47);
const ACCENT = rgb(0.85, 0.42, 0.15);
const RULE = rgb(0.86, 0.87, 0.88);
const PANEL = rgb(0.97, 0.97, 0.975);
const WARN_BG = rgb(0.99, 0.955, 0.9);

/**
 * pdf-lib's standard fonts are WinAnsi-encoded and throw on anything outside
 * it. Typographic quotes and dashes are in WinAnsi, but folding them to ASCII
 * keeps the output predictable no matter what gets pasted into the content
 * file later.
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
    .replace(/[   ]/g, " ")
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

  /** Take a new page unless `height` still fits above the bottom margin. */
  need(height) {
    if (this.y - height < MARGIN.bottom) this.newPage();
  }

  space(amount) {
    this.y -= amount;
  }

  /**
   * Greedy word wrap against the real glyph widths of the chosen font.
   *
   * `preserve` keeps runs of spaces intact for lines that already fit, which is
   * what lets the monospaced credentials block stay column-aligned. Lines too
   * long to fit still fall through to normal wrapping.
   */
  wrap(text, font, size, width, { preserve = false } = {}) {
    const lines = [];
    for (const paragraph of ascii(text).split("\n")) {
      if (preserve && font.widthOfTextAtSize(paragraph, size) <= width) {
        lines.push(paragraph);
        continue;
      }
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

  /**
   * Draw wrapped text, breaking pages between lines. Returns nothing — the
   * cursor is left directly under the last line drawn.
   */
  text(content, opts = {}) {
    const {
      font = this.fonts.regular,
      size = 10.5,
      color = INK,
      leading = size * 1.5,
      x = MARGIN.x,
      width = CONTENT_WIDTH,
    } = opts;

    for (const line of this.wrap(content, font, size, width)) {
      this.need(leading);
      this.y -= leading;
      this.page.drawText(line, { x, y: this.y, size, font, color });
    }
  }

  rule(color = RULE) {
    this.need(10);
    this.y -= 6;
    this.page.drawLine({
      start: { x: MARGIN.x, y: this.y },
      end: { x: MARGIN.x + CONTENT_WIDTH, y: this.y },
      thickness: 0.75,
      color,
    });
  }

  /**
   * A tinted box sized to its own wrapped text. Drawn in one piece, so it moves
   * to the next page whole rather than splitting across the fold.
   */
  panel(
    content,
    {
      background = PANEL,
      accent = null,
      size = 9.5,
      font = this.fonts.regular,
      preserve = false,
    } = {},
  ) {
    const padX = 12;
    const padY = 10;
    const leading = size * 1.45;
    const innerWidth = CONTENT_WIDTH - padX * 2 - (accent ? 4 : 0);
    const lines = this.wrap(content, font, size, innerWidth, { preserve });
    const height = lines.length * leading + padY * 2;

    this.need(height + 6);
    this.y -= height;

    this.page.drawRectangle({
      x: MARGIN.x,
      y: this.y,
      width: CONTENT_WIDTH,
      height,
      color: background,
    });

    if (accent) {
      this.page.drawRectangle({
        x: MARGIN.x,
        y: this.y,
        width: 3,
        height,
        color: accent,
      });
    }

    let cursor = this.y + height - padY - size * 0.85;
    for (const line of lines) {
      this.page.drawText(line, {
        x: MARGIN.x + padX + (accent ? 4 : 0),
        y: cursor,
        size,
        font,
        color: INK,
      });
      cursor -= leading;
    }
  }

  /**
   * One list item: a marker in the gutter, wrapped body text hanging beside it.
   * `marker` is a bullet glyph or a step number.
   */
  listItem(marker, content, { markerColor = ACCENT, size = 10.5 } = {}) {
    const gutter = 22;
    const leading = size * 1.5;
    const lines = this.wrap(content, this.fonts.regular, size, CONTENT_WIDTH - gutter);

    lines.forEach((line, index) => {
      this.need(leading);
      this.y -= leading;
      if (index === 0) {
        this.page.drawText(ascii(marker), {
          x: MARGIN.x,
          y: this.y,
          size: size - 0.5,
          font: this.fonts.bold,
          color: markerColor,
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
    this.space(3);
  }

  /** Page numbers and the contact line, stamped once every page exists. */
  stampFooters(manual) {
    const total = this.pages.length;
    const left = ascii(`${manual.project} - User Guide`);
    const right = ascii(`${manualAuthor.name} - ${manualAuthor.email}`);

    this.pages.forEach((page, index) => {
      page.drawLine({
        start: { x: MARGIN.x, y: MARGIN.bottom - 16 },
        end: { x: MARGIN.x + CONTENT_WIDTH, y: MARGIN.bottom - 16 },
        thickness: 0.5,
        color: RULE,
      });
      page.drawText(left, {
        x: MARGIN.x,
        y: MARGIN.bottom - 30,
        size: 8,
        font: this.fonts.regular,
        color: MUTED,
      });

      const pageLabel = `${index + 1} / ${total}`;
      const labelWidth = this.fonts.regular.widthOfTextAtSize(pageLabel, 8);
      page.drawText(pageLabel, {
        x: MARGIN.x + CONTENT_WIDTH - labelWidth,
        y: MARGIN.bottom - 30,
        size: 8,
        font: this.fonts.regular,
        color: MUTED,
      });

      page.drawText(right, {
        x: MARGIN.x,
        y: MARGIN.bottom - 42,
        size: 8,
        font: this.fonts.regular,
        color: MUTED,
      });
    });
  }
}

function renderCover(doc, manual) {
  doc.text(manual.project.toUpperCase(), {
    font: doc.fonts.bold,
    size: 9,
    color: ACCENT,
    leading: 14,
  });
  doc.space(6);
  doc.text(manual.title, { font: doc.fonts.bold, size: 24, leading: 29 });
  doc.space(8);
  doc.text(manual.subtitle, { size: 11.5, color: MUTED, leading: 17 });
  doc.space(6);
  doc.text(`${manual.version}   |   ${manualAuthor.name}, ${manualAuthor.role}`, {
    size: 9,
    color: MUTED,
    leading: 14,
  });
  doc.rule();
  doc.space(14);
}

function renderEnvironments(doc, manual) {
  doc.text("Where to go", { font: doc.fonts.bold, size: 14, leading: 20 });
  doc.space(4);

  for (const env of manual.environments) {
    doc.text(env.label, { font: doc.fonts.bold, size: 10.5, leading: 16 });
    doc.text(env.url, { font: doc.fonts.mono, size: 9.5, color: ACCENT, leading: 15 });
    doc.text(env.note, { size: 9.5, color: MUTED, leading: 14 });
    doc.space(9);
  }
  doc.space(6);
}

function renderAccounts(doc, manual) {
  doc.text("Sign-in details", { font: doc.fonts.bold, size: 14, leading: 20 });
  doc.space(4);

  for (const account of manual.accounts) {
    doc.text(account.role, { font: doc.fonts.bold, size: 10.5, leading: 16 });
    doc.space(2);

    // Courier is monospaced, so padding the labels lines the values up.
    const labelWidth = Math.max(...account.fields.map((f) => f.label.length)) + 2;
    const body = account.fields
      .map((field) => `${`${field.label}:`.padEnd(labelWidth)} ${field.value}`)
      .join("\n");
    doc.panel(body, {
      accent: ACCENT,
      size: 10,
      font: doc.fonts.mono,
      preserve: true,
    });

    if (account.note) {
      doc.space(4);
      doc.text(account.note, { size: 9.5, color: MUTED, leading: 14 });
    }
    doc.space(11);
  }

  doc.panel(`Please read: ${manual.accountsNote}`, { background: WARN_BG, size: 9 });
  doc.space(16);
}

function renderSection(doc, section) {
  doc.need(60);
  doc.text(section.title, { font: doc.fonts.bold, size: 14, leading: 21 });
  doc.space(3);

  for (const block of section.blocks) {
    switch (block.kind) {
      case "text":
        doc.text(block.text, { leading: 15.5 });
        doc.space(8);
        break;

      case "steps":
        block.items.forEach((item, index) => {
          doc.listItem(`${index + 1}.`, item);
        });
        doc.space(6);
        break;

      case "bullets":
        block.items.forEach((item) => {
          doc.listItem("-", item);
        });
        doc.space(6);
        break;

      case "note":
        doc.panel(block.text, { accent: ACCENT, size: 9.5 });
        doc.space(10);
        break;

      default:
        throw new Error(`Unknown manual block: ${JSON.stringify(block)}`);
    }
  }

  doc.space(10);
}

async function buildManual(manual) {
  const pdf = await PDFDocument.create();
  const fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    mono: await pdf.embedFont(StandardFonts.Courier),
  };

  pdf.setTitle(ascii(manual.title));
  pdf.setSubject(ascii(manual.subtitle));
  pdf.setAuthor(manualAuthor.name);
  pdf.setCreator(`${manualAuthor.name} - portfolio`);

  const doc = new Doc(pdf, fonts);

  renderCover(doc, manual);
  renderEnvironments(doc, manual);
  renderAccounts(doc, manual);
  for (const section of manual.sections) renderSection(doc, section);

  doc.stampFooters(manual);

  const bytes = await pdf.save();
  const target = join(root, "public", manual.file.replace(/^\//, ""));
  await writeFile(target, bytes);
  return { target, pages: doc.pages.length, bytes: bytes.length };
}

async function main() {
  await mkdir(outDir, { recursive: true });

  for (const manual of manuals) {
    const { target, pages, bytes } = await buildManual(manual);
    console.log(
      `  ${manual.slug.padEnd(28)} ${String(pages).padStart(2)} pages  ${(bytes / 1024).toFixed(0)} KB  ->  ${target.slice(root.length + 1)}`,
    );
  }

  console.log(`\nGenerated ${manuals.length} user guides.`);
}

await main();
