// src/services/pdfGeneratorService.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const pdfGeneratorService = {
  /**
   * Generate a PDF for an application
   * @param {Object} application - Application data with type, sections, and field data
   * @param {Object[]} documents - Array of uploaded documents
   * @returns {Promise<string>} - Path to generated PDF
   */
  async generateApplicationPdf(application, sectionData, documents) {
    return new Promise((resolve, reject) => {
      try {
        // Ensure pdfs directory exists
        const pdfsDir = path.join(__dirname, "../assets/pdfs");
        if (!fs.existsSync(pdfsDir)) {
          fs.mkdirSync(pdfsDir, { recursive: true });
        }

        const filename = `application_${application.reference_number || application.id}_${Date.now()}.pdf`;
        const filePath = path.join(pdfsDir, filename);
        const relativePath = `assets/pdfs/${filename}`;

        const doc = new PDFDocument({
          size: "A4",
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
          bufferPages: true,
          info: {
            Title: `NIFCA Application - ${application.reference_number || application.id}`,
            Author: "NIFCA",
            Subject: application.applicationType?.name || "Application",
            Creator: "NIFCA Application System",
          },
        });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        this._addHeader(doc, application);

        // Application Info
        this._addApplicationInfo(doc, application);

        // Sections with data
        this._addSections(doc, application.sections, sectionData);

        // Documents list
        this._addDocumentsList(doc, documents);

        // Footer on each page
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);
          this._addFooter(doc, i + 1, pageCount);
        }

        doc.end();

        stream.on("finish", () => {
          resolve(relativePath);
        });

        stream.on("error", (err) => {
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  _addHeader(doc, application) {
    // Try to add logo if it exists
    const logoPath = path.join(__dirname, "../assets/nifca.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 80 });
      doc.moveDown(2);
    }

    // Title
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("NAIROBI INTERNATIONAL FINANCE CENTER", { align: "center" })
      .moveDown(0.3);

    doc
      .fontSize(14)
      .text("APPLICATION FORM", { align: "center" })
      .moveDown(0.5);

    // Application type name
    if (application.applicationType?.name) {
      doc
        .font("Helvetica")
        .fontSize(12)
        .text(application.applicationType.name.toUpperCase(), { align: "center" });
    }

    doc.moveDown(1);

    // Horizontal line
    doc
      .strokeColor("#003366")
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();

    doc.moveDown(1);
  },

  _addApplicationInfo(doc, application) {
    doc.font("Helvetica-Bold").fontSize(12).text("APPLICATION DETAILS", { underline: true });
    doc.moveDown(0.5);

    const infoData = [
      ["Reference Number:", application.reference_number || "N/A"],
      ["Application Type:", application.applicationType?.name || "N/A"],
      ["Status:", (application.status || "").toUpperCase()],
      ["Submission Date:", application.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : "N/A"],
      ["Applicant:", application.client?.username || "N/A"],
    ];

    doc.font("Helvetica").fontSize(10);
    for (const [label, value] of infoData) {
      doc.text(`${label} ${value}`);
    }

    doc.moveDown(1);

    // Horizontal line
    doc
      .strokeColor("#cccccc")
      .lineWidth(0.5)
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();

    doc.moveDown(1);
  },

  _addSections(doc, sections, sectionData) {
    if (!sections || sections.length === 0) return;

    for (const section of sections) {
      // Check if we need a new page
      if (doc.y > doc.page.height - 150) {
        doc.addPage();
      }

      // Section header
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#003366")
        .text(`${section.display_order}. ${section.name.toUpperCase()}`, { underline: true });

      doc.fillColor("black");
      doc.moveDown(0.5);

      // Find section data
      const data = sectionData.find((sd) => sd.section_id === section.id);
      const fieldData = data?.field_data || {};

      // Add fields
      if (section.fields && section.fields.length > 0) {
        for (const field of section.fields) {
          // Skip file fields in the main section display
          if (field.field_type === "file") continue;

          const value = fieldData[field.field_name];
          this._addField(doc, field, value);
        }
      } else {
        doc.font("Helvetica-Oblique").fontSize(10).text("No data provided for this section.");
      }

      doc.moveDown(1);

      // Section separator
      doc
        .strokeColor("#eeeeee")
        .lineWidth(0.5)
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke();

      doc.moveDown(0.5);
    }
  },

  _addField(doc, field, value) {
    // Field label
    doc.font("Helvetica-Bold").fontSize(10).text(`${field.field_label}:`);

    // Field value
    let displayValue = "Not provided";

    if (value !== undefined && value !== null && value !== "") {
      switch (field.field_type) {
        case "checkbox":
          if (Array.isArray(value)) {
            // Map values to labels if options are available
            if (field.field_options && Array.isArray(field.field_options)) {
              const labels = value.map((v) => {
                const opt = field.field_options.find((o) => o.value === v);
                return opt ? opt.label : v;
              });
              displayValue = labels.join(", ");
            } else {
              displayValue = value.join(", ");
            }
          }
          break;

        case "select":
        case "radio":
          // Map value to label
          if (field.field_options && Array.isArray(field.field_options)) {
            const opt = field.field_options.find((o) => o.value === value);
            displayValue = opt ? opt.label : value;
          } else {
            displayValue = value;
          }
          break;

        case "date":
          displayValue = new Date(value).toLocaleDateString();
          break;

        case "number":
          displayValue = Number(value).toLocaleString();
          break;

        default:
          displayValue = String(value);
      }
    }

    doc.font("Helvetica").fontSize(10).text(displayValue, { indent: 10 });
    doc.moveDown(0.3);
  },

  _addDocumentsList(doc, documents) {
    if (!documents || documents.length === 0) return;

    // Check if we need a new page
    if (doc.y > doc.page.height - 200) {
      doc.addPage();
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#003366")
      .text("UPLOADED DOCUMENTS", { underline: true });

    doc.fillColor("black");
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(10);

    for (let i = 0; i < documents.length; i++) {
      const docItem = documents[i];
      const fileSize = (docItem.file_size / 1024).toFixed(1);
      const uploadDate = new Date(docItem.created_at).toLocaleDateString();

      doc.text(
        `${i + 1}. ${docItem.original_filename} (${fileSize} KB) - Uploaded: ${uploadDate}`
      );
    }

    doc.moveDown(1);
  },

  _addFooter(doc, currentPage, totalPages) {
    const bottomMargin = 30;

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#666666")
      .text(
        `Page ${currentPage} of ${totalPages}`,
        50,
        doc.page.height - bottomMargin,
        { align: "center", width: doc.page.width - 100 }
      );

    doc.text(
      `Generated: ${new Date().toLocaleString()} | NIFCA Application System`,
      50,
      doc.page.height - bottomMargin + 10,
      { align: "center", width: doc.page.width - 100 }
    );

    doc.fillColor("black");
  },

  /**
   * Delete a PDF file
   * @param {string} pdfPath - Relative path to the PDF
   */
  deletePdf(pdfPath) {
    if (!pdfPath) return;
    const fullPath = path.join(__dirname, "..", pdfPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  },
};

module.exports = pdfGeneratorService;
