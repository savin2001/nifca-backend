// src/middleware/clientSessionMiddleware.js
const clientModel = require("../models/clientModel");

const clientSessionMiddleware = async (req, res, next) => {
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

    req.user = {
      ...req.session.user,
      isClient: true,
    };
    next();
  } else {
    return res.status(401).json({ error: "Not authenticated. Please log in." });
  }
};

module.exports = clientSessionMiddleware;