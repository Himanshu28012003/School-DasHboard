import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { pool } from "../db/pool";

// ─── helpers ───────────────────────────────────────────────────────────────

const gradePoints: Record<string, string> = {
  "A+": "Outstanding",
  A: "Excellent",
  B: "Good",
  C: "Average",
  D: "Below Average",
};

const gradeColor = (grade: string): [number, number, number] => {
  switch (grade) {
    case "A+": return [5, 150, 105];    // emerald
    case "A":  return [22, 163, 74];    // green
    case "B":  return [37, 99, 235];    // blue
    case "C":  return [217, 119, 6];    // amber
    default:   return [220, 38, 38];    // red
  }
};

// Compute rank of one student within an array (sorted ascending by percentage)
const computeRank = (
  targetId: number,
  rows: { id: number; percentage: string | number }[]
): number | null => {
  const sorted = [...rows].sort(
    (a, b) => Number(b.percentage) - Number(a.percentage)
  );
  let rank = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && Number(sorted[i].percentage) !== Number(sorted[i - 1].percentage)) {
      rank = i + 1;
    }
    if (sorted[i].id === targetId) return rank;
  }
  return null;
};

// ─── draw helpers ──────────────────────────────────────────────────────────

function drawRect(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: [number, number, number],
  radius = 6
) {
  doc.save().roundedRect(x, y, w, h, radius).fill(fill).restore();
}

function drawCell(
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: {
    bg?: [number, number, number];
    fg?: [number, number, number];
    bold?: boolean;
    fontSize?: number;
    align?: "left" | "center" | "right";
  } = {}
) {
  const {
    bg,
    fg = [30, 30, 30],
    bold = false,
    fontSize = 10,
    align = "center",
  } = opts;

  if (bg) {
    doc.save().rect(x, y, w, h).fill(bg).restore();
  }

  doc
    .save()
    .fontSize(fontSize)
    .font(bold ? "Helvetica-Bold" : "Helvetica")
    .fillColor(fg)
    .text(text, x + 4, y + (h - fontSize) / 2, { width: w - 8, align })
    .restore();
}

// ─── main controller ───────────────────────────────────────────────────────

