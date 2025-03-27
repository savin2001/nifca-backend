// src/routes/auth.js
const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/register/client",
  [
    check("username").notEmpty().withMessage("Username is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    check("role_id").isInt().withMessage("Role ID must be a number"),
  ],
  authController.registerUser
);

router.post(
  "/register",
  authMiddleware,
  [
    check("username").notEmpty().withMessage("Username is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    check("role_id").isInt().withMessage("Role ID must be a number"),
  ],
  authController.registerUser
);

router.post("/login", authController.loginUser);
router.get("/verify", authController.verifyEmail);
router.post("/change-password", authMiddleware, authController.changePassword);
router.post("/logout", authMiddleware, authController.logoutUser);

module.exports = router;