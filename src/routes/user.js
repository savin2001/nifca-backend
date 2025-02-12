const express = require("express");
const { body, param } = require("express-validator");
const {
    modifyUser,
    deleteUser,
    disableUser,
    enableUser,
    resetPassword,
    getUsers,
    getUserById,
    updateUserRole,
    forceLogoutUser
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

// Validation rules
const validateUserId = param("userId").isInt().withMessage("User ID must be an integer");
const validateUserModification = [
    body("username").isString().isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("role_id").isInt().withMessage("Role ID must be an integer"),
    body("company_id").optional().isInt().withMessage("Company ID must be an integer if provided")
];
const validatePasswordReset = body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long");
const validateRoleUpdate = body("role_id").isInt().withMessage("Role ID must be an integer");

// Apply adminMiddleware to all sensitive routes
router.put(
    "/:userId",
    authMiddleware,
    adminMiddleware,
    validateUserId,
    validateUserModification,
    modifyUser
);
router.delete("/:userId", authMiddleware, adminMiddleware, validateUserId, deleteUser);
router.patch("/:userId/disable", authMiddleware, adminMiddleware, validateUserId, disableUser);
router.patch("/:userId/enable", authMiddleware, adminMiddleware, validateUserId, enableUser);
router.patch("/:userId/reset-password", authMiddleware, adminMiddleware, validateUserId, validatePasswordReset, resetPassword);
router.patch("/:userId/update-role", authMiddleware, adminMiddleware, validateUserId, validateRoleUpdate, updateUserRole);
router.post("/:userId/force-logout", authMiddleware, adminMiddleware, validateUserId, forceLogoutUser);

// Normal users can fetch users, but only authenticated ones
router.get("/", authMiddleware, getUsers);
router.get("/:userId", authMiddleware, validateUserId, getUserById);

module.exports = router;
