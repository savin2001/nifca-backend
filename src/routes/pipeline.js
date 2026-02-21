// src/routes/pipeline.js
const express = require("express");
const { param, body } = require("express-validator");
const pipelineController = require("../controllers/pipelineController");
const authMiddleware = require("../middlewares/authMiddleware");
const clientAuthMiddleware = require("../middlewares/clientAuthMiddleware");

const router = express.Router();

// Validation helpers
const validateApplicationId = param("id").isInt().withMessage("Application ID must be an integer");
const validateStageId = param("stageId").isInt().withMessage("Stage ID must be an integer");
const validateReviewerId = param("reviewerId").isInt().withMessage("Reviewer ID must be an integer");

const validateReviewers = [
  body("reviewers")
    .isArray({ min: 1 })
    .withMessage("Reviewers must be a non-empty array"),
  body("reviewers.*.user_id")
    .isInt({ min: 1 })
    .withMessage("Each reviewer must have a valid user_id"),
];

const validateDecision = [
  body("decision")
    .isIn(["approved", "rejected", "returned"])
    .withMessage("Decision must be 'approved', 'rejected', or 'returned'"),
  body("comments")
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage("Comments must be less than 2000 characters"),
];

// =====================================================
// Admin Pipeline Routes (JWT auth)
// =====================================================

// GET /api/pipeline/stages - List stage definitions
router.get("/stages", authMiddleware, pipelineController.getStageDefinitions);

// POST /api/pipeline/applications/:id/start - Initialize pipeline
router.post(
  "/applications/:id/start",
  authMiddleware,
  validateApplicationId,
  pipelineController.initializePipeline
);

// POST /api/pipeline/stages/:stageId/reviewers - Assign reviewers to a stage
router.post(
  "/stages/:stageId/reviewers",
  authMiddleware,
  validateStageId,
  validateReviewers,
  pipelineController.assignReviewers
);

// GET /api/pipeline/applications/:id - Get full pipeline for an application
router.get(
  "/applications/:id",
  authMiddleware,
  validateApplicationId,
  pipelineController.getApplicationPipeline
);

// GET /api/pipeline/applications/:id/audit-log - Get pipeline audit log
router.get(
  "/applications/:id/audit-log",
  authMiddleware,
  validateApplicationId,
  pipelineController.getPipelineAuditLog
);

// POST /api/pipeline/reviews/:reviewerId/decision - Submit review decision
router.post(
  "/reviews/:reviewerId/decision",
  authMiddleware,
  validateReviewerId,
  validateDecision,
  pipelineController.processReview
);

// GET /api/pipeline/my-reviews - Get logged-in user's reviews
router.get("/my-reviews", authMiddleware, pipelineController.getMyReviews);

// =====================================================
// Client Pipeline Route (Session auth)
// Mounted separately under /api/client for session middleware
// =====================================================
const clientRouter = express.Router();

// GET /api/client/applications/:id/pipeline - Client's sanitized view
clientRouter.get(
  "/applications/:id/pipeline",
  clientAuthMiddleware,
  validateApplicationId,
  pipelineController.getClientPipelineStatus
);

module.exports = router;
module.exports.clientRouter = clientRouter;
