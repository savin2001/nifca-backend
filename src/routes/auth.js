const express = require("express");
const { check } = require("express-validator");
const {
  registerUser,
  loginUser,
  verifyEmail,
  changePassword,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware"); // Ensure JWT is checked

const router = express.Router();

// Register route
router.post(
  "/register/client",
  [
    check("username").notEmpty().withMessage("Username is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    check("role_id").isInt().withMessage("Role ID must be a number"),
  ],
  registerUser
);

router.post(
  "/register",
  authMiddleware,
  [
    check("username").notEmpty().withMessage("Username is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    check("role_id").isInt().withMessage("Role ID must be a number"),
  ],
  registerUser
);

// Login route
router.post("/login", loginUser);

// Email verification route
router.get("/verify", verifyEmail);

// ✅ Change password route (requires authentication)
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
