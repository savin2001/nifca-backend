// src/routes/content.js
const express = require("express");
const { body, param } = require("express-validator");
const contentController = require("../controllers/contentController");
const authMiddleware = require("../middlewares/authMiddleware");
const { uploadNews, uploadEvent, uploadGallery } = require("../config/upload");

const router = express.Router();

// Validation for JSON-based news (with URL)
const validateNewsJSON = [
  body("title").isString().isLength({ min: 1 }).withMessage("Title is required"),
  body("content").isString().isLength({ min: 1 }).withMessage("Content is required"),
  body("picture").optional().isURL().withMessage("Picture must be a valid URL"),
];

// Validation for form-data news (with file upload)
const validateNewsFormData = [
  body("title").isString().isLength({ min: 1 }).withMessage("Title is required"),
  body("content").isString().isLength({ min: 1 }).withMessage("Content is required"),
];

// Validation for JSON-based events (with URL)
const validateEventJSON = [
  body("title").isString().isLength({ min: 1 }).withMessage("Title is required"),
  body("description").isString().isLength({ min: 1 }).withMessage("Description is required"),
  body("event_start_date").isISO8601().withMessage("Event start date must be a valid ISO 8601 date"),
  body("event_end_date").optional({ checkFalsy: true }).isISO8601().withMessage("Event end date must be a valid ISO 8601 date"),
  body("location").isString().isLength({ min: 1 }).withMessage("Location is required"),
  body("picture").optional().isURL().withMessage("Picture must be a valid URL"),
];

// Validation for form-data events (with file upload)
const validateEventFormData = [
  body("title").isString().isLength({ min: 1 }).withMessage("Title is required"),
  body("description").isString().isLength({ min: 1 }).withMessage("Description is required"),
  body("event_start_date").isISO8601().withMessage("Event start date must be a valid ISO 8601 date"),
  body("event_end_date").optional({ checkFalsy: true }).isISO8601().withMessage("Event end date must be a valid ISO 8601 date"),
  body("location").isString().isLength({ min: 1 }).withMessage("Location is required"),
];

// Validation for JSON-based gallery (with URL)
const validateGalleryJSON = [
  body("type").isIn(["picture", "video"]).withMessage("Type must be 'picture' or 'video'"),
  body("url").isString().isLength({ min: 1 }).withMessage("URL is required"),
  body("caption").optional().isString(),
];

// Validation for form-data gallery (with file upload)
const validateGalleryFormData = [
  body("type").isIn(["picture", "video"]).withMessage("Type must be 'picture' or 'video'"),
  body("caption").optional().isString(),
];

// News - supports both file upload and URL
router.post("/news", authMiddleware, uploadNews.single('pictureFile'), contentController.createNews);
router.get("/news", contentController.getAllNews); // Public endpoint
router.get("/news/:id", param("id").isInt(), contentController.getNewsById);
router.put("/news/:id", authMiddleware, uploadNews.single('pictureFile'), contentController.updateNews);
router.delete("/news/:id", authMiddleware, param("id").isInt(), contentController.deleteNews);

// Press Releases
router.post("/press-releases", authMiddleware, validateNewsJSON, contentController.createPressRelease);
router.get("/press-releases", contentController.getAllPressReleases); // Public endpoint
router.get("/press-releases/:id", param("id").isInt(), contentController.getPressReleaseById); // New route
router.put("/press-releases/:id", authMiddleware, validateNewsJSON, contentController.updatePressRelease);
router.delete("/press-releases/:id", authMiddleware, param("id").isInt(), contentController.deletePressRelease);

// Events - supports both file upload and URL
router.post("/events", authMiddleware, uploadEvent.single('pictureFile'), contentController.createEvent);
router.get("/events", contentController.getAllEvents); // Public endpoint
router.get("/events/:id", param("id").isInt(), contentController.getEventById);
router.put("/events/:id", authMiddleware, uploadEvent.single('pictureFile'), contentController.updateEvent);
router.delete("/events/:id", authMiddleware, param("id").isInt(), contentController.deleteEvent);

// Gallery Media - supports both file upload and URL
router.post("/gallery", authMiddleware, uploadGallery.single('mediaFile'), contentController.createGalleryMedia);
router.get("/gallery", contentController.getAllGalleryMedia); // Public endpoint
router.get("/gallery/:id", param("id").isInt(), contentController.getGalleryMediaById);
router.put("/gallery/:id", authMiddleware, uploadGallery.single('mediaFile'), contentController.updateGalleryMedia);
router.delete("/gallery/:id", authMiddleware, param("id").isInt(), contentController.deleteGalleryMedia);

module.exports = router;