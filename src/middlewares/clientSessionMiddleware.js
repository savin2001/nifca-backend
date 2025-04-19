// src/middlewares/clientSessionMiddleware.js
const userModel = require("../models/clientModel");

const clientSessionMiddleware = async (req, res, next) => {
  // Check if session exists and contains user data
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Access denied. Please log in." });
  }

  console.log("Session user data:", req.session.user); // Debug log

  try {
    // Retrieve user from database using session data
    const user = await userModel.findById(req.session.user.userId);
    console.log("User lookup result for userId", req.session.user.userId, ":", user); // Debug log

    if (!user) {
      return res.status(401).json({ error: "User not found. Please log in again." });
    }


    // Check if the user is active and enabled
    if (user.status === "inactive") {
      return res.status(403).json({ error: "Account has been deactivated. Please contact support." });
    }

    if (!user.enabled) {
      return res.status(403).json({ error: "Account is disabled. Please contact support." });
    }

    if (user.deleted_at) {
      return res.status(403).json({ error: "Account has been deleted. Please contact support." });
    }

    // Attach user data to the request for use in controllers
    req.client = {
      userId: user.id,
      role: user.role_id,
      companyId: user.company_id,
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during authentication." });
  }
};

module.exports = clientSessionMiddleware;