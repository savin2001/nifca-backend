// src/routes/client.js
const express = require("express");
const clientAuthMiddleware = require("../middlewares/clientAuthMiddleware");

const router = express.Router();

// Note: Application routes have been moved to clientApplication.js
// This file is reserved for other client-specific routes (profile, settings, etc.)

module.exports = router;