// src/controllers/contentController.js
const contentModel = require("../models/contentModel");
const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const socialMediaService = require('../services/socialMediaService');

async function downloadImage(url, newsId) {
  if (!url) return null;
  try {
    const response = await axios({ 
      url, 
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
      }
    });
    const assetsDir = path.join(__dirname, '../assets/news');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    const randomString = Math.random().toString(36).substring(2, 7);
    const extension = path.extname(new URL(url).pathname);
    const filename = `nifca_news_${randomString}_${newsId}${extension}`;
    const imagePath = path.join(assetsDir, filename);
    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(`/assets/news/${filename}`));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading image:', error);
    return null;
  }
}

const contentController = {
  // News
  async createNews(req, res) {
    console.log('\n📥 === BACKEND: Received News Creation Request ===');

    const userId = req.user.userId;
    const { title, content, picture: pictureUrl, post_to_twitter, post_to_linkedin } = req.body;
    const uploadedFile = req.file;

    console.log('User ID:', userId);
    console.log('Request Body:', {
      title,
      content: content?.substring(0, 100) + '...',
      pictureUrl,
      post_to_twitter,
      post_to_linkedin
    });
    console.log('Uploaded File:', uploadedFile ? {
      filename: uploadedFile.filename,
      mimetype: uploadedFile.mimetype,
      size: uploadedFile.size
    } : null);
    console.log('Social Media Flags:');
    console.log('  post_to_twitter:', post_to_twitter, '(type:', typeof post_to_twitter, ')');
    console.log('  post_to_linkedin:', post_to_linkedin, '(type:', typeof post_to_linkedin, ')');

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can create news." });
      }

      // Validate required fields
      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }

      // Create news article first to get the newsId
      const newsId = await contentModel.createNews({ title, content, created_by: userId, picture: null });

      let picturePath = null;

      // Handle file upload (takes priority over URL)
      if (uploadedFile) {
        picturePath = `/assets/news/${uploadedFile.filename}`;
        await contentModel.updateNews(newsId, { picture: picturePath });
      }
      // Handle URL if no file was uploaded
      else if (pictureUrl) {
        picturePath = await downloadImage(pictureUrl, newsId);
        if (picturePath) {
          await contentModel.updateNews(newsId, { picture: picturePath });
        }
      }

      // Social media posting (async, non-blocking)
      let socialMediaResults = null;
      console.log('\n📱 Checking social media posting...');
      console.log('  Should post to Twitter?', !!post_to_twitter);
      console.log('  Should post to LinkedIn?', !!post_to_linkedin);

      if (post_to_twitter || post_to_linkedin) {
        console.log('✓ Social media posting requested - fetching news data...');
        const newsData = await contentModel.getNewsById(newsId);
        console.log('News Data for social media:', {
          id: newsData.id,
          title: newsData.title,
          content: newsData.content?.substring(0, 100) + '...',
          picture: newsData.picture
        });

        const socialMediaOptions = {
          twitter: post_to_twitter === true || post_to_twitter === 'true',
          linkedin: post_to_linkedin === true || post_to_linkedin === 'true'
        };
        console.log('Social Media Options:', socialMediaOptions);

        socialMediaService.postToSocialMedia('news', newsData, socialMediaOptions)
          .then(results => {
            console.log('\n✅ Social media posting completed!');
            console.log('Results:', JSON.stringify(results, null, 2));
          })
          .catch(err => {
            console.error('\n❌ Social media posting error!');
            console.error('Error:', err.message);
            console.error('Stack:', err.stack);
          });
      } else {
        console.log('✗ No social media posting requested');
      }

      console.log('\n📤 Sending response to frontend...');
      const responseData = {
        message: "News created successfully",
        newsId,
        picture: picturePath,
        socialMediaQueued: !!(post_to_twitter || post_to_linkedin)
      };
      console.log('Response Data:', responseData);
      console.log('📥 === BACKEND: News Creation Complete ===\n');

      res.status(201).json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating news" });
    }
  },

  async getAllNews(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const offset = (page - 1) * limit;

    try {
      const { total, rows: news } = await contentModel.getAllNewsPaginated({ limit, offset });
      
      const formattedNews = news.map(item => ({
        ...item,
        date: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(item.created_at)),
        body: item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content,
      }));

      res.status(200).json({
        news: formattedNews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while retrieving news" });
    }
  },

  // New method: Get News by ID
  async getNewsById(req, res) {
    const newsId = parseInt(req.params.id);

    try {
      const news = await contentModel.getNewsById(newsId);
      if (!news) {
        return res.status(404).json({ error: "News not found" });
      }
      res.status(200).json(news);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while retrieving news" });
    }
  },



  async updateNews(req, res) {
    const userId = req.user.userId;
    const newsId = parseInt(req.params.id);
    const { title, content, picture: pictureUrl } = req.body;
    const uploadedFile = req.file;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can update news." });
      }

      const news = await contentModel.getNewsById(newsId);
      if (!news) {
        return res.status(404).json({ error: "News not found" });
      }

      let picturePath = news.picture;

      // Handle file upload (takes priority over URL)
      if (uploadedFile) {
        picturePath = `/assets/news/${uploadedFile.filename}`;
      }
      // Handle URL if no file was uploaded
      else if (pictureUrl) {
        const downloadedPath = await downloadImage(pictureUrl, newsId);
        if (downloadedPath) {
          picturePath = downloadedPath;
        }
      }

      const updatedNews = await contentModel.updateNews(newsId, { title, content, picture: picturePath });
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
    const { title, content, post_to_twitter, post_to_linkedin } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can create press releases." });
      }

      const pressReleaseId = await contentModel.createPressRelease({ title, content, created_by: userId });

      // Social media posting (async, non-blocking)
      if (post_to_twitter || post_to_linkedin) {
        const pressReleaseData = await contentModel.getPressReleaseById(pressReleaseId);
        socialMediaService.postToSocialMedia('press_release', pressReleaseData, {
          twitter: post_to_twitter === true || post_to_twitter === 'true',
          linkedin: post_to_linkedin === true || post_to_linkedin === 'true'
        }).then(results => {
          console.log('Social media posting results:', results);
        }).catch(err => {
          console.error('Social media posting error:', err);
        });
      }

      res.status(201).json({
        message: "Press release created successfully",
        pressReleaseId,
        socialMediaQueued: !!(post_to_twitter || post_to_linkedin)
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating press release" });
    }
  },

  async getAllPressReleases(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const offset = (page - 1) * limit;

    try {
      const { total, rows: pressReleases } = await contentModel.getAllPressReleasesPaginated({ limit, offset });

      const formattedPressReleases = pressReleases.map(item => ({
        ...item,
        date: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(item.created_at)),
        body: item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content,
      }));

      res.status(200).json({
        pressReleases: formattedPressReleases,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while retrieving press releases" });
    }
  },

  // New method: Get Press Release by ID
  async getPressReleaseById(req, res) {
    const pressReleaseId = parseInt(req.params.id);

    try {
      const pressRelease = await contentModel.getPressReleaseById(pressReleaseId);
      if (!pressRelease) {
        return res.status(404).json({ error: "Press release not found" });
      }
      res.status(200).json(pressRelease);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while retrieving press release" });
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
    const userId = req.user.userId;
    const { title, description, event_start_date, event_end_date, location, picture: pictureUrl, post_to_twitter, post_to_linkedin } = req.body;
    const uploadedFile = req.file;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can create events." });
      }

      // Validate required fields
      if (!title || !description || !event_start_date || !location) {
        return res.status(400).json({ error: "Title, description, event_start_date, and location are required" });
      }

      // Create event first to get the ID
      const eventId = await contentModel.createEvent({ title, description, event_start_date, event_end_date, location, created_by: userId, picture: null });

      let picturePath = null;

      // Handle file upload (takes priority over URL)
      if (uploadedFile) {
        picturePath = `/assets/events/${uploadedFile.filename}`;
        await contentModel.updateEvent(eventId, { picture: picturePath });
      }
      // Handle URL if no file was uploaded
      else if (pictureUrl) {
        picturePath = await downloadImage(pictureUrl, eventId);
        if (picturePath) {
          await contentModel.updateEvent(eventId, { picture: picturePath });
        }
      }

      // Social media posting (async, non-blocking)
      if (post_to_twitter || post_to_linkedin) {
        const eventData = await contentModel.getEventById(eventId);
        socialMediaService.postToSocialMedia('event', eventData, {
          twitter: post_to_twitter === true || post_to_twitter === 'true',
          linkedin: post_to_linkedin === true || post_to_linkedin === 'true'
        }).then(results => {
          console.log('Social media posting results:', results);
        }).catch(err => {
          console.error('Social media posting error:', err);
        });
      }

      res.status(201).json({
        message: "Event created successfully",
        eventId,
        picture: picturePath,
        socialMediaQueued: !!(post_to_twitter || post_to_linkedin)
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating event" });
    }
  },

  async getAllEvents(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const offset = (page - 1) * limit;

    try {
      const { total, rows: events } = await contentModel.getAllEventsPaginated({ limit, offset });
      res.status(200).json({
        events,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while retrieving events" });
    }
  },

  // New method: Get Event by ID
  async getEventById(req, res) {
    const eventId = parseInt(req.params.id);

    try {
      const event = await contentModel.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while retrieving event" });
    }
  },
  

  async updateEvent(req, res) {
    const userId = req.user.userId;
    const eventId = parseInt(req.params.id);
    const { title, description, event_start_date, event_end_date, location, picture: pictureUrl } = req.body;
    const uploadedFile = req.file;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can update events." });
      }

      const event = await contentModel.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      let picturePath = event.picture;

      // Handle file upload (takes priority over URL)
      if (uploadedFile) {
        picturePath = `/assets/events/${uploadedFile.filename}`;
      }
      // Handle URL if no file was uploaded
      else if (pictureUrl) {
        const downloadedPath = await downloadImage(pictureUrl, eventId);
        if (downloadedPath) {
          picturePath = downloadedPath;
        }
      }

      const updateData = { title, description, event_start_date, event_end_date, location, picture: picturePath };
      const updatedEvent = await contentModel.updateEvent(eventId, updateData);
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
    const userId = req.user.userId;
    const { type, url, caption } = req.body;
    const uploadedFile = req.file;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can create gallery media." });
      }

      // Validate required fields
      if (!type) {
        return res.status(400).json({ error: "Type is required (picture or video)" });
      }

      if (!['picture', 'video'].includes(type)) {
        return res.status(400).json({ error: "Type must be 'picture' or 'video'" });
      }

      let mediaUrl = url;

      // Handle file upload (takes priority over URL)
      if (uploadedFile) {
        mediaUrl = `/assets/gallery/${uploadedFile.filename}`;
      } else if (!url) {
        return res.status(400).json({ error: "Either mediaFile or url must be provided" });
      }

      const mediaId = await contentModel.createGalleryMedia({ type, url: mediaUrl, caption, created_by: userId });
      res.status(201).json({ message: "Gallery media created successfully", mediaId, url: mediaUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating gallery media" });
    }
  },

  async getAllGalleryMedia(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
      const { total, rows: media } = await contentModel.getAllGalleryMediaPaginated({ limit, offset });
      res.status(200).json({
        media,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while retrieving gallery media" });
    }
  },

  // New method: Get Gallery Media by ID
  async getGalleryMediaById(req, res) {
    const mediaId = parseInt(req.params.id);

    try {
      const media = await contentModel.getGalleryMediaById(mediaId);
      if (!media) {
        return res.status(404).json({ error: "Gallery media not found" });
      }
      res.status(200).json(media);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while retrieving gallery media" });
    }
  },

  async updateGalleryMedia(req, res) {
    const userId = req.user.userId;
    const mediaId = parseInt(req.params.id);
    const { type, url, caption } = req.body;
    const uploadedFile = req.file;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 2) {
        return res.status(403).json({ error: "Only content admins can update gallery media." });
      }

      const media = await contentModel.getGalleryMediaById(mediaId);
      if (!media) {
        return res.status(404).json({ error: "Gallery media not found" });
      }

      let mediaUrl = media.url;

      // Handle file upload (takes priority over URL)
      if (uploadedFile) {
        mediaUrl = `/assets/gallery/${uploadedFile.filename}`;
      }
      // Handle URL if no file was uploaded
      else if (url) {
        mediaUrl = url;
      }

      const updatedMedia = await contentModel.updateGalleryMedia(mediaId, { type, url: mediaUrl, caption });
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