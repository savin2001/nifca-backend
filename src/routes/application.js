// src/routes/application.js
const express = require("express");
const { body, param } = require("express-validator");
const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const validateClientId = param("id").isInt().withMessage("Client ID must be an integer");
const validateApplicationId = param("id").isInt().withMessage("Application ID must be an integer");
const validateReview = [
  body("status").isIn(["approved", "rejected"]).withMessage("Status must be 'approved' or 'rejected'"),
  body("reviewComments").optional().isString().withMessage("Review comments must be a string"),
];

router.patch("/:id/disable", authMiddleware, validateClientId, applicationController.disableClient);
router.delete("/:id", authMiddleware, validateClientId, applicationController.softDeleteClient);
router.get("/", authMiddleware, applicationController.getAllApplications);
router.patch("/:id/review", authMiddleware, validateApplicationId, validateReview, applicationController.reviewApplication);

module.exports = router;