// src/config/uploadApplicationDocs.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists for an application
const ensureApplicationDirectoryExists = (applicationId) => {
  const dir = path.join(__dirname, "../assets/applications", String(applicationId));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

// Configure storage for application documents
const applicationDocStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const applicationId = req.params.id || req.body.applicationId;
    if (!applicationId) {
      return cb(new Error("Application ID is required"));
    }
    const dir = ensureApplicationDirectoryExists(applicationId);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const randomString = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();
    const extension = path.extname(file.originalname).toLowerCase();
    const sanitizedOriginalName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .substring(0, 50);
    const filename = `doc_${randomString}_${timestamp}${extension}`;
    cb(null, filename);
  },
});

// Allowed MIME types for application documents
const allowedMimeTypes = [
  // PDF
  "application/pdf",
  // Microsoft Word
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Microsoft Excel
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Allowed file extensions
const allowedExtensions = /\.(pdf|doc|docx|xls|xlsx|jpg|jpeg|png|gif|webp)$/i;

// File filter for application documents
const applicationDocFileFilter = (req, file, cb) => {
  const extname = allowedExtensions.test(file.originalname.toLowerCase());
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Invalid file type. Allowed types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, WEBP"
    )
  );
};

// Create multer instance for application documents
const uploadApplicationDoc = multer({
  storage: applicationDocStorage,
  fileFilter: applicationDocFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1, // Single file per request
  },
});

// Create multer instance for multiple documents
const uploadApplicationDocs = multer({
  storage: applicationDocStorage,
  fileFilter: applicationDocFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10, // Max 10 files per request
  },
});

// Helper to get relative file path for database storage
const getRelativeFilePath = (applicationId, filename) => {
  return `assets/applications/${applicationId}/${filename}`;
};

// Helper to delete application directory when application is deleted
const deleteApplicationDirectory = (applicationId) => {
  const dir = path.join(__dirname, "../assets/applications", String(applicationId));
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

// Ensure base applications directory exists on module load
const baseDir = path.join(__dirname, "../assets/applications");
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// Ensure pdfs directory exists on module load
const pdfsDir = path.join(__dirname, "../assets/pdfs");
if (!fs.existsSync(pdfsDir)) {
  fs.mkdirSync(pdfsDir, { recursive: true });
}

module.exports = {
  uploadApplicationDoc,
  uploadApplicationDocs,
  getRelativeFilePath,
  deleteApplicationDirectory,
  ensureApplicationDirectoryExists,
  allowedMimeTypes,
  allowedExtensions,
};
