// src/routes/content.js
const express = require("express");
const { body, param } = require("express-validator");
const contentController = require("../controllers/contentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const validateNews = [
  body("title").isString().isLength({ min: 1 }).withMessage("Title is required"),
  body("content").isString().isLength({ min: 1 }).withMessage("Content is required"),
];

const validateEvent = [
  body("title").isString().isLength({ min: 1 }).withMessage("Title is required"),
  body("description").isString().isLength({ min: 1 }).withMessage("Description is required"),
  body("event_date").isISO8601().withMessage("Event date must be a valid ISO 8601 date"),
  body("location").isString().isLength({ min: 1 }).withMessage("Location is required"),
];

const validateGalleryMedia = [
  body("type").isIn(["picture", "video"]).withMessage("Type must be 'picture' or 'video'"),
  body("url").isString().isLength({ min: 1 }).withMessage("URL is required"),
  body("caption").optional().isString(),
];

// News
router.post("/news", authMiddleware, validateNews, contentController.createNews);
router.get("/news", contentController.getAllNews); // Public endpoint
router.get("/news/:id", param("id").isInt(), contentController.getNewsById); // New route
router.put("/news/:id", authMiddleware, validateNews, contentController.updateNews);
router.delete("/news/:id", authMiddleware, param("id").isInt(), contentController.deleteNews);

// Press Releases
router.post("/press-releases", authMiddleware, validateNews, contentController.createPressRelease);
router.get("/press-releases", contentController.getAllPressReleases); // Public endpoint
router.get("/press-releases/:id", param("id").isInt(), contentController.getPressReleaseById); // New route
router.put("/press-releases/:id", authMiddleware, validateNews, contentController.updatePressRelease);
router.delete("/press-releases/:id", authMiddleware, param("id").isInt(), contentController.deletePressRelease);

// Events
router.post("/events", authMiddleware, validateEvent, contentController.createEvent);
router.get("/events", contentController.getAllEvents); // Public endpoint
router.get("/events/:id", param("id").isInt(), contentController.getEventById); // New route
router.put("/events/:id", authMiddleware, validateEvent, contentController.updateEvent);
router.delete("/events/:id", authMiddleware, param("id").isInt(), contentController.deleteEvent);

// Gallery Media
router.post("/gallery", authMiddleware, validateGalleryMedia, contentController.createGalleryMedia);
router.get("/gallery", contentController.getAllGalleryMedia); // Public endpoint
router.get("/gallery/:id", param("id").isInt(), contentController.getGalleryMediaById); // New route
router.put("/gallery/:id", authMiddleware, validateGalleryMedia, contentController.updateGalleryMedia);
router.delete("/gallery/:id", authMiddleware, param("id").isInt(), contentController.deleteGalleryMedia);

module.exports = router;