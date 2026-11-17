import express from "express";
import { TEMPLATE_CONFIG } from "../config/templates.js";
import { generateLorPdf } from "../services/pdf.service.js";

const router = express.Router();

router.get("/templates", (_req, res) => {
  res.json({
    templates: Object.values(TEMPLATE_CONFIG).map(
      ({ id, label, internCount, file }) => ({
        id,
        label,
        internCount,
        file,
      }),
    ),
  });
});

async function generateHandler(req, res) {
  try {
    const result = await generateLorPdf(req.body);
    const template = String(req.body.template);
    const safeBatch = result.groupName
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 45);
    const fileName = `LOR-Interns-${safeBatch || "Batch"}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", result.pdfBytes.length);
    res.send(Buffer.from(result.pdfBytes));
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message || "PDF generation failed." });
  }
}

router.post("/generate", generateHandler);
export default router;
