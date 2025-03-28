// src/controllers/contentController.js
const newsModel = require("../models/newsModel");
const pressReleaseModel = require("../models/pressReleaseModel");
const eventModel = require("../models/eventModel");
const galleryModel = require("../models/galleryModel");
const { validationResult } = require("express-validator");

const contentController = {
  // News Operations
  async createNews(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const userId = req.user.userId;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can create news." });
      }

      const news = await newsModel.create({ title, content, created_by: userId });
      res.status(201).json({ message: "News created successfully", news });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating news" });
    }
  },

  async getAllNews(req, res) {
    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can view news." });
      }

      const news = await newsModel.findAll();
      res.status(200).json(news);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching news" });
    }
  },

  async getNewsById(req, res) {
    const newsId = req.params.id;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can view news." });
      }

      const news = await newsModel.findById(newsId);
      if (!news) {
        return res.status(404).json({ error: "News not found" });
      }
      res.status(200).json(news);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching news" });
    }
  },

  async updateNews(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newsId = req.params.id;
    const { title, content } = req.body;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can update news." });
      }

      const news = await newsModel.findById(newsId);
      if (!news) {
        return res.status(404).json({ error: "News not found" });
      }

      const updatedNews = await newsModel.update(newsId, { title, content });
      res.status(200).json({ message: "News updated successfully", news: updatedNews });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while updating news" });
    }
  },

  async deleteNews(req, res) {
    const newsId = req.params.id;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can delete news." });
      }

      const news = await newsModel.findById(newsId);
      if (!news) {
        return res.status(404).json({ error: "News not found" });
      }

      await newsModel.delete(newsId);
      res.status(200).json({ message: "News deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while deleting news" });
    }
  },

  // Press Release Operations
  async createPressRelease(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, release_date } = req.body;
    const userId = req.user.userId;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can create press releases." });
      }

      const pressRelease = await pressReleaseModel.create({
        title,
        content,
        release_date,
        created_by: userId,
      });
      res.status(201).json({ message: "Press release created successfully", pressRelease });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating press release" });
    }
  },

  async getAllPressReleases(req, res) {
    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can view press releases." });
      }

      const pressReleases = await pressReleaseModel.findAll();
      res.status(200).json(pressReleases);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching press releases" });
    }
  },

  async getPressReleaseById(req, res) {
    const pressReleaseId = req.params.id;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can view press releases." });
      }

      const pressRelease = await pressReleaseModel.findById(pressReleaseId);
      if (!pressRelease) {
        return res.status(404).json({ error: "Press release not found" });
      }
      res.status(200).json(pressRelease);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching press release" });
    }
  },

  async updatePressRelease(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pressReleaseId = req.params.id;
    const { title, content, release_date } = req.body;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can update press releases." });
      }

      const pressRelease = await pressReleaseModel.findById(pressReleaseId);
      if (!pressRelease) {
        return res.status(404).json({ error: "Press release not found" });
      }

      const updatedPressRelease = await pressReleaseModel.update(pressReleaseId, {
        title,
        content,
        release_date,
      });
      res.status(200).json({ message: "Press release updated successfully", pressRelease: updatedPressRelease });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while updating press release" });
    }
  },

  async deletePressRelease(req, res) {
    const pressReleaseId = req.params.id;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can delete press releases." });
      }

      const pressRelease = await pressReleaseModel.findById(pressReleaseId);
      if (!pressRelease) {
        return res.status(404).json({ error: "Press release not found" });
      }

      await pressReleaseModel.delete(pressReleaseId);
      res.status(200).json({ message: "Press release deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while deleting press release" });
    }
  },

  // Event Operations
  async createEvent(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, event_date, location } = req.body;
    const userId = req.user.userId;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can create events." });
      }

      const event = await eventModel.create({
        title,
        description,
        event_date,
        location,
        created_by: userId,
      });
      res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating event" });
    }
  },

  async getAllEvents(req, res) {
    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can view events." });
      }

      const events = await eventModel.findAll();
      res.status(200).json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching events" });
    }
  },

  async getEventById(req, res) {
    const eventId = req.params.id;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can view events." });
      }

      const event = await eventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching event" });
    }
  },

  async updateEvent(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventId = req.params.id;
    const { title, description, event_date, location } = req.body;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can update events." });
      }

      const event = await eventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const updatedEvent = await eventModel.update(eventId, {
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
    const eventId = req.params.id;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can delete events." });
      }

      const event = await eventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      await eventModel.delete(eventId);
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while deleting event" });
    }
  },

  // Gallery Operations
  async createGalleryItem(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { media_type, url, caption } = req.body;
    const userId = req.user.userId;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can add gallery items." });
      }

      const galleryItem = await galleryModel.create({
        media_type,
        url,
        caption,
        created_by: userId,
      });
      res.status(201).json({ message: "Gallery item created successfully", galleryItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating gallery item" });
    }
  },

  async getAllGalleryItems(req, res) {
    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can view gallery items." });
      }

      const galleryItems = await galleryModel.findAll();
      res.status(200).json(galleryItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching gallery items" });
    }
  },

  async getGalleryItemById(req, res) {
    const galleryItemId = req.params.id;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can view gallery items." });
      }

      const galleryItem = await galleryModel.findById(galleryItemId);
      if (!galleryItem) {
        return res.status(404).json({ error: "Gallery item not found" });
      }
      res.status(200).json(galleryItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching gallery item" });
    }
  },

  async updateGalleryItem(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const galleryItemId = req.params.id;
    const { media_type, url, caption } = req.body;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can update gallery items." });
      }

      const galleryItem = await galleryModel.findById(galleryItemId);
      if (!galleryItem) {
        return res.status(404).json({ error: "Gallery item not found" });
      }

      const updatedGalleryItem = await galleryModel.update(galleryItemId, {
        media_type,
        url,
        caption,
      });
      res.status(200).json({ message: "Gallery item updated successfully", galleryItem: updatedGalleryItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while updating gallery item" });
    }
  },

  async deleteGalleryItem(req, res) {
    const galleryItemId = req.params.id;

    try {
      if (req.user.role !== 2) {
        return res.status(403).json({ error: "Only Content Admins can delete gallery items." });
      }

      const galleryItem = await galleryModel.findById(galleryItemId);
      if (!galleryItem) {
        return res.status(404).json({ error: "Gallery item not found" });
      }

      await galleryModel.delete(galleryItemId);
      res.status(200).json({ message: "Gallery item deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while deleting gallery item" });
    }
  },
};

module.exports = contentController;