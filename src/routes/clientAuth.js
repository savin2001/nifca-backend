// src/routes/clientAuth.js
const express = require("express");
const { body, query } = require("express-validator");
const clientController = require("../controllers/clientController");
const clientAuthMiddleware = require("../middlewares/clientAuthMiddleware");

const router = express.Router();

const validateRegistration = [
  body("username").isString().isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("company_id").optional().isInt().withMessage("Company ID must be an integer"),
];

const validatePasswordChange = [
  body("oldPassword").isLength({ min: 6 }).withMessage("Old password must be at least 6 characters long"),
  body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
];

const validateActivation = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

const validatePasswordResetRequest = [
  body("email").isEmail().withMessage("Invalid email format"),
];

const validatePasswordReset = [
  body("token").isString().withMessage("Reset token must be a string"),
  body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
];

router.post("/register", validateRegistration, clientController.register);
router.post("/login", clientController.login);
router.get("/session", clientAuthMiddleware, clientController.getSession);
router.get("/verify", query("token").isString(), clientController.verifyEmail);
router.post("/activate", validateActivation, clientController.activateAccount);
router.post("/request-password-reset", validatePasswordResetRequest, clientController.requestPasswordReset);
router.post("/reset-password", validatePasswordReset, clientController.resetPassword);
router.post("/change-password", clientAuthMiddleware, validatePasswordChange, clientController.changePassword);
router.post("/logout", clientAuthMiddleware, clientController.logout);

module.exports = router;