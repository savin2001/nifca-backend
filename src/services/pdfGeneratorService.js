// src/services/pdfGeneratorService.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// =====================================================
// Design Tokens
// =====================================================
const C = {
  // Brand colors (from tailwind config)
  navy: "#800020",        // NIFCA primary burgundy — dark headings, cover bars
  primary: "#800020",     // NIFCA primary burgundy — org name, titles
  accent: "#205473",      // NIFCA secondary blue — accent bars, highlights
  text: "#1E293B",        // Body text
  secondary: "#5A7A8F",   // Muted secondary (lighter tint of #205473)
  muted: "#94A3B8",       // Very muted helper text
  border: "#E2E8F0",      // Table/card borders
  divider: "#F1F5F9",     // Light dividers
  surface: "#F8FAFC",     // Light surface backgrounds
  white: "#FFFFFF",
  green: "#059669",
  greenBg: "#ECFDF5",
  red: "#DC2626",
  redBg: "#FEF2F2",
  amber: "#D97706",
  amberBg: "#FFFBEB",
  blue: "#205473",        // Use brand secondary instead of generic blue
  blueBg: "#EBF2F7",     // Light tint of brand secondary
};

const M = { top: 72, bottom: 56, left: 72, right: 72 };
const CW = 595 - M.left - M.right; // 451pt usable width

