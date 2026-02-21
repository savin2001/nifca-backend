// src/controllers/multiSectionApplicationController.js
const db = require("../config/db");
const applicationModel = require("../models/applicationModel");
const applicationTypeModel = require("../models/applicationTypeModel");
const applicationSectionDataModel = require("../models/applicationSectionDataModel");
const applicationDocumentModel = require("../models/applicationDocumentModel");
const clientModel = require("../models/clientModel");
const applicationValidator = require("../utils/applicationValidator");
const pdfGeneratorService = require("../services/pdfGeneratorService");
const { getRelativeFilePath, deleteApplicationDirectory } = require("../config/uploadApplicationDocs");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

// Generate unique reference number
const generateReferenceNumber = async (applicationId) => {
  const year = new Date().getFullYear();
  const paddedId = String(applicationId).padStart(5, "0");
  return `NIFCA-${year}-${paddedId}`;
};

const multiSectionApplicationController = {
  // =====================================================
  // Application Types (Read-only for clients)
  // =====================================================

  async getApplicationTypes(req, res) {
    try {
      const types = await applicationTypeModel.getAllTypes(true);
      res.status(200).json(types);
    } catch (error) {
      console.error("Error fetching application types:", error);
      res.status(500).json({ error: "Server error while fetching application types" });
    }
  },

  async getApplicationTypeStructure(req, res) {
    const typeId = parseInt(req.params.typeId);

    try {
      const structure = await applicationTypeModel.getTypeWithStructure(typeId);
      if (!structure) {
        return res.status(404).json({ error: "Application type not found" });
      }
      if (!structure.is_active) {
        return res.status(400).json({ error: "Application type is not active" });
      }
      res.status(200).json(structure);
    } catch (error) {
      console.error("Error fetching application type structure:", error);
      res.status(500).json({ error: "Server error while fetching application structure" });
    }
  },

  // =====================================================
  // Application CRUD
  // =====================================================

  async createApplication(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const clientId = req.user.userId;
    const { application_type_id, title } = req.body;

    try {
      const appType = await applicationTypeModel.getTypeById(application_type_id);
      if (!appType) {
        return res.status(404).json({ error: "Application type not found" });
      }
      if (!appType.is_active) {
        return res.status(400).json({ error: "Application type is not available" });
      }

      const [result] = await db.query(
        `INSERT INTO applications (client_id, application_type_id, title, description, status, current_section, completion_percentage)
         VALUES (?, ?, ?, ?, 'draft', 1, 0)`,
        [clientId, application_type_id, title || appType.name, appType.description]
      );

      const applicationId = result.insertId;

      const referenceNumber = await generateReferenceNumber(applicationId);
      await db.query("UPDATE applications SET reference_number = ? WHERE id = ?", [
        referenceNumber,
        applicationId,
      ]);

      // Log audit entry - use NULL for performed_by if client (not in users table)
      try {
        await db.query(
          `INSERT INTO application_audit_log (application_id, action, performed_by, new_data)
           VALUES (?, 'create_draft', NULL, ?)`,
          [applicationId, JSON.stringify({ application_type_id, title, status: "draft", reference_number: referenceNumber, client_id: clientId })]
        );
      } catch (auditError) {
        console.warn("Could not write audit log:", auditError.message);
      }

      const application = await applicationModel.findById(applicationId);
      res.status(201).json({
        message: "Application draft created successfully",
        application: { ...application, reference_number: referenceNumber },
      });
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ error: "Server error while creating application" });
    }
  },

  async getClientApplications(req, res) {
    const clientId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;

    try {
      let query = `
        SELECT a.*, at.name as application_type_name, at.code as application_type_code
        FROM applications a
        LEFT JOIN application_types at ON a.application_type_id = at.id
        WHERE a.client_id = ?
      `;
      const params = [clientId];

      if (status) {
        query += " AND a.status = ?";
        params.push(status);
      }

      query += " ORDER BY a.updated_at DESC";

      const countQuery = query.replace("SELECT a.*, at.name as application_type_name, at.code as application_type_code", "SELECT COUNT(*) as count");
      const [countResult] = await db.query(countQuery, params);
      const total = countResult[0].count;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      query += " LIMIT ? OFFSET ?";
      params.push(parseInt(limit), offset);

      const [applications] = await db.query(query, params);

      res.status(200).json({
        applications,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error("Error fetching client applications:", error);
      res.status(500).json({ error: "Server error while fetching applications" });
    }
  },

  async getApplication(req, res) {
    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);

    try {
      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      if (application.client_id !== clientId) {
        return res.status(403).json({ error: "You can only view your own applications" });
      }

      const typeStructure = await applicationTypeModel.getTypeWithStructure(application.application_type_id);
      const sectionData = await applicationSectionDataModel.getAllSectionData(applicationId);
      const documents = await applicationDocumentModel.getByApplicationId(applicationId);
      const completionStatus = await applicationSectionDataModel.getCompletionStatus(
        applicationId,
        application.application_type_id
      );

      res.status(200).json({
        application,
        applicationType: typeStructure,
        sectionData,
        documents,
        completionStatus,
      });
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ error: "Server error while fetching application" });
    }
  },

  async deleteApplication(req, res) {
    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);

    try {
      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      if (application.client_id !== clientId) {
        return res.status(403).json({ error: "You can only delete your own applications" });
      }
      if (application.status !== "draft") {
        return res.status(400).json({ error: "Only draft applications can be deleted" });
      }

      await applicationDocumentModel.deleteByApplicationId(applicationId, true);
      deleteApplicationDirectory(applicationId);
      await applicationSectionDataModel.deleteAllSectionData(applicationId);
      await db.query("DELETE FROM applications WHERE id = ?", [applicationId]);

      try {
        await db.query(
          `INSERT INTO application_audit_log (application_id, action, performed_by, old_data)
           VALUES (?, 'delete_draft', NULL, ?)`,
          [applicationId, JSON.stringify({ ...application, deleted_by_client_id: clientId })]
        );
      } catch (auditError) {
        console.warn("Could not write audit log:", auditError.message);
      }

      res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ error: "Server error while deleting application" });
    }
  },

  // =====================================================
  // Section Data Operations
  // =====================================================

  async getSectionData(req, res) {
    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);
    const sectionId = parseInt(req.params.sectionId);

    try {
      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      if (application.client_id !== clientId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const section = await applicationTypeModel.getSectionById(sectionId);
      if (!section || section.application_type_id !== application.application_type_id) {
        return res.status(404).json({ error: "Section not found for this application type" });
      }

      const fields = await applicationTypeModel.getFieldsBySectionId(sectionId);
      const sectionData = await applicationSectionDataModel.getSectionData(applicationId, sectionId);
      const documents = await applicationDocumentModel.getBySectionId(applicationId, sectionId);

      res.status(200).json({
        section,
        fields,
        data: sectionData,
        documents,
      });
    } catch (error) {
      console.error("Error fetching section data:", error);
      res.status(500).json({ error: "Server error while fetching section data" });
    }
  },

  async saveSectionData(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);
    const sectionId = parseInt(req.params.sectionId);
    const { field_data } = req.body;

    try {
      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      if (application.client_id !== clientId) {
        return res.status(403).json({ error: "Access denied" });
      }
      if (!["draft", "pending"].includes(application.status)) {
        return res.status(400).json({ error: "Cannot modify a submitted application" });
      }

      const section = await applicationTypeModel.getSectionById(sectionId);
      if (!section || section.application_type_id !== application.application_type_id) {
        return res.status(404).json({ error: "Section not found for this application type" });
      }

      const fields = await applicationTypeModel.getFieldsBySectionId(sectionId);
      const sanitizedData = applicationValidator.sanitizeFieldData(fields, field_data || {});

      await applicationSectionDataModel.saveSectionData(applicationId, sectionId, sanitizedData, false);

      if (section.display_order > application.current_section) {
        await db.query("UPDATE applications SET current_section = ? WHERE id = ?", [
          section.display_order,
          applicationId,
        ]);
      }

      const completionPercentage = await applicationSectionDataModel.calculateCompletionPercentage(
        applicationId,
        application.application_type_id
      );
      await db.query("UPDATE applications SET completion_percentage = ? WHERE id = ?", [
        completionPercentage,
        applicationId,
      ]);

      res.status(200).json({
        message: "Section data saved successfully",
        completion_percentage: completionPercentage,
      });
    } catch (error) {
      console.error("Error saving section data:", error);
      res.status(500).json({ error: "Server error while saving section data" });
    }
  },

  async validateSection(req, res) {
    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);
    const sectionId = parseInt(req.params.sectionId);

    try {
      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      if (application.client_id !== clientId) {
        return res.status(403).json({ error: "Access denied" });
      }
      if (!["draft", "pending"].includes(application.status)) {
        return res.status(400).json({ error: "Cannot validate a submitted application" });
      }

      const section = await applicationTypeModel.getSectionById(sectionId);
      if (!section || section.application_type_id !== application.application_type_id) {
        return res.status(404).json({ error: "Section not found" });
      }

      const fields = await applicationTypeModel.getFieldsBySectionId(sectionId);
      const sectionData = await applicationSectionDataModel.getSectionData(applicationId, sectionId);
      const fieldData = sectionData?.field_data || {};

      const validationRes = applicationValidator.validateSection(fields, fieldData);

      const fileFields = fields.filter((f) => f.field_type === "file" && f.is_required);
      for (const fileField of fileFields) {
        const hasDocument = await applicationDocumentModel.existsForField(applicationId, fileField.id);
        if (!hasDocument) {
          validationRes.valid = false;
          validationRes.errors[fileField.field_name] = [`${fileField.field_label} is required`];
        }
      }

      if (validationRes.valid) {
        await applicationSectionDataModel.saveSectionData(applicationId, sectionId, fieldData, true);

        const completionPercentage = await applicationSectionDataModel.calculateCompletionPercentage(
          applicationId,
          application.application_type_id
        );
        await db.query("UPDATE applications SET completion_percentage = ? WHERE id = ?", [
          completionPercentage,
          applicationId,
        ]);

        res.status(200).json({
          valid: true,
          message: "Section validated successfully",
          completion_percentage: completionPercentage,
        });
      } else {
        res.status(400).json({
          valid: false,
          errors: validationRes.errors,
          message: "Section validation failed",
        });
      }
    } catch (error) {
      console.error("Error validating section:", error);
      res.status(500).json({ error: "Server error while validating section" });
    }
  },

  // =====================================================
  // Document Operations
  // =====================================================

  async uploadDocument(req, res) {
    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);

    try {
      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      if (application.client_id !== clientId) {
        return res.status(403).json({ error: "Access denied" });
      }
      if (!["draft", "pending"].includes(application.status)) {
        return res.status(400).json({ error: "Cannot upload documents to a submitted application" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { section_id, field_id, document_type } = req.body;

      const documentId = await applicationDocumentModel.create({
        applicationId,
        sectionId: section_id || null,
        fieldId: field_id || null,
        documentType: document_type || null,
        originalFilename: req.file.originalname,
        storedFilename: req.file.filename,
        filePath: getRelativeFilePath(applicationId, req.file.filename),
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        uploadedBy: clientId,
      });

      const document = await applicationDocumentModel.findById(documentId);

      try {
        await db.query(
          `INSERT INTO application_audit_log (application_id, action, performed_by, new_data)
           VALUES (?, 'upload_document', NULL, ?)`,
          [applicationId, JSON.stringify({ document_id: documentId, filename: req.file.originalname, uploaded_by_client_id: clientId })]
        );
      } catch (auditError) {
        console.warn("Could not write audit log:", auditError.message);
      }

      res.status(201).json({
        message: "Document uploaded successfully",
        document,
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ error: "Server error while uploading document" });
    }
  },

  async getDocuments(req, res) {
    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);

    try {
      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      if (application.client_id !== clientId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const documents = await applicationDocumentModel.getByApplicationId(applicationId);
      res.status(200).json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Server error while fetching documents" });
    }
  },

  async deleteDocument(req, res) {
    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);
    const documentId = parseInt(req.params.docId);

    try {
      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      if (application.client_id !== clientId) {
        return res.status(403).json({ error: "Access denied" });
      }
      if (!["draft", "pending"].includes(application.status)) {
        return res.status(400).json({ error: "Cannot delete documents from a submitted application" });
      }

      const document = await applicationDocumentModel.findById(documentId);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      if (document.application_id !== applicationId) {
        return res.status(403).json({ error: "Document does not belong to this application" });
      }

      await applicationDocumentModel.delete(documentId, true);

      try {
        await db.query(
          `INSERT INTO application_audit_log (application_id, action, performed_by, old_data)
           VALUES (?, 'delete_document', NULL, ?)`,
          [applicationId, JSON.stringify({ document_id: documentId, filename: document.original_filename, deleted_by_client_id: clientId })]
        );
      } catch (auditError) {
        console.warn("Could not write audit log:", auditError.message);
      }

      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ error: "Server error while deleting document" });
    }
  },

  // =====================================================
  // Submission & PDF
  // =====================================================

  async submitApplication(req, res) {
    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [rows] = await connection.query(
        "SELECT * FROM applications WHERE id = ? FOR UPDATE",
        [applicationId]
      );
      const application = rows[0];

      if (!application) {
        await connection.rollback();
        return res.status(404).json({ error: "Application not found" });
      }
      if (application.client_id !== clientId) {
        await connection.rollback();
        return res.status(403).json({ error: "Access denied" });
      }
      if (!["draft", "pending"].includes(application.status)) {
        await connection.rollback();
        return res.status(400).json({ error: "Application has already been submitted" });
      }

      const allComplete = await applicationSectionDataModel.areAllRequiredSectionsComplete(
        applicationId,
        application.application_type_id
      );

      if (!allComplete) {
        await connection.rollback();
        const incompleteSections = await applicationSectionDataModel.getIncompleteRequiredSections(
          applicationId,
          application.application_type_id
        );
        return res.status(400).json({
          error: "Please complete all required sections before submitting",
          incomplete_sections: incompleteSections,
        });
      }

      const typeStructure = await applicationTypeModel.getTypeWithStructure(application.application_type_id);
      const sectionData = await applicationSectionDataModel.getAllSectionData(applicationId);
      const documents = await applicationDocumentModel.getByApplicationId(applicationId);

      const pdfPath = await pdfGeneratorService.generateApplicationPdf(
        {
          ...application,
          status: "submitted",
          submitted_at: new Date(),
          completion_percentage: 100,
          applicationType: typeStructure,
          sections: typeStructure.sections,
          client: await clientModel.findById(clientId),
        },
        sectionData,
        documents
      );

      await connection.query(
        `UPDATE applications
         SET status = 'submitted', submitted_at = NOW(), pdf_path = ?, pdf_generated_at = NOW(), completion_percentage = 100
         WHERE id = ?`,
        [pdfPath, applicationId]
      );

      try {
        await connection.query(
          `INSERT INTO application_audit_log (application_id, action, performed_by, new_data)
           VALUES (?, 'submit', NULL, ?)`,
          [applicationId, JSON.stringify({ status: "submitted", pdf_path: pdfPath, submitted_by_client_id: clientId })]
        );
      } catch (auditError) {
        console.warn("Could not write audit log:", auditError.message);
      }

      await connection.commit();

      const updatedApplication = await applicationModel.findById(applicationId);
      res.status(200).json({
        message: "Application submitted successfully",
        application: updatedApplication,
        pdf_path: pdfPath,
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error submitting application:", error);
      res.status(500).json({ error: "Server error while submitting application" });
    } finally {
      connection.release();
    }
  },

  async downloadPdf(req, res) {
    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);

    try {
      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      if (application.client_id !== clientId) {
        return res.status(403).json({ error: "Access denied" });
      }
      if (!application.pdf_path) {
        return res.status(404).json({ error: "PDF not generated yet. Please submit the application first." });
      }

      const fullPath = path.join(__dirname, "..", application.pdf_path);
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: "PDF file not found" });
      }

      const filename = `NIFCA_Application_${application.reference_number || application.id}.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.sendFile(fullPath);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      res.status(500).json({ error: "Server error while downloading PDF" });
    }
  },

  async cancelApplication(req, res) {
    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);

    try {
      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      if (application.client_id !== clientId) {
        return res.status(403).json({ error: "Access denied" });
      }
      if (!["draft", "submitted", "pending"].includes(application.status)) {
        return res.status(400).json({ error: "This application cannot be cancelled" });
      }

      const oldData = { status: application.status };

      await db.query(
        "UPDATE applications SET status = 'cancelled', cancelled_at = NOW() WHERE id = ?",
        [applicationId]
      );

      try {
        await db.query(
          `INSERT INTO application_audit_log (application_id, action, performed_by, old_data, new_data)
           VALUES (?, 'cancel', NULL, ?, ?)`,
          [applicationId, JSON.stringify({ ...oldData, cancelled_by_client_id: clientId }), JSON.stringify({ status: "cancelled" })]
        );
      } catch (auditError) {
        console.warn("Could not write audit log:", auditError.message);
      }

      const updatedApplication = await applicationModel.findById(applicationId);
      res.status(200).json({
        message: "Application cancelled successfully",
        application: updatedApplication,
      });
    } catch (error) {
      console.error("Error cancelling application:", error);
      res.status(500).json({ error: "Server error while cancelling application" });
    }
  },
};

module.exports = multiSectionApplicationController;
