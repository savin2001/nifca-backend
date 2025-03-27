// src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const db = require("./config/db");
const authRoutes = require("./routes/auth");
const clientAuthRoutes = require("./routes/clientAuth"); // New client auth routes
const userRoutes = require("./routes/user");
const clientRoutes = require("./routes/client");

const app = express();

// Session store configuration
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

// Session middleware for clients
app.use(
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
  })
);

// Other middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/client/auth", clientAuthRoutes); // New client auth routes
app.use("/api/users", userRoutes);
app.use("/api/client", clientRoutes);

module.exports = app;