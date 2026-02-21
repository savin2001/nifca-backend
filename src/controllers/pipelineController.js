// src/controllers/pipelineController.js
const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const pipelineModel = require("../models/pipelineModel");

const pipelineController = {
  /**
   * GET - List the 4 stage definitions (role 3)
   */
  async getStageDefinitions(req, res) {
    try {
      const user = await userModel.findById(req.user.userId);
      if (user.role_id !== 3) {
        return res.status(403).json({ error: "Only Application Admins can access this endpoint." });
      }

      const definitions = await pipelineModel.getStageDefinitions();
      res.status(200).json(definitions);
    } catch (error) {
      console.error("Error fetching stage definitions:", error);
      res.status(500).json({ error: "Server error while fetching stage definitions" });
    }
  },

  /**
   * POST - Initialize pipeline for a submitted application (role 3)
   */
  async initializePipeline(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await userModel.findById(req.user.userId);
      if (user.role_id !== 3) {
        return res.status(403).json({ error: "Only Application Admins can access this endpoint." });
      }

      const applicationId = parseInt(req.params.id);
      const result = await pipelineModel.initializePipeline(applicationId, req.user.userId);

      res.status(200).json({
        message: "Pipeline initialized successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error initializing pipeline:", error);
      res.status(400).json({ error: error.message || "Server error while initializing pipeline" });
    }
  },

  /**
   * POST - Assign reviewers to a specific stage (role 3)
   */
  async assignReviewers(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await userModel.findById(req.user.userId);
      if (user.role_id !== 3) {
        return res.status(403).json({ error: "Only Application Admins can access this endpoint." });
      }

      const stageId = parseInt(req.params.stageId);
      const { reviewers } = req.body;
      const reviewerIds = reviewers.map((r) => r.user_id);

      const result = await pipelineModel.assignReviewers(stageId, reviewerIds, req.user.userId);

      res.status(200).json({
        message: "Reviewers assigned successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error assigning reviewers:", error);
      res.status(400).json({ error: error.message || "Server error while assigning reviewers" });
    }
  },

  /**
   * GET - Full pipeline details for an application (role 3)
   */
  async getApplicationPipeline(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await userModel.findById(req.user.userId);
      if (user.role_id !== 3) {
        return res.status(403).json({ error: "Only Application Admins can access this endpoint." });
      }

      const applicationId = parseInt(req.params.id);
      const stages = await pipelineModel.getApplicationPipeline(applicationId);

      res.status(200).json({ stages });
    } catch (error) {
      console.error("Error fetching pipeline:", error);
      res.status(500).json({ error: "Server error while fetching pipeline details" });
    }
  },

  /**
   * POST - Reviewer submits decision (approve/reject/return)
   */
  async processReview(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const reviewerId = parseInt(req.params.reviewerId);
      const { decision, comments } = req.body;

      const result = await pipelineModel.processReviewerDecision(
        reviewerId,
        decision,
        comments || null,
        req.user.userId
      );

      res.status(200).json({
        message: "Review decision submitted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error processing review:", error);
      res.status(400).json({ error: error.message || "Server error while processing review" });
    }
  },

  /**
   * GET - Get logged-in user's review assignments
   */
  async getMyReviews(req, res) {
    try {
      const reviews = await pipelineModel.getPendingReviewsForUser(req.user.userId);
      res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Server error while fetching reviews" });
    }
  },

  /**
   * GET - Client's sanitized pipeline view (session auth)
   */
  async getClientPipelineStatus(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const applicationId = parseInt(req.params.id);

      // Verify the client owns this application
      const db = require("../config/db");
      const [apps] = await db.query(
        "SELECT client_id FROM applications WHERE id = ?",
        [applicationId]
      );
      if (!apps[0]) {
        return res.status(404).json({ error: "Application not found" });
      }
      if (apps[0].client_id !== req.user.userId) {
        return res.status(403).json({ error: "You can only view your own applications" });
      }

      const stages = await pipelineModel.getClientPipelineView(applicationId);
      res.status(200).json({ stages });
    } catch (error) {
      console.error("Error fetching client pipeline status:", error);
      res.status(500).json({ error: "Server error while fetching pipeline status" });
    }
  },

  /**
   * GET - Pipeline audit log (role 3)
   */
  async getPipelineAuditLog(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await userModel.findById(req.user.userId);
      if (user.role_id !== 3) {
        return res.status(403).json({ error: "Only Application Admins can access this endpoint." });
      }

      const applicationId = parseInt(req.params.id);
      const log = await pipelineModel.getPipelineAuditLog(applicationId);
      res.status(200).json(log);
    } catch (error) {
      console.error("Error fetching audit log:", error);
      res.status(500).json({ error: "Server error while fetching audit log" });
    }
  },
};

module.exports = pipelineController;
