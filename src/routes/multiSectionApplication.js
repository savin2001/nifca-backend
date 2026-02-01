// src/routes/multiSectionApplication.js
const express = require("express");
const { body, param, query } = require("express-validator");
const multiSectionApplicationController = require("../controllers/multiSectionApplicationController");
const clientAuthMiddleware = require("../middlewares/clientAuthMiddleware");
const { uploadApplicationDoc } = require("../config/uploadApplicationDocs");

const router = express.Router();

// =====================================================
// Validation Schemas
// =====================================================

const validateApplicationId = param("id").isInt({ min: 1 }).withMessage("Application ID must be a positive integer");
const validateTypeId = param("typeId").isInt({ min: 1 }).withMessage("Type ID must be a positive integer");
const validateSectionId = param("sectionId").isInt({ min: 1 }).withMessage("Section ID must be a positive integer");
const validateDocumentId = param("docId").isInt({ min: 1 }).withMessage("Document ID must be a positive integer");

const validateCreateApplication = [
  body("application_type_id").isInt({ min: 1 }).withMessage("Application type ID is required"),
  body("title").optional().isString().isLength({ max: 255 }).withMessage("Title must be less than 255 characters"),
];

const validateSectionData = [
  body("field_data").isObject().withMessage("Field data must be an object"),
];

const validateDocumentUpload = [
  body("section_id").optional().isInt({ min: 1 }).withMessage("Section ID must be a positive integer"),
  body("field_id").optional().isInt({ min: 1 }).withMessage("Field ID must be a positive integer"),
  body("document_type").optional().isString().isLength({ max: 100 }).withMessage("Document type must be less than 100 characters"),
];

const validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("status").optional().isIn(["draft", "submitted", "under_review", "approved", "rejected", "cancelled"]).withMessage("Invalid status"),
];

// =====================================================
// Application Types (Read-only for clients)
// =====================================================

// GET /api/client/multi-applications/types - List active application types
router.get(
  "/types",
  clientAuthMiddleware,
  multiSectionApplicationController.getApplicationTypes
);

// GET /api/client/multi-applications/types/:typeId/structure - Get type with full structure
router.get(
  "/types/:typeId/structure",
  clientAuthMiddleware,
  validateTypeId,
  multiSectionApplicationController.getApplicationTypeStructure
);

// =====================================================
// Application CRUD
// =====================================================

// POST /api/client/multi-applications - Create draft application
router.post(
  "/",
  clientAuthMiddleware,
  validateCreateApplication,
  multiSectionApplicationController.createApplication
);

// GET /api/client/multi-applications - List client's applications
router.get(
  "/",
  clientAuthMiddleware,
  validatePagination,
  multiSectionApplicationController.getClientApplications
);

// GET /api/client/multi-applications/:id - Get single application with all data
router.get(
  "/:id",
  clientAuthMiddleware,
  validateApplicationId,
  multiSectionApplicationController.getApplication
);

// DELETE /api/client/multi-applications/:id - Delete draft application
router.delete(
  "/:id",
  clientAuthMiddleware,
  validateApplicationId,
  multiSectionApplicationController.deleteApplication
);

// =====================================================
// Section Data Operations
// =====================================================

// GET /api/client/multi-applications/:id/sections/:sectionId - Get section data
router.get(
  "/:id/sections/:sectionId",
  clientAuthMiddleware,
  validateApplicationId,
  validateSectionId,
  multiSectionApplicationController.getSectionData
);

// PUT /api/client/multi-applications/:id/sections/:sectionId - Save section data
router.put(
  "/:id/sections/:sectionId",
  clientAuthMiddleware,
  validateApplicationId,
  validateSectionId,
  validateSectionData,
  multiSectionApplicationController.saveSectionData
);

// POST /api/client/multi-applications/:id/sections/:sectionId/validate - Validate section
router.post(
  "/:id/sections/:sectionId/validate",
  clientAuthMiddleware,
  validateApplicationId,
  validateSectionId,
  multiSectionApplicationController.validateSection
);

// =====================================================
// Document Operations
// =====================================================

// POST /api/client/multi-applications/:id/documents - Upload document
router.post(
  "/:id/documents",
  clientAuthMiddleware,
  validateApplicationId,
  uploadApplicationDoc.single("file"),
  validateDocumentUpload,
  multiSectionApplicationController.uploadDocument
);

// GET /api/client/multi-applications/:id/documents - List documents
router.get(
  "/:id/documents",
  clientAuthMiddleware,
  validateApplicationId,
  multiSectionApplicationController.getDocuments
);

// DELETE /api/client/multi-applications/:id/documents/:docId - Delete document
router.delete(
  "/:id/documents/:docId",
  clientAuthMiddleware,
  validateApplicationId,
  validateDocumentId,
  multiSectionApplicationController.deleteDocument
);

// =====================================================
// Submission & PDF
// =====================================================

// POST /api/client/multi-applications/:id/submit - Submit application
router.post(
  "/:id/submit",
  clientAuthMiddleware,
  validateApplicationId,
  multiSectionApplicationController.submitApplication
);

// GET /api/client/multi-applications/:id/pdf - Download PDF
router.get(
  "/:id/pdf",
  clientAuthMiddleware,
  validateApplicationId,
  multiSectionApplicationController.downloadPdf
);

// POST /api/client/multi-applications/:id/cancel - Cancel application
router.post(
  "/:id/cancel",
  clientAuthMiddleware,
  validateApplicationId,
  multiSectionApplicationController.cancelApplication
);

// =====================================================
// Error handling middleware for multer
// =====================================================

router.use((error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File size exceeds the 10MB limit" });
  }
  if (error.message && error.message.includes("Invalid file type")) {
    return res.status(400).json({ error: error.message });
  }
  next(error);
});

module.exports = router;
