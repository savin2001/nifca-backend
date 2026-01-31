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
const applicationRoutes = require("./routes/application"); // New
const clientApplicationRoutes = require("./routes/clientApplication"); // New
const multiSectionApplicationRoutes = require("./routes/multiSectionApplication"); // Multi-section applications
const linkedinOAuthRoutes = require("./routes/linkedinOAuth"); // LinkedIn OAuth
const path = require('path');

const app = express();


// Secure CORS configuration - allow multiple origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  " http://localhost:5173"
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Serve static files from the assets directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Also ensure events directory exists
const fs = require('fs');
const eventsDir = path.join(__dirname, 'assets/events');
if (!fs.existsSync(eventsDir)) {
  fs.mkdirSync(eventsDir, { recursive: true });
}

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


app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/client/auth", clientAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/applications", applicationRoutes); // New
// Client routes - order matters! More specific routes first
app.use("/api/client/multi-applications", multiSectionApplicationRoutes); // Multi-section applications
app.use("/api/client/applications", clientApplicationRoutes); // Client applications
app.use("/api/client", clientRoutes); // General client routes (must be last)
app.use("/api/linkedin", linkedinOAuthRoutes); // LinkedIn OAuth

module.exports = app;