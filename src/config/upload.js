// src/config/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage for news images
const newsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../assets/news');
    ensureDirectoryExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const randomString = Math.random().toString(36).substring(2, 7);
    const extension = path.extname(file.originalname);
    const filename = `nifca_news_${randomString}_${Date.now()}${extension}`;
    cb(null, filename);
  }
});

// Configure storage for event images
const eventStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../assets/events');
    ensureDirectoryExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const randomString = Math.random().toString(36).substring(2, 7);
    const extension = path.extname(file.originalname);
    const filename = `nifca_event_${randomString}_${Date.now()}${extension}`;
    cb(null, filename);
  }
});

// Configure storage for gallery media
const galleryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../assets/gallery');
    ensureDirectoryExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const randomString = Math.random().toString(36).substring(2, 7);
    const extension = path.extname(file.originalname);
    const filename = `nifca_gallery_${randomString}_${Date.now()}${extension}`;
    cb(null, filename);
  }
});

// File filter to only accept images
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Create multer instances for different content types
const uploadNews = multer({
  storage: newsStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

const uploadEvent = multer({
  storage: eventStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

const uploadGallery = multer({
  storage: galleryStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for gallery
  }
});

module.exports = {
  uploadNews,
  uploadEvent,
  uploadGallery
};
