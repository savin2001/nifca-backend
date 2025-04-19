// src/routes/client.js
const express = require("express");
const clientSessionMiddleware = require("../middlewares/clientSessionMiddleware"); // Use the same middleware

const router = express.Router();

// No application-related routes here; they’re handled by clientApplication.js
// Add other client routes in the future if needed (e.g., profile management)

module.exports = router;