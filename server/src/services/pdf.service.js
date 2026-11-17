import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { getTemplateConfig } from "../config/templates.js";
import { getTodayDisplayDate } from "../utils/date.js";
import { maskEmail } from "../utils/maskEmail.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, "../..");
const templateRoot = path.join(serverRoot, "templates");
const fontRoot = path.join(serverRoot, "fonts");

const COLORS = {
  ink: rgb(16 / 255, 24 / 255, 39 / 255),
  body: rgb(32 / 255, 43 / 255, 60 / 255)
};

function assertText(value, field, max = 120) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }
  const cleaned = value.trim();
  if (cleaned.length > max) throw new Error(`${field} must be ${max} characters or fewer.`);
  return cleaned;
}

function supportsText(face, text) {
  return Array.from(text).every((character) => {
    const glyph = face.glyphForCodePoint(character.codePointAt(0));
    return glyph && glyph.id !== 0;
  });
}

function chooseFont(text, preferredFont, fallbackFont, preferredFace) {
  return supportsText(preferredFace, text) ? preferredFont : fallbackFont;
}

function fitSize(font, text, startSize, maxWidth, minSize = 7) {
  let size = startSize;
  while (size > minSize && font.widthOfTextAtSize(text, size) > maxWidth) size -= 0.25;
  return size;
}

function drawTextFit(page, text, x, baselineY, maxWidth, font, size, color, minSize = 7) {
  const fitted = fitSize(font, text, size, maxWidth, minSize);
  page.drawText(text, { x, y: baselineY, size: fitted, font, color, maxWidth });
}

function coverField(page, { x, top, width, height, text, font, size, color, baselineOffset = 8 }) {
  const pageHeight = page.getHeight();
  page.drawRectangle({
    x, y: pageHeight - top - height, width, height,
    color: rgb(1, 1, 1),
    borderWidth: 0
  });
  const fitted = fitSize(font, text, size, width - 2, 7);
  page.drawText(text, {
    x: x + 1,
    y: pageHeight - top - height + baselineOffset,
    size: fitted,
    font,
    color
  });
}

function replaceField(page, { x, top, width, height, text, font, size, color, minSize = 7 }) {
  const pageHeight = page.getHeight();
  page.drawRectangle({
    x,
    y: pageHeight - top - height,
    width,
    height,
    color: rgb(1, 1, 1),
    borderWidth: 0
  });
  const fitted = fitSize(font, text, size, width - 2, minSize);
  // Text baseline is positioned to align with the original Poppins text.
  const baseline = pageHeight - top - height + Math.max(1.2, (height - fitted) / 2) + 1.5;
  page.drawText(text, {
    x,
    y: baseline,
    size: fitted,
    font,
    color,
    maxWidth: width
  });
}

function validatePayload(payload, config) {
  const groupName = assertText(payload.groupName, "Group / batch name", 90);
  if (!Array.isArray(payload.interns) || payload.interns.length !== config.internCount) {
    throw new Error(`The ${config.internCount}-intern template requires exactly ${config.internCount} intern records.`);
  }

  const interns = payload.interns.map((intern, index) => {
    const n = index + 1;
    const name = assertText(intern.name, `Intern ${n} name`, 90);
    const internId = assertText(intern.internId ?? intern.internID, `Intern ${n} ID`, 40);
    const email = assertText(intern.email, `Intern ${n} email`, 160);
    const domain = assertText(intern.domain, `Intern ${n} domain`, 70);
    const maskedEmail = maskEmail(email);
    return { name, internId, email, maskedEmail, domain };
  });

  return { groupName, interns };
}

export async function generateLorPdf(payload) {
  const config = getTemplateConfig(payload.template);
  if (!config) throw new Error("Choose one of the available templates: 3, 6, or 8.");

  const { groupName, interns } = validatePayload(payload, config);
  const displayDate = getTodayDisplayDate();
  const generatedAt = new Date();

  const sourceBytes = await fs.readFile(path.join(templateRoot, config.file));
  const pdfDoc = await PDFDocument.load(sourceBytes);
  pdfDoc.registerFontkit(fontkit);

  const regularBytes = await fs.readFile(path.join(fontRoot, "Poppins-Regular-Subset.ttf"));
  const boldBytes = await fs.readFile(path.join(fontRoot, "Poppins-Bold-Subset.ttf"));
  const regularFont = await pdfDoc.embedFont(regularBytes, { subset: true });
  const boldFont = await pdfDoc.embedFont(boldBytes, { subset: true });
  const fallbackRegularBytes = await fs.readFile(path.join(fontRoot, "Fallback-Regular.ttf"));
  const fallbackBoldBytes = await fs.readFile(path.join(fontRoot, "Fallback-Bold.ttf"));
  const fallbackRegularFont = await pdfDoc.embedFont(fallbackRegularBytes, { subset: true });
  const fallbackBoldFont = await pdfDoc.embedFont(fallbackBoldBytes, { subset: true });
  const regularFace = fontkit.create(regularBytes);
  const boldFace = fontkit.create(boldBytes);

  // PAGE 1: the cover is a rasterized original template. Only the two
  // requested fields are covered and redrawn; the original QR and layout remain.
  const cover = pdfDoc.getPage(0);
  coverField(cover, {
    x: 306, top: 551, width: 175, height: 18,
    text: groupName, font: chooseFont(groupName, regularFont, fallbackRegularFont, regularFace), size: 9.2, color: COLORS.body, baselineOffset: 8
  });
  coverField(cover, {
    x: 59, top: 608, width: 115, height: 22,
    text: displayDate, font: chooseFont(displayDate, regularFont, fallbackRegularFont, regularFace), size: 9.2, color: COLORS.body, baselineOffset: 8.5
  });

  // Selection register pages: the 8-intern template has a continuation
  // page, so the last three intern records are updated on physical page 4.
  for (const registerPage of config.registerPages) {
    const page = pdfDoc.getPage(registerPage.pageIndex);
    for (let localIndex = 0; localIndex < registerPage.count; localIndex += 1) {
      const internIndex = registerPage.firstIntern + localIndex;
      const intern = interns[internIndex];
      const row = config.rows[internIndex];
      const nameText = `${String(internIndex + 1).padStart(2, "0")}   ${intern.name}`;

      replaceField(page, {
        x: 56.5, top: row.nameY - 1.2, width: 246, height: 18,
        text: nameText, font: chooseFont(nameText, boldFont, fallbackBoldFont, boldFace), size: 11, color: COLORS.ink, minSize: 8
      });
      replaceField(page, {
        x: 56.5, top: row.domainY - 1.2, width: 245, height: 14,
        text: intern.domain, font: chooseFont(intern.domain, regularFont, fallbackRegularFont, regularFace), size: 8.5, color: COLORS.body, minSize: 7
      });
      replaceField(page, {
        x: 56.5, top: row.idY - 1.2, width: 245, height: 14,
        text: intern.internId, font: chooseFont(intern.internId, boldFont, fallbackBoldFont, boldFace), size: 8, color: rgb(0, 0, 0), minSize: 7
      });
      replaceField(page, {
        x: 324.5, top: row.emailY - 1.2, width: 210, height: 14,
        text: intern.maskedEmail, font: chooseFont(intern.maskedEmail, regularFont, fallbackRegularFont, regularFace), size: 8.5, color: COLORS.body, minSize: 7
      });
    }
  }

  // Declaration date: page 4 for 3/6 templates; page 5 for 8-intern.
  const declaration = pdfDoc.getPage(config.declarationPageIndex);
  replaceField(declaration, {
    x: 304.5, top: 581.4, width: 125, height: 17,
    text: displayDate, font: chooseFont(displayDate, regularFont, fallbackRegularFont, regularFace), size: 10, color: COLORS.body, minSize: 8
  });

  const pdfBytes = await pdfDoc.save();
  return {
    pdfBytes,
    displayDate,
    generatedAt,
    groupName,
    interns: interns.map(({ name, internId, maskedEmail, domain }) => ({
      name, internId, maskedEmail, domain
    }))
  };
}
