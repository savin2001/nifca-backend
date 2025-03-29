// src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const db = require("./config/db");
const authRoutes = require("./routes/auth");
const clientAuthRoutes = require("./routes/clientAuth");
const contentRoutes = require("./routes/content");
const userRoutes = require("./routes/user");
const clientRoutes = require("./routes/client");

const app = express();

// Session store configuration for clients
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 900000, // Check for expired sessions every 15 minutes
  expiration: 86400000, // Sessions expire after 24 hours
}, db);

// Apply session middleware only to client routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/client')) {
    session({
      key: "client_session",
      secret: process.env.SESSION_SECRET || "your-session-secret",
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production with HTTPS
      },
    })(req, res, next);
  } else {
    next();
  }
});

// Secure CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Replace with your frontend URL
  credentials: true,
}));

app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/client/auth", clientAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/content", contentRoutes);

module.exports = app;