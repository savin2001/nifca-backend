// src/config/sessionStore.js
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const db = require("./db");

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

module.exports = sessionStore;