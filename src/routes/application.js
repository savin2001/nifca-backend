// src/routes/application.js
const express = require("express");
const { body, param, query } = require("express-validator");
const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const validateClientId = param("id").isInt().withMessage("Client ID must be an integer");
const validateApplicationId = param("id").isInt().withMessage("Application ID must be an integer");
const validateReview = [
  body("status").isIn(["approved", "rejected"]).withMessage("Status must be 'approved' or 'rejected'"),
  body("reviewComments").optional().isString().withMessage("Review comments must be a string"),
];

// =====================================================
// Legacy Routes (preserved for backwards compatibility)
// =====================================================

router.patch("/:id/disable", authMiddleware, validateClientId, applicationController.disableClient);
router.delete("/:id", authMiddleware, validateClientId, applicationController.softDeleteClient);
router.get("/", authMiddleware, applicationController.getAllApplications);
router.patch("/:id/review", authMiddleware, validateApplicationId, validateReview, applicationController.reviewApplication);

// =====================================================
// Multi-Section Application Admin Routes
// =====================================================

// Validation for new routes
const validateFilters = [
  query("status").optional().isIn(["draft", "submitted", "under_review", "in_pipeline", "approved", "rejected", "cancelled", "pending"]).withMessage("Invalid status"),
  query("application_type_id").optional().isInt({ min: 1 }).withMessage("Application type ID must be a positive integer"),
  query("client_id").optional().isInt({ min: 1 }).withMessage("Client ID must be a positive integer"),
  query("date_from").optional().isISO8601().withMessage("date_from must be a valid date"),
  query("date_to").optional().isISO8601().withMessage("date_to must be a valid date"),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
];

const validateStatusUpdate = [
  body("status").isIn(["draft", "submitted", "under_review", "in_pipeline", "approved", "rejected", "cancelled", "pending"]).withMessage("Invalid status"),
];

const validateMultiSectionReview = [
  body("status").isIn(["pending", "under_review", "approved", "rejected"]).withMessage("Status must be 'pending', 'under_review', 'approved', or 'rejected'"),
  body("review_comments").optional().isString().isLength({ max: 2000 }).withMessage("Review comments must be less than 2000 characters"),
];

// GET /api/applications/filtered - Get all applications with filters (new endpoint to avoid conflict)
router.get(
  "/filtered",
  authMiddleware,
  validateFilters,
  applicationController.getAllApplicationsFiltered
);

// GET /api/applications/statistics - Get application statistics for dashboard
router.get(
  "/statistics",
  authMiddleware,
  applicationController.getApplicationStatistics
);

// GET /api/applications/pending-review - Get applications pending review
router.get(
  "/pending-review",
  authMiddleware,
  applicationController.getPendingReviewApplications
);

// GET /api/applications/types - Get all application types
router.get(
  "/types",
  authMiddleware,
  applicationController.getApplicationTypes
);

// GET /api/applications/:id/full - Get full application details with sections and documents
router.get(
  "/:id/full",
  authMiddleware,
  validateApplicationId,
  applicationController.getApplicationFullDetails
);

// GET /api/applications/:id/pdf - Download application PDF
router.get(
  "/:id/pdf",
  authMiddleware,
  validateApplicationId,
  applicationController.downloadApplicationPdf
);

// PATCH /api/applications/:id/status - Update application status
router.patch(
  "/:id/status",
  authMiddleware,
  validateApplicationId,
  validateStatusUpdate,
  applicationController.updateApplicationStatus
);

// POST /api/applications/:id/review-multi - Review multi-section application
router.post(
  "/:id/review-multi",
  authMiddleware,
  validateApplicationId,
  validateMultiSectionReview,
  applicationController.reviewMultiSectionApplication
);

module.exports = router;