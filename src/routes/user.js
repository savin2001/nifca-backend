// src/routes/user.js
const express = require("express");
const { body, param } = require("express-validator");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

const validateUserId = param("userId").isInt().withMessage("User ID must be an integer");
const validateUserModification = [
  body("username").isString().isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("role_id").isInt().withMessage("Role ID must be an integer"),
  body("company_id").optional().isInt().withMessage("Company ID must be an integer if provided"),
];
const validatePasswordReset = body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long");
const validateRoleUpdate = body("role_id").isInt().withMessage("Role ID must be an integer");

router.put(
  "/:userId",
  authMiddleware,
  adminMiddleware,
  validateUserId,
  validateUserModification,
  userController.modifyUser
);
router.delete("/:userId", authMiddleware, adminMiddleware, validateUserId, userController.deleteUser);
router.patch("/:userId/disable", authMiddleware, adminMiddleware, validateUserId, userController.disableUser);
router.patch("/:userId/enable", authMiddleware, adminMiddleware, validateUserId, userController.enableUser);
router.patch(
  "/:userId/reset-password",
  authMiddleware,
  adminMiddleware,
  validateUserId,
  validatePasswordReset,
  userController.resetPassword
);
router.patch(
  "/:userId/update-role",
  authMiddleware,
  adminMiddleware,
  validateUserId,
  validateRoleUpdate,
  userController.updateUserRole
);
router.post(
  "/:userId/force-logout",
  authMiddleware,
  adminMiddleware,
  validateUserId,
  userController.forceLogoutUser
);

router.get("/", authMiddleware, userController.getUsers);
router.get("/:userId", authMiddleware, validateUserId, userController.getUserById);

module.exports = router;