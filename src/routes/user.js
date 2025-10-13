// src/routes/user.js
const express = require("express");
const { body, param } = require("express-validator");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const validateUserId = param("id").isInt().withMessage("User ID must be an integer");
const validateUserUpdate = [
  body("username").optional().isString().isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("role_id").optional().isInt().withMessage("Role ID must be an integer"),
  body("company_id").optional().isInt().withMessage("Company ID must be an integer"),
  body("status").optional().isIn(["active", "inactive"]).withMessage("Status must be 'active' or 'inactive'"),
  body("enabled").optional().isBoolean().withMessage("Enabled must be a boolean"),
];
const validatePasswordReset = body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long");

router.get("/", authMiddleware, userController.getUsers);
router.get("/:id", authMiddleware, validateUserId, userController.getUserById);
router.put("/:id", authMiddleware, validateUserId, validateUserUpdate, userController.updateUser);
router.delete("/:id", authMiddleware, validateUserId, userController.deleteUser);
router.patch("/:id/disable", authMiddleware, validateUserId, userController.disableUser);
router.patch("/:id/enable", authMiddleware, validateUserId, userController.enableUser);
router.patch("/:id/reset-password", authMiddleware, validateUserId, validatePasswordReset, userController.resetPassword);
router.post("/:id/force-logout", authMiddleware, validateUserId, userController.forceLogoutUser);

module.exports = router;