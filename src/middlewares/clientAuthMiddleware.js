// src/middlewares/clientAuthMiddleware.js
const clientModel = require("../models/clientModel");

const clientAuthMiddleware = async (req, res, next) => {
  console.log('=== CLIENT AUTH MIDDLEWARE ===');
  console.log('Session exists:', !!req.session);
  console.log('Session user:', req.session?.user);
  console.log('Request path:', req.path);

  if (req.session && req.session.user) {
    // Verify that the client still exists and is active
    const client = await clientModel.findById(req.session.user.userId);
    console.log('Client lookup result:', client ? 'Found' : 'Not found');

    if (!client) {
      console.log('Client not found, destroying session');
      req.session.destroy();
      return res.status(401).json({ error: "Client not found. Please log in again." });
    }

    if (client.status === "inactive") {
      console.log('Client status is inactive');
      req.session.destroy();
      return res.status(403).json({ error: "Account has been deactivated. Please contact support." });
    }

    if (!client.enabled) {
      console.log('Client not enabled');
      req.session.destroy();
      return res.status(403).json({
        error: "Please activate your account before proceeding",
        redirect: "/activate-account",
      });
    }

    req.user = {
      ...req.session.user,
      isClient: true,
    };
    console.log('Auth successful, user set:', req.user);
    next();
  } else {
    console.log('No session or user, rejecting request');
    return res.status(401).json({ error: "Not authenticated. Please log in." });
  }
};

module.exports = clientAuthMiddleware;