export const downloadResultPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const id = Number(studentId);

    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid studentId" });
      return;
    }

    // 1) Fetch the target student with marks
    const studentResult = await pool.query(
      `SELECT s.id, s.name, s.roll_number AS "rollNumber",
              s.class AS "className", s.section,
              m.maths, m.science, m.english, m.computer,
              m.total, m.percentage, m.grade
       FROM students s
       LEFT JOIN marks m ON m.student_id = s.id
       WHERE s.id = $1`,
      [id]
    );

    if (studentResult.rowCount === 0) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    const s = studentResult.rows[0];

    if (s.total === null || s.total === undefined) {
      res.status(404).json({ message: "Marks not entered yet for this student" });
      return;
    }

    // 2) Fetch peers for rank computation
    const allClass = await pool.query(
      `SELECT s.id, m.percentage
       FROM students s JOIN marks m ON m.student_id = s.id
       WHERE s.class = $1`,
      [s.className]
    );

    const allSection = await pool.query(
      `SELECT s.id, m.percentage
       FROM students s JOIN marks m ON m.student_id = s.id
       WHERE s.class = $1 AND s.section = $2`,
      [s.className, s.section]
    );

    const allSchool = await pool.query(
      `SELECT s.id, m.percentage
       FROM students s JOIN marks m ON m.student_id = s.id`
    );

    const overallRank  = computeRank(id, allSchool.rows)   ?? "-";
    const classRank    = computeRank(id, allClass.rows)    ?? "-";
    const sectionRank  = computeRank(id, allSection.rows)  ?? "-";

    const percentage   = Number(s.percentage);
    const grade: string = s.grade ?? "D";
    const [gr, gg, gb] = gradeColor(grade);
    const subjects = [
      { label: "Mathematics",        marks: s.maths,    max: 100 },
      { label: "Science",            marks: s.science,  max: 100 },
      { label: "English",            marks: s.english,  max: 100 },
      { label: "Computer Science",   marks: s.computer, max: 100 },
    ];

    // ── Build PDF ────────────────────────────────────────────────────────────
    const doc = new PDFDocument({ size: "A4", margin: 0 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="result_${s.name.replace(/\s+/g, "_")}_${s.rollNumber}.pdf"`
    );
    doc.pipe(res);

    const PW = 595.28;
    const PH = 841.89;
    const MARGIN = 40;
    const CONTENT_W = PW - MARGIN * 2;

    // ── Background ───────────────────────────────────────────────────────────
    doc.rect(0, 0, PW, PH).fill([248, 250, 252]); // slate-50

    // ── Top header banner ────────────────────────────────────────────────────
    doc.rect(0, 0, PW, 110).fill([67, 56, 202]); // indigo-700

    // Decorative blobs on header
    doc.save().opacity(0.15).circle(PW - 60, 20, 80).fill([255, 255, 255]).restore();
    doc.save().opacity(0.1).circle(30, 90, 60).fill([255, 255, 255]).restore();

    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor([255, 255, 255])
      .text("Student Result Card", MARGIN, 28, { width: CONTENT_W, align: "center" });

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor([199, 210, 254]) // indigo-200
      .text("Academic Performance Report", MARGIN, 58, { width: CONTENT_W, align: "center" });

    const issueDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
    });
    doc
      .fontSize(9)
      .fillColor([199, 210, 254])
      .text(`Issued: ${issueDate}`, MARGIN, 80, { width: CONTENT_W, align: "center" });

    // ── Grade badge (top-right corner of header) ─────────────────────────────
    const badgeX = PW - MARGIN - 70;
    drawRect(doc, badgeX, 18, 70, 70, [255, 255, 255], 35);
    doc
      .fontSize(28)
      .font("Helvetica-Bold")
      .fillColor([gr, gg, gb])
      .text(grade, badgeX, 30, { width: 70, align: "center" });
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor([100, 116, 139])
      .text(gradePoints[grade] ?? "", badgeX, 62, { width: 70, align: "center" });

    let curY = 125;

    // ── Student info card ────────────────────────────────────────────────────
    drawRect(doc, MARGIN, curY, CONTENT_W, 90, [255, 255, 255]);

    const infoFields = [
      { label: "Student Name", value: s.name },
      { label: "Roll Number",  value: String(s.rollNumber) },
      { label: "Class",        value: `${s.className} — Section ${s.section}` },
    ];

    const colW = CONTENT_W / 3;
    infoFields.forEach(({ label, value }, i) => {
      const fx = MARGIN + i * colW + 16;
      doc
        .fontSize(8).font("Helvetica").fillColor([100, 116, 139])
        .text(label.toUpperCase(), fx, curY + 18, { width: colW - 20 });
      doc
        .fontSize(13).font("Helvetica-Bold").fillColor([30, 41, 59])
        .text(value, fx, curY + 32, { width: colW - 20 });
    });

    // Thin divider inside card
    doc.save()
       .moveTo(MARGIN + colW, curY + 12).lineTo(MARGIN + colW, curY + 78)
       .moveTo(MARGIN + colW * 2, curY + 12).lineTo(MARGIN + colW * 2, curY + 78)
       .strokeColor([226, 232, 240]).lineWidth(1).stroke().restore();

    curY += 105;

    // ── Marks table ──────────────────────────────────────────────────────────
    const tCols = [CONTENT_W * 0.46, CONTENT_W * 0.18, CONTENT_W * 0.18, CONTENT_W * 0.18];
    const tHeaders = ["Subject", "Marks", "Max Marks", "Status"];
    const rowH = 34;

    // Table header
    let cx = MARGIN;
    tCols.forEach((cw, ci) => {
      drawCell(doc, tHeaders[ci], cx, curY, cw, rowH, {
        bg: [67, 56, 202],
        fg: [255, 255, 255],
        bold: true,
        fontSize: 10,
      });
      cx += cw;
    });
    curY += rowH;

    // Subject rows
    subjects.forEach(({ label, marks, max }, idx) => {
      const rowBg: [number, number, number] = idx % 2 === 0 ? [255, 255, 255] : [245, 247, 250];
      const pct = Math.round((marks / max) * 100);
      const status = pct >= 33 ? "Pass" : "Fail";
      const statusColor: [number, number, number] = pct >= 33 ? [5, 150, 105] : [220, 38, 38];

      let rcx = MARGIN;
      const cells = [label, String(marks), `${max}`, status];
      cells.forEach((val, ci) => {
        drawCell(doc, val, rcx, curY, tCols[ci], rowH, {
          bg: ci === 3 ? rowBg : rowBg,
          fg: ci === 3 ? statusColor : ci === 0 ? [30, 41, 59] : [51, 65, 85],
          bold: ci === 3,
          fontSize: 10,
          align: ci === 0 ? "left" : "center",
        });
        rcx += tCols[ci];
      });

      // Progress bar inside Marks column
      const barX = MARGIN + tCols[0] + 4;
      const barY = curY + rowH - 8;
      const barW = tCols[1] - 8;
      const barFill = Math.round((marks / max) * barW);
      doc.save()
         .rect(barX, barY, barW, 3).fill([226, 232, 240])
         .rect(barX, barY, barFill, 3).fill([67, 56, 202])
         .restore();

      curY += rowH;
    });

    // Table bottom border
    doc.save()
       .moveTo(MARGIN, curY).lineTo(MARGIN + CONTENT_W, curY)
       .strokeColor([226, 232, 240]).lineWidth(1).stroke().restore();

    curY += 18;

    // ── Result summary row ───────────────────────────────────────────────────
    const summaryBoxes = [
      { label: "Total Marks", value: `${s.total} / 400` },
      { label: "Percentage",  value: `${percentage}%` },
      { label: "Grade",       value: grade, colored: true },
      { label: "Result",      value: percentage >= 33 ? "PASS" : "FAIL", pass: percentage >= 33 },
    ];

    const boxW = CONTENT_W / 4;
    summaryBoxes.forEach(({ label, value, colored, pass }, i) => {
      const bx = MARGIN + i * boxW;
      drawRect(doc, bx + 3, curY, boxW - 6, 70, [255, 255, 255]);

      let valColor: [number, number, number] = [30, 41, 59];
      if (colored) valColor = [gr, gg, gb];
      if (pass === true)  valColor = [5, 150, 105];
      if (pass === false) valColor = [220, 38, 38];

      doc.fontSize(8).font("Helvetica").fillColor([100, 116, 139])
         .text(label.toUpperCase(), bx + 3, curY + 14, { width: boxW - 6, align: "center" });
      doc.fontSize(18).font("Helvetica-Bold").fillColor(valColor)
         .text(value, bx + 3, curY + 28, { width: boxW - 6, align: "center" });
    });

    curY += 85;

    // ── Ranks card ───────────────────────────────────────────────────────────
    drawRect(doc, MARGIN, curY, CONTENT_W, 80, [255, 255, 255]);

    doc.fontSize(10).font("Helvetica-Bold").fillColor([67, 56, 202])
       .text("🏆  Rankings", MARGIN + 16, curY + 14, { width: CONTENT_W - 32 });

    const rankCols = [
      { label: "Overall Rank (School)", value: `#${overallRank}` },
      { label: "Class Rank",            value: `#${classRank}` },
      { label: "Section Rank",          value: `#${sectionRank}` },
    ];

    const rankColW = (CONTENT_W - 32) / 3;
    rankCols.forEach(({ label, value }, i) => {
      const rx = MARGIN + 16 + i * rankColW;
      doc.fontSize(8).font("Helvetica").fillColor([100, 116, 139])
         .text(label, rx, curY + 34, { width: rankColW });
      doc.fontSize(18).font("Helvetica-Bold").fillColor([67, 56, 202])
         .text(value, rx, curY + 46, { width: rankColW });
    });

    curY += 95;

    // ── Subject-wise bar chart (visual) ───────────────────────────────────────
    drawRect(doc, MARGIN, curY, CONTENT_W, 120, [255, 255, 255]);

    doc.fontSize(10).font("Helvetica-Bold").fillColor([30, 41, 59])
       .text("Subject Performance", MARGIN + 16, curY + 14);

    const chartH = 55;
    const chartY = curY + 40;
    const subBarW = 36;
    const chartSpacing = (CONTENT_W - 60) / subjects.length;

    subjects.forEach(({ label, marks, max }, i) => {
      const bx = MARGIN + 30 + i * chartSpacing;
      const fillH = Math.round((marks / max) * chartH);
      const isEmpty = fillH === 0;

      // Background bar
      doc.save().rect(bx, chartY, subBarW, chartH).fill([235, 238, 245]).restore();
      // Filled bar
      if (!isEmpty) {
        doc.save()
           .rect(bx, chartY + chartH - fillH, subBarW, fillH)
           .fill([67, 56, 202]).restore();
      }
      // Mark label on top
      doc.fontSize(8).font("Helvetica-Bold").fillColor([67, 56, 202])
         .text(String(marks), bx, chartY - 12, { width: subBarW, align: "center" });
      // Subject short name below
      const short = label.split(" ")[0];
      doc.fontSize(7).font("Helvetica").fillColor([100, 116, 139])
         .text(short, bx, chartY + chartH + 5, { width: subBarW, align: "center" });
    });

    curY += 135;

    // ── Footer ────────────────────────────────────────────────────────────────
    doc.rect(0, PH - 48, PW, 48).fill([67, 56, 202]);
    doc.fontSize(9).font("Helvetica").fillColor([199, 210, 254])
       .text(
         "This is a computer-generated report card and does not require a signature.",
         MARGIN, PH - 32, { width: CONTENT_W, align: "center" }
       );

    doc.end();
  } catch (error: any) {
    res.status(500).json({ message: "Failed to generate PDF", error: error.message });
  }
};