// =====================================================
// Service
// =====================================================
const pdfGeneratorService = {
  async generateApplicationPdf(application, sectionData, documents) {
    return new Promise((resolve, reject) => {
      try {
        const pdfsDir = path.join(__dirname, "../assets/pdfs");
        if (!fs.existsSync(pdfsDir)) {
          fs.mkdirSync(pdfsDir, { recursive: true });
        }

        const filename = `application_${application.reference_number || application.id}_${Date.now()}.pdf`;
        const filePath = path.join(pdfsDir, filename);
        const relativePath = `assets/pdfs/${filename}`;

        const doc = new PDFDocument({
          size: "A4",
          margins: { top: M.top, bottom: M.bottom, left: M.left, right: M.right },
          bufferPages: true,
          info: {
            Title: `NIFCA Application - ${application.reference_number || application.id}`,
            Author: "Nairobi International Financial Centre Authority",
            Subject: application.applicationType?.name || "Application",
            Creator: "NIFCA Application Portal",
          },
        });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Page 1: Cover
        this._coverPage(doc, application);

        // Page 2+: Content
        doc.addPage();
        this._summarySection(doc, application);
        this._contentSections(doc, application.sections, sectionData);
        this._documentsSection(doc, documents);
        this._declarationSection(doc, application);

        // Stamp headers + footers on all pages
        // Temporarily remove bottom margin to prevent auto-pagination
        // when rendering footer text below the normal content boundary
        const range = doc.bufferedPageRange();
        for (let i = 0; i < range.count; i++) {
          doc.switchToPage(i);
          const savedMargin = doc.page.margins.bottom;
          doc.page.margins.bottom = 0;
          if (i === 0) {
            this._coverFooter(doc);
          } else {
            this._runningHeader(doc, application);
            this._runningFooter(doc, i + 1, range.count);
          }
          doc.page.margins.bottom = savedMargin;
        }

        doc.end();
        stream.on("finish", () => resolve(relativePath));
        stream.on("error", (err) => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  },

  // ==========================================================================
  //  COVER PAGE
  // ==========================================================================
  _coverPage(doc, app) {
    const pw = doc.page.width;
    const ph = doc.page.height;

    // Top accent bar
    doc.rect(0, 0, pw, 4).fill(C.accent);

    // Logo
    const logoPath = path.join(__dirname, "../assets/nifca.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, pw / 2 - 36, 72, { width: 72 });
    }

    // Institution name
    doc
      .font("Helvetica-Bold").fontSize(10).fillColor(C.primary)
      .text("NAIROBI INTERNATIONAL FINANCIAL CENTRE", M.left, 164, {
        width: CW, align: "center", characterSpacing: 1.8,
      });
    doc
      .font("Helvetica").fontSize(8.5).fillColor(C.secondary)
      .text("AUTHORITY", M.left, 180, {
        width: CW, align: "center", characterSpacing: 3,
      });

    // Thin divider
    doc.strokeColor(C.border).lineWidth(0.5)
      .moveTo(pw / 2 - 50, 204).lineTo(pw / 2 + 50, 204).stroke();

    // Title
    doc
      .font("Helvetica-Bold").fontSize(24).fillColor(C.navy)
      .text("Application", M.left, 226, { width: CW, align: "center" });
    doc
      .font("Helvetica").fontSize(11).fillColor(C.secondary)
      .text("for Admission and Licensing", M.left, 258, { width: CW, align: "center" });

    // Application type pill
    if (app.applicationType?.name) {
      const typeName = app.applicationType.name;
      const pillW = doc.font("Helvetica-Bold").fontSize(9).widthOfString(typeName) + 28;
      const pillX = pw / 2 - pillW / 2;
      doc.roundedRect(pillX, 284, pillW, 24, 12)
        .lineWidth(1).strokeColor(C.accent).stroke();
      doc.font("Helvetica-Bold").fontSize(9).fillColor(C.accent)
        .text(typeName, pillX, 291, { width: pillW, align: "center" });
    }

    // Reference card
    const cardW = 260;
    const cardH = 64;
    const cardX = pw / 2 - cardW / 2;
    const cardY = 332;

    doc.roundedRect(cardX, cardY, cardW, cardH, 6)
      .lineWidth(0.8).strokeColor(C.border).stroke();
    doc.rect(cardX, cardY, 4, cardH).fill(C.accent);

    doc.font("Helvetica").fontSize(7.5).fillColor(C.muted)
      .text("REFERENCE NUMBER", cardX + 18, cardY + 14, { width: cardW - 36 });
    doc.font("Helvetica-Bold").fontSize(18).fillColor(C.navy)
      .text(app.reference_number || `#${app.id}`, cardX + 18, cardY + 30, { width: cardW - 36 });

    // Status badge
    const statusText = (app.status || "draft").toUpperCase().replace(/_/g, " ");
    const { color: sc, bg: sb } = this._statusStyle(app.status);
    const badgeW = doc.font("Helvetica-Bold").fontSize(8.5).widthOfString(statusText) + 26;
    const badgeX = pw / 2 - badgeW / 2;
    const badgeY = cardY + cardH + 16;
    doc.roundedRect(badgeX, badgeY, badgeW, 22, 11).fill(sb);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(sc)
      .text(statusText, badgeX, badgeY + 6, { width: badgeW, align: "center" });

    // Key details grid
    const gridY = 470;
    const details = [
      ["Applicant", app.client?.username || "N/A"],
      ["Email", app.client?.email || "N/A"],
      ["Application Type", app.applicationType?.name || "N/A"],
      ["Date Submitted", app.submitted_at ? this._fmtDate(app.submitted_at) : "Not yet submitted"],
      ["Date Generated", this._fmtDate(new Date())],
    ];

    let gy = gridY;
    for (let i = 0; i < details.length; i++) {
      const [label, value] = details[i];
      if (i % 2 === 0) {
        doc.rect(M.left + 40, gy - 3, CW - 80, 20).fill(C.surface);
      }
      doc.font("Helvetica").fontSize(8).fillColor(C.muted)
        .text(label, M.left + 50, gy + 1, { width: 130 });
      doc.font("Helvetica-Bold").fontSize(8).fillColor(C.text)
        .text(value, M.left + 185, gy + 1, { width: CW - 235 });
      gy += 22;
    }

    // Confidentiality notice
    const noticeY = ph - 108;
    doc.font("Helvetica").fontSize(6.5).fillColor(C.muted)
      .text(
        "CONFIDENTIAL \u2014 This document contains proprietary information submitted to the Nairobi International Financial Centre Authority. " +
        "Unauthorised disclosure, copying, or distribution is strictly prohibited.",
        M.left + 40, noticeY, { width: CW - 80, align: "center", lineGap: 2 }
      );

    // Bottom bands
    doc.rect(0, ph - 8, pw, 4).fill(C.accent);
    doc.rect(0, ph - 4, pw, 4).fill(C.navy);
  },

  // ==========================================================================
  //  APPLICATION SUMMARY (starts page 2)
  // ==========================================================================
  _summarySection(doc, app) {
    doc.y = M.top + 16;
    this._sectionTitle(doc, "Application Overview");

    // ---- Metric cards row ----
    const cardsY = doc.y;
    const cardH = 54;
    const gap = 10;
    const metrics = [
      { label: "STATUS", value: (app.status || "Draft").replace(/_/g, " ").toUpperCase(), isStatus: true, status: app.status },
      { label: "COMPLETION", value: `${app.completion_percentage || 0}%` },
      { label: "SUBMITTED", value: app.submitted_at ? this._fmtDateCompact(app.submitted_at) : "\u2014" },
      { label: "APP. TYPE", value: app.applicationType?.code || "N/A" },
    ];

    const cardW = (CW - gap * (metrics.length - 1)) / metrics.length;
    let cx = M.left;

    for (const m of metrics) {
      const bg = m.isStatus ? this._statusStyle(m.status).bg : C.surface;
      doc.roundedRect(cx, cardsY, cardW, cardH, 4).fill(bg);

      // Top accent stripe
      if (m.isStatus) {
        doc.rect(cx + 2, cardsY + 1, cardW - 4, 2.5).fill(this._statusStyle(m.status).color);
      } else {
        doc.rect(cx + 2, cardsY + 1, cardW - 4, 2.5).fill(C.accent);
      }

      // Value
      const vc = m.isStatus ? this._statusStyle(m.status).color : C.navy;
      doc.font("Helvetica-Bold").fontSize(14).fillColor(vc)
        .text(m.value, cx + 10, cardsY + 13, { width: cardW - 20, lineBreak: false });

      // Label
      doc.font("Helvetica").fontSize(6.5).fillColor(C.muted)
        .text(m.label, cx + 10, cardsY + 36, { width: cardW - 20, lineBreak: false });

      cx += cardW + gap;
    }

    doc.y = cardsY + cardH + 18;

    // ---- Details table ----
    const rows = [
      ["Reference Number", app.reference_number || "N/A"],
      ["Application Type", app.applicationType?.name || "N/A"],
      ["Applicant", app.client?.username || "N/A"],
      ["Email", app.client?.email || "N/A"],
      ["Date Created", this._fmtDate(app.created_at)],
      ["Date Submitted", app.submitted_at ? this._fmtDate(app.submitted_at) : "Pending"],
    ];

    this._dataTable(doc, rows);

    // Review comments
    if (app.review_comments) {
      doc.moveDown(1);
      this._textBlock(doc, "Review Comments", app.review_comments);
    }
  },

  // ==========================================================================
  //  APPLICATION SECTIONS
  // ==========================================================================
  _contentSections(doc, sections, sectionData) {
    if (!sections || sections.length === 0) return;

    let displayNum = 0;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      // Categorise fields BEFORE rendering header
      const data = sectionData.find((sd) => sd.section_id === section.id);
      const fieldData = data?.field_data || {};

      const tableRows = [];
      const numberFields = [];
      const longTextFields = [];

      if (section.fields && section.fields.length > 0) {
        for (const field of section.fields) {
          if (field.field_type === "file") continue;
          const value = fieldData[field.field_name];

          if (field.field_type === "number" && value !== undefined && value !== null && value !== "") {
            numberFields.push(field);
          } else if (field.field_type === "textarea" && value && String(value).length > 80) {
            longTextFields.push(field);
          } else {
            tableRows.push([field.field_label, this._fmtFieldValue(field, value)]);
          }
        }
      }

      // Skip sections with no renderable content (e.g. file-upload-only sections)
      if (tableRows.length === 0 && numberFields.length === 0 && longTextFields.length === 0) {
        continue;
      }

      displayNum++;
      const num = String(displayNum).padStart(2, "0");

      this._ensureSpace(doc, 120);
      doc.moveDown(1.2);
      this._sectionHeader(doc, num, section.name);

      // Description
      if (section.description) {
        doc.font("Helvetica").fontSize(8).fillColor(C.secondary)
          .text(section.description, M.left, doc.y, { width: CW, lineGap: 1 });
        doc.moveDown(0.5);
      }

      // Render table fields
      if (tableRows.length > 0) {
        this._dataTable(doc, tableRows);
      }

      // Render financial metric cards
      if (numberFields.length > 0) {
        doc.moveDown(0.6);
        this._financialCards(doc, numberFields, fieldData);
      }

      // Render long text blocks
      for (const field of longTextFields) {
        doc.moveDown(0.5);
        this._textBlock(doc, field.field_label, String(fieldData[field.field_name] || ""));
      }
    }
  },

  // ==========================================================================
  //  SUPPORTING DOCUMENTS
  // ==========================================================================
  _documentsSection(doc, documents) {
    if (!documents || documents.length === 0) return;

    this._ensureSpace(doc, 100);
    doc.moveDown(1.2);
    this._sectionTitle(doc, "Supporting Documents");

    doc.font("Helvetica").fontSize(8.5).fillColor(C.secondary)
      .text(`${documents.length} document${documents.length !== 1 ? "s" : ""} submitted with this application.`, M.left, doc.y, { width: CW });
    doc.moveDown(0.7);

    // Table header
    const cols = [24, 175, 100, 58, 94]; // #, Name, Type, Size, Date
    const hY = doc.y;
    doc.roundedRect(M.left, hY, CW, 24, 3).fill(C.navy);

    const headers = ["#", "Document Name", "Type", "Size", "Uploaded"];
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(C.white);
    let hx = M.left;
    for (let c = 0; c < headers.length; c++) {
      doc.text(headers[c], hx + 6, hY + 8, { width: cols[c] - 12, lineBreak: false });
      hx += cols[c];
    }
    doc.y = hY + 24;

    // Rows
    for (let i = 0; i < documents.length; i++) {
      const d = documents[i];

      // Measure type text to determine row height
      const typeText = this._fmtDocType(d.document_type);
      doc.font("Helvetica").fontSize(7.5);
      const typeH = doc.heightOfString(typeText, { width: cols[2] - 12 });
      const rH = Math.max(22, typeH + 10);

      this._ensureSpace(doc, rH);
      const rY = doc.y;

      // Alternating bg
      if (i % 2 === 0) {
        doc.rect(M.left, rY, CW, rH).fill(C.surface);
      }

      // Bottom border
      doc.strokeColor(C.divider).lineWidth(0.3)
        .moveTo(M.left, rY + rH).lineTo(M.left + CW, rY + rH).stroke();

      const size = d.file_size > 1048576
        ? `${(d.file_size / 1048576).toFixed(1)} MB`
        : `${Math.round(d.file_size / 1024)} KB`;

      const vals = [
        `${i + 1}`,
        d.original_filename || "Unknown",
        typeText,
        size,
        this._fmtDateCompact(d.created_at),
      ];

      const textY = rY + Math.max(6, (rH - 10) / 2);
      let rx = M.left;
      for (let c = 0; c < vals.length; c++) {
        const isNum = c === 0;
        doc.font(isNum ? "Helvetica-Bold" : "Helvetica").fontSize(7.5)
          .fillColor(isNum ? C.accent : C.text)
          .text(vals[c], rx + 6, textY, { width: cols[c] - 12 });
        rx += cols[c];
      }

      doc.y = rY + rH;
    }
  },

  // ==========================================================================
  //  DECLARATION & SIGNATURE
  // ==========================================================================
  _declarationSection(doc, app) {
    this._ensureSpace(doc, 180);
    doc.moveDown(1.2);
    this._sectionTitle(doc, "Declaration");

    const name = app.client?.username || "the Applicant";

    const clauses = [
      `I, ${name}, hereby declare that all information provided in this application is true, complete, and accurate to the best of my knowledge.`,
      "I understand that any false or misleading statement may result in the refusal of this application or revocation of any approval granted.",
      "I undertake to notify the Authority promptly of any material changes to the information provided herein.",
      "I consent to the Authority conducting such enquiries and due diligence as it deems necessary in connection with this application.",
      "I agree to be bound by the provisions of the Nairobi International Financial Centre Act and any conditions attached to any approval.",
    ];

    for (let i = 0; i < clauses.length; i++) {
      this._ensureSpace(doc, 32);

      // Clause number
      doc.font("Helvetica-Bold").fontSize(8).fillColor(C.accent)
        .text(`${i + 1}.`, M.left, doc.y, { width: 16 });

      // Clause text (same line)
      doc.font("Helvetica").fontSize(8.5).fillColor(C.text)
        .text(clauses[i], M.left + 18, doc.y - doc.currentLineHeight(), {
          width: CW - 18, lineGap: 2, align: "justify",
        });

      doc.moveDown(0.25);
    }

    // ---- Signature block ----
    doc.moveDown(1.5);
    this._ensureSpace(doc, 110);

    const colW = (CW - 40) / 2;
    const sigStartY = doc.y;

    // Left column: Applicant
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(C.muted)
      .text("FOR AND ON BEHALF OF THE APPLICANT", M.left, sigStartY, { width: colW });

    const lineY = sigStartY + 40;
    doc.strokeColor(C.text).lineWidth(0.5)
      .moveTo(M.left, lineY).lineTo(M.left + colW - 10, lineY).stroke();
    doc.font("Helvetica").fontSize(7).fillColor(C.muted)
      .text("Signature", M.left, lineY + 4, { width: colW });

    doc.font("Helvetica").fontSize(8.5).fillColor(C.text)
      .text(`Name: ${name}`, M.left, lineY + 20, { width: colW });
    doc.font("Helvetica").fontSize(8.5).fillColor(C.text)
      .text(`Date: ${app.submitted_at ? this._fmtDate(app.submitted_at) : "____________________"}`, M.left, lineY + 34, { width: colW });

    // Right column: Authority
    const rx = M.left + colW + 40;
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(C.muted)
      .text("FOR OFFICIAL USE BY THE AUTHORITY", rx, sigStartY, { width: colW });

    doc.strokeColor(C.text).lineWidth(0.5)
      .moveTo(rx, lineY).lineTo(rx + colW - 10, lineY).stroke();
    doc.font("Helvetica").fontSize(7).fillColor(C.muted)
      .text("Authorised Signatory", rx, lineY + 4, { width: colW });

    doc.font("Helvetica").fontSize(8.5).fillColor(C.text)
      .text("Name: ____________________", rx, lineY + 20, { width: colW });
    doc.font("Helvetica").fontSize(8.5).fillColor(C.text)
      .text("Date: ____________________", rx, lineY + 34, { width: colW });

    doc.y = lineY + 56;

    // End marker
    this._ensureSpace(doc, 30);
    doc.strokeColor(C.divider).lineWidth(0.3)
      .moveTo(M.left, doc.y).lineTo(M.left + CW, doc.y).stroke();
    doc.moveDown(0.4);
    doc.font("Helvetica").fontSize(7.5).fillColor(C.muted)
      .text("End of Application Document", M.left, doc.y, { width: CW, align: "center" });
  },

  // ==========================================================================
  //  REUSABLE COMPONENTS
  // ==========================================================================

  /** Large section title with accent underline */
  _sectionTitle(doc, title) {
    doc.font("Helvetica-Bold").fontSize(16).fillColor(C.navy)
      .text(title, M.left, doc.y, { width: CW });
    doc.moveDown(0.25);
    doc.rect(M.left, doc.y, 36, 2.5).fill(C.accent);
    doc.moveDown(0.7);
  },

  /** Numbered section header with left accent bar */
  _sectionHeader(doc, num, title) {
    const y = doc.y;

    // Left accent bar
    doc.rect(M.left, y, 3, 20).fill(C.accent);

    // Number
    doc.font("Helvetica").fontSize(10).fillColor(C.accent)
      .text(num, M.left + 12, y + 3, { width: 24 });

    // Title
    doc.font("Helvetica-Bold").fontSize(11).fillColor(C.navy)
      .text(title.toUpperCase(), M.left + 36, y + 2, { width: CW - 36 });

    doc.y = y + 26;
    doc.moveDown(0.3);
  },

  /** Clean key-value table with dividers */
  _dataTable(doc, rows) {
    const labelW = 165;
    const valueW = CW - labelW;

    for (let i = 0; i < rows.length; i++) {
      this._ensureSpace(doc, 22);
      const [label, value] = rows[i];
      const rY = doc.y;

      doc.font("Helvetica").fontSize(8.5).fillColor(C.secondary)
        .text(label, M.left, rY + 5, { width: labelW - 12 });

      doc.font("Helvetica-Bold").fontSize(8.5).fillColor(C.text)
        .text(String(value || "\u2014"), M.left + labelW, rY + 5, { width: valueW - 10 });

      doc.y = rY + 22;

      // Divider between rows
      if (i < rows.length - 1) {
        doc.strokeColor(C.divider).lineWidth(0.3)
          .moveTo(M.left, doc.y).lineTo(M.left + CW, doc.y).stroke();
      }
    }
  },

  /** Financial metric cards in a responsive row */
  _financialCards(doc, fields, fieldData) {
    const perRow = Math.min(fields.length, 3);
    const gap = 12;
    const cardW = (CW - gap * (perRow - 1)) / perRow;
    const cardH = 60;

    // Ensure space for the first row BEFORE starting
    this._ensureSpace(doc, cardH + 10);

    let colIdx = 0;
    let rowStartY = doc.y;

    for (const field of fields) {
      if (colIdx >= perRow) {
        colIdx = 0;
        doc.y = rowStartY + cardH + gap;
        this._ensureSpace(doc, cardH + 10);
        rowStartY = doc.y; // may have changed if page was added
      }

      const cx = M.left + colIdx * (cardW + gap);
      const rawVal = fieldData[field.field_name];
      const numVal = Number(rawVal);
      const isCurrency = /usd|kes|amount|revenue|capital|invest|fee|salary|cost|price|budget/i.test(field.field_label);

      // Card background
      doc.roundedRect(cx, rowStartY, cardW, cardH, 5)
        .lineWidth(0.5).strokeColor(C.border).fillColor(C.surface).fillAndStroke();

      // Top accent stripe
      doc.rect(cx + 2, rowStartY + 1, cardW - 4, 2.5).fill(C.accent);

      // Value — lineBreak:false prevents auto-pagination from text positioning
      const displayVal = isCurrency
        ? `USD ${numVal.toLocaleString("en-US")}`
        : numVal.toLocaleString("en-US");

      doc.font("Helvetica-Bold").fontSize(16).fillColor(C.navy)
        .text(displayVal, cx + 12, rowStartY + 14, { width: cardW - 24, lineBreak: false });

      // Label (strip "(USD)" noise)
      const cleanLabel = field.field_label
        .replace(/\s*\(USD\)\s*/gi, "")
        .replace(/\s*\(KES\)\s*/gi, "")
        .toUpperCase();

      doc.font("Helvetica").fontSize(6.5).fillColor(C.muted)
        .text(cleanLabel, cx + 12, rowStartY + 40, { width: cardW - 24, lineBreak: false });

      colIdx++;
    }

    doc.y = rowStartY + cardH + 6;
  },

  /** Labeled text block with accent left border */
  _textBlock(doc, label, text) {
    this._ensureSpace(doc, 50);

    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(C.secondary)
      .text(label, M.left, doc.y, { width: CW });
    doc.moveDown(0.3);

    const boxY = doc.y;
    const measuredH = doc.font("Helvetica").fontSize(8.5)
      .heightOfString(text, { width: CW - 28, lineGap: 2 });
    const boxH = Math.max(measuredH + 20, 36);

    // Background
    doc.roundedRect(M.left, boxY, CW, boxH, 4)
      .lineWidth(0.5).strokeColor(C.border).fillColor(C.surface).fillAndStroke();

    // Left accent bar
    doc.rect(M.left, boxY + 2, 3, boxH - 4).fill(C.accent);

    // Text
    doc.font("Helvetica").fontSize(8.5).fillColor(C.text)
      .text(text, M.left + 14, boxY + 10, { width: CW - 28, lineGap: 2 });

    doc.y = boxY + boxH + 4;
  },

  // ==========================================================================
  //  HEADERS & FOOTERS
  // ==========================================================================

  _runningHeader(doc, app) {
    const y = 28;
    doc.font("Helvetica-Bold").fontSize(7).fillColor(C.muted)
      .text("NIFCA", M.left, y, { lineBreak: false });
    const refText = `Ref: ${app.reference_number || app.id}`;
    const refW = doc.widthOfString(refText);
    doc.font("Helvetica").fontSize(7).fillColor(C.muted)
      .text(refText, M.left + CW - refW, y, { lineBreak: false });
    doc.strokeColor(C.divider).lineWidth(0.3)
      .moveTo(M.left, y + 12).lineTo(M.left + CW, y + 12).stroke();
    doc.y = M.top;
  },

  _runningFooter(doc, page, total) {
    const y = doc.page.height - 36;
    doc.strokeColor(C.divider).lineWidth(0.3)
      .moveTo(M.left, y).lineTo(M.left + CW, y).stroke();
    doc.font("Helvetica").fontSize(7).fillColor(C.muted)
      .text("Confidential", M.left, y + 6, { lineBreak: false });
    const pageText = `${page} / ${total}`;
    const pageW = doc.widthOfString(pageText);
    doc.text(pageText, M.left + CW - pageW, y + 6, { lineBreak: false });
    doc.y = M.top;
  },

  _coverFooter(doc) {
    // Intentionally minimal — bottom bands drawn in _coverPage
  },

  // ==========================================================================
  //  UTILITIES
  // ==========================================================================

  _ensureSpace(doc, needed) {
    if (doc.y > doc.page.height - M.bottom - needed) {
      doc.addPage();
      doc.y = M.top + 16;
    }
  },

  _statusStyle(status) {
    const map = {
      approved: { color: C.green, bg: C.greenBg },
      rejected: { color: C.red, bg: C.redBg },
      submitted: { color: C.blue, bg: C.blueBg },
      under_review: { color: C.amber, bg: C.amberBg },
      in_pipeline: { color: C.blue, bg: C.blueBg },
      pending: { color: C.amber, bg: C.amberBg },
      draft: { color: C.secondary, bg: C.surface },
      cancelled: { color: C.muted, bg: C.surface },
    };
    return map[status] || { color: C.secondary, bg: C.surface };
  },

  _fmtFieldValue(field, value) {
    if (value === undefined || value === null || value === "") return "\u2014";

    switch (field.field_type) {
      case "checkbox":
        if (Array.isArray(value)) {
          if (field.field_options && Array.isArray(field.field_options)) {
            return value.map((v) => {
              const opt = field.field_options.find((o) => o.value === v);
              return opt ? opt.label : v;
            }).join(", ");
          }
          return value.join(", ");
        }
        return String(value);

      case "select":
      case "radio":
        if (field.field_options && Array.isArray(field.field_options)) {
          const opt = field.field_options.find((o) => o.value === value);
          return opt ? opt.label : value;
        }
        return String(value);

      case "date":
        return this._fmtDate(value);

      case "number":
        return Number(value).toLocaleString("en-US");

      default:
        return String(value);
    }
  },

  _fmtDate(val) {
    if (!val) return "\u2014";
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  },

  _fmtDateCompact(val) {
    if (!val) return "\u2014";
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  },

  _fmtDocType(type) {
    if (!type) return "\u2014";
    return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  },

  deletePdf(pdfPath) {
    if (!pdfPath) return;
    const fullPath = path.join(__dirname, "..", pdfPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  },
};

module.exports = pdfGeneratorService;
