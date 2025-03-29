// src/controllers/contentController.js
const contentModel = require("../models/contentModel");
const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");

const contentController = {
  // News
  async createNews(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { title, content } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can create news." });
      }

      const newsId = await contentModel.createNews({ title, content, created_by: userId });
      res.status(201).json({ message: "News created successfully", newsId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating news" });
    }
  },

  async getAllNews(req, res) {
    try {
      const news = await contentModel.getAllNews();
      res.status(200).json(news);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while retrieving news" });
    }
  },

  async updateNews(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const newsId = parseInt(req.params.id);
    const { title, content } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can update news." });
      }

      const news = await contentModel.getNewsById(newsId);
      if (!news) {
        return res.status(404).json({ error: "News not found" });
      }

      const updatedNews = await contentModel.updateNews(newsId, { title, content });
      res.status(200).json({ message: "News updated successfully", news: updatedNews });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while updating news" });
    }
  },

  async deleteNews(req, res) {
    const userId = req.user.userId;
    const newsId = parseInt(req.params.id);

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can delete news." });
      }

      const news = await contentModel.getNewsById(newsId);
      if (!news) {
        return res.status(404).json({ error: "News not found" });
      }

      await contentModel.deleteNews(newsId);
      res.status(200).json({ message: "News deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while deleting news" });
    }
  },

  // Press Releases
  async createPressRelease(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { title, content } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can create press releases." });
      }

      const pressReleaseId = await contentModel.createPressRelease({ title, content, created_by: userId });
      res.status(201).json({ message: "Press release created successfully", pressReleaseId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating press release" });
    }
  },

  async getAllPressReleases(req, res) {
    try {
      const pressReleases = await contentModel.getAllPressReleases();
      res.status(200).json(pressReleases);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while retrieving press releases" });
    }
  },

  async updatePressRelease(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const pressReleaseId = parseInt(req.params.id);
    const { title, content } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can update press releases." });
      }

      const pressRelease = await contentModel.getPressReleaseById(pressReleaseId);
      if (!pressRelease) {
        return res.status(404).json({ error: "Press release not found" });
      }

      const updatedPressRelease = await contentModel.updatePressRelease(pressReleaseId, { title, content });
      res.status(200).json({ message: "Press release updated successfully", pressRelease: updatedPressRelease });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while updating press release" });
    }
  },

  async deletePressRelease(req, res) {
    const userId = req.user.userId;
    const pressReleaseId = parseInt(req.params.id);

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can delete press releases." });
      }

      const pressRelease = await contentModel.getPressReleaseById(pressReleaseId);
      if (!pressRelease) {
        return res.status(404).json({ error: "Press release not found" });
      }

      await contentModel.deletePressRelease(pressReleaseId);
      res.status(200).json({ message: "Press release deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while deleting press release" });
    }
  },

  // Events
  async createEvent(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { title, description, event_date, location } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can create events." });
      }

      const eventId = await contentModel.createEvent({
        title,
        description,
        event_date,
        location,
        created_by: userId,
      });
      res.status(201).json({ message: "Event created successfully", eventId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating event" });
    }
  },

  async getAllEvents(req, res) {
    try {
      const events = await contentModel.getAllEvents();
      res.status(200).json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while retrieving events" });
    }
  },

  async updateEvent(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const eventId = parseInt(req.params.id);
    const { title, description, event_date, location } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can update events." });
      }

      const event = await contentModel.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const updatedEvent = await contentModel.updateEvent(eventId, {
        title,
        description,
        event_date,
        location,
      });
      res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while updating event" });
    }
  },

  async deleteEvent(req, res) {
    const userId = req.user.userId;
    const eventId = parseInt(req.params.id);

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can delete events." });
      }

      const event = await contentModel.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      await contentModel.deleteEvent(eventId);
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while deleting event" });
    }
  },

  // Gallery Media
  async createGalleryMedia(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { type, url, caption } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can create gallery media." });
      }

      const mediaId = await contentModel.createGalleryMedia({ type, url, caption, created_by: userId });
      res.status(201).json({ message: "Gallery media created successfully", mediaId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating gallery media" });
    }
  },

  async getAllGalleryMedia(req, res) {
    try {
      const media = await contentModel.getAllGalleryMedia();
      res.status(200).json(media);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while retrieving gallery media" });
    }
  },

  async updateGalleryMedia(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const mediaId = parseInt(req.params.id);
    const { type, url, caption } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can update gallery media." });
      }

      const media = await contentModel.getGalleryMediaById(mediaId);
      if (!media) {
        return res.status(404).json({ error: "Gallery media not found" });
      }

      const updatedMedia = await contentModel.updateGalleryMedia(mediaId, { type, url, caption });
      res.status(200).json({ message: "Gallery media updated successfully", media: updatedMedia });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while updating gallery media" });
    }
  },

  async deleteGalleryMedia(req, res) {
    const userId = req.user.userId;
    const mediaId = parseInt(req.params.id);

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can delete gallery media." });
      }

      const media = await contentModel.getGalleryMediaById(mediaId);
      if (!media) {
        return res.status(404).json({ error: "Gallery media not found" });
      }

      await contentModel.deleteGalleryMedia(mediaId);
      res.status(200).json({ message: "Gallery media deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while deleting gallery media" });
    }
  },
};

module.exports = contentController;