// src/routes/clientApplication.js
const express = require("express");
const { body, param } = require("express-validator");
const clientApplicationController = require("../controllers/clientApplicationController");
const clientSessionMiddleware = require("../middlewares/clientSessionMiddleware");

const router = express.Router();

const validateApplicationId = param("id").isInt().withMessage("Application ID must be an integer");
const validateApplication = [
  body("title").isString().isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),
  body("description").isString().isLength({ min: 10 }).withMessage("Description must be at least 10 characters long"),
];

router.post("/", clientSessionMiddleware, validateApplication, clientApplicationController.createApplication);
router.get("/", clientSessionMiddleware, clientApplicationController.getClientApplications);
router.patch("/:id/cancel", clientSessionMiddleware, validateApplicationId, clientApplicationController.cancelApplication);

module.exports = router;