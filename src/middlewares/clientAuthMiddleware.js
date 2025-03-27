// src/middlewares/clientAuthMiddleware.js
const clientModel = require("../models/clientModel");

const clientAuthMiddleware = async (req, res, next) => {
  if (req.session && req.session.user) {
    // Verify that the client still exists and is active
    const client = await clientModel.findById(req.session.user.userId);
    if (!client) {
      req.session.destroy();
      return res.status(401).json({ error: "Client not found. Please log in again." });
    }

    if (client.status === "inactive") {
      req.session.destroy();
      return res.status(403).json({ error: "Account has been deactivated. Please contact support." });
    }

    if (!client.enabled) {
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
    next();
  } else {
    return res.status(401).json({ error: "Not authenticated. Please log in." });
  }
};

module.exports = clientAuthMiddleware;