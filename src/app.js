// src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const db = require("./config/db");
const authRoutes = require("./routes/auth");
const sessionStore = require("./config/sessionStore"); //shared session storage
const clientAuthRoutes = require("./routes/clientAuth");
const contentRoutes = require("./routes/content");
const userRoutes = require("./routes/user");
const clientRoutes = require("./routes/client");
const applicationRoutes = require("./routes/application"); // New
const clientApplicationRoutes = require("./routes/clientApplication"); // New

const app = express();

// Session store configuration for clients
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
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
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })(req, res, next);
  } else {
    next();
  }
});

// Secure CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/client/auth", clientAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/applications", applicationRoutes); // New
app.use("/api/client/applications", clientApplicationRoutes); // New

module.exports = app;