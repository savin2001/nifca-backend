// src/routes/auth.js
const express = require("express");
const { body, query } = require("express-validator");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const validateRegistration = [
  body("username").isString().isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("role_id").isInt().withMessage("Role ID must be an integer"),
  body("company_id").optional().isInt().withMessage("Company ID must be an integer if provided"),
];

const validatePasswordChange = [
  body("oldPassword").isLength({ min: 6 }).withMessage("Old password must be at least 6 characters long"),
  body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
];

router.post("/register", authMiddleware, validateRegistration, authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/verify", query("token").isString(), authController.verifyEmail);
router.post("/change-password", authMiddleware, validatePasswordChange, authController.changePassword);
router.post("/logout", authMiddleware, authController.logoutUser);

module.exports = router;