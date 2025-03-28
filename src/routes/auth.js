// src/routes/auth.js
const express = require("express");
const { body, param, query } = require("express-validator");
const authController = require("../controllers/authController");
const contentController = require("../controllers/contentController");
const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const validateRegistration = [
  body("username").isString().isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("role_id").isInt().withMessage("Role ID must be an integer"),
  body("company_id").isInt().withMessage("Company ID must be an integer"),
];

const validatePasswordChange = [
  body("oldPassword").isLength({ min: 6 }).withMessage("Old password must be at least 6 characters long"),
  body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
];

// User Management (Site Admin)
router.post("/register", authMiddleware, validateRegistration, authController.registerUser);
router.get("/users", authMiddleware, authController.getAllUsers);
router.get("/users/:id", authMiddleware, [param("id").isInt()], authController.getUserById);
router.put(
  "/users/:id",
  authMiddleware,
  [
    param("id").isInt(),
    body("username").optional().isString().isLength({ min: 3 }),
    body("email").optional().isEmail(),
    body("role_id").optional().isInt(),
    body("company_id").optional().isInt(),
    body("status").optional().isIn(["active", "inactive"]),
    body("enabled").optional().isBoolean(),
  ],
  authController.updateUser
);
router.delete("/users/:id", authMiddleware, [param("id").isInt()], authController.deleteUser);

// Authentication Routes
router.post("/login", authController.loginUser);
router.get("/verify", [query("token").isString()], authController.verifyEmail);
router.post("/change-password", authMiddleware, validatePasswordChange, authController.changePassword);
router.post("/logout", authMiddleware, authController.logoutUser);

// Content Admin Routes
router.post(
  "/news",
  authMiddleware,
  [
    body("title").isString().notEmpty(),
    body("content").isString().notEmpty(),
  ],
  contentController.createNews
);
router.get("/news", authMiddleware, contentController.getAllNews);
router.get("/news/:id", authMiddleware, [param("id").isInt()], contentController.getNewsById);
router.put(
  "/news/:id",
  authMiddleware,
  [
    param("id").isInt(),
    body("title").isString().notEmpty(),
    body("content").isString().notEmpty(),
  ],
  contentController.updateNews
);
router.delete("/news/:id", authMiddleware, [param("id").isInt()], contentController.deleteNews);

router.post(
  "/press-releases",
  authMiddleware,
  [
    body("title").isString().notEmpty(),
    body("content").isString().notEmpty(),
    body("release_date").isDate(),
  ],
  contentController.createPressRelease
);
router.get("/press-releases", authMiddleware, contentController.getAllPressReleases);
router.get("/press-releases/:id", authMiddleware, [param("id").isInt()], contentController.getPressReleaseById);
router.put(
  "/press-releases/:id",
  authMiddleware,
  [
    param("id").isInt(),
    body("title").isString().notEmpty(),
    body("content").isString().notEmpty(),
    body("release_date").isDate(),
  ],
  contentController.updatePressRelease
);
router.delete("/press-releases/:id", authMiddleware, [param("id").isInt()], contentController.deletePressRelease);

router.post(
  "/events",
  authMiddleware,
  [
    body("title").isString().notEmpty(),
    body("description").isString().notEmpty(),
    body("event_date").isISO8601(),
    body("location").isString().notEmpty(),
  ],
  contentController.createEvent
);
router.get("/events", authMiddleware, contentController.getAllEvents);
router.get("/events/:id", authMiddleware, [param("id").isInt()], contentController.getEventById);
router.put(
  "/events/:id",
  authMiddleware,
  [
    param("id").isInt(),
    body("title").isString().notEmpty(),
    body("description").isString().notEmpty(),
    body("event_date").isISO8601(),
    body("location").isString().notEmpty(),
  ],
  contentController.updateEvent
);
router.delete("/events/:id", authMiddleware, [param("id").isInt()], contentController.deleteEvent);

router.post(
  "/gallery",
  authMiddleware,
  [
    body("media_type").isIn(["image", "video"]),
    body("url").isString().notEmpty(),
    body("caption").optional().isString(),
  ],
  contentController.createGalleryItem
);
router.get("/gallery", authMiddleware, contentController.getAllGalleryItems);
router.get("/gallery/:id", authMiddleware, [param("id").isInt()], contentController.getGalleryItemById);
router.put(
  "/gallery/:id",
  authMiddleware,
  [
    param("id").isInt(),
    body("media_type").isIn(["image", "video"]),
    body("url").isString().notEmpty(),
    body("caption").optional().isString(),
  ],
  contentController.updateGalleryItem
);
router.delete("/gallery/:id", authMiddleware, [param("id").isInt()], contentController.deleteGalleryItem);

// Application Admin Routes
router.post(
  "/applications",
  authMiddleware,
  [
    body("client_id").isInt(),
    body("title").isString().notEmpty(),
    body("description").isString().notEmpty(),
  ],
  applicationController.createApplication
);
router.get("/applications", authMiddleware, applicationController.getAllApplications);
router.get("/applications/:id", authMiddleware, [param("id").isInt()], applicationController.getApplicationById);
router.put(
  "/applications/:id",
  authMiddleware,
  [
    param("id").isInt(),
    body("title").isString().notEmpty(),
    body("description").isString().notEmpty(),
    body("status").isIn(["pending", "approved", "rejected", "suspended", "canceled"]),
  ],
  applicationController.updateApplication
);
router.put(
  "/applications/:id/review",
  authMiddleware,
  [
    param("id").isInt(),
    body("status").isIn(["pending", "approved", "rejected", "suspended", "canceled"]),
  ],
  applicationController.reviewApplication
);
router.delete("/applications/:id", authMiddleware, [param("id").isInt()], applicationController.deleteApplication);

router.get("/clients", authMiddleware, applicationController.getAllClients);
router.get("/clients/:id", authMiddleware, [param("id").isInt()], applicationController.getClientById);
router.put(
  "/clients/:id",
  authMiddleware,
  [
    param("id").isInt(),
    body("username").optional().isString().isLength({ min: 3 }),
    body("email").optional().isEmail(),
    body("company_id").optional().isInt(),
    body("status").optional().isIn(["active", "inactive"]),
    body("enabled").optional().isBoolean(),
  ],
  applicationController.updateClient
);
router.delete("/clients/:id", authMiddleware, [param("id").isInt()], applicationController.deleteClient);

module.exports = router;