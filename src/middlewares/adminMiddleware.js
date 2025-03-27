// src/middleware/adminMiddleware.js
const userModel = require("../models/userModel");

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Unauthorized. User not found in request." });
    }

    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(403).json({ error: "User not found." });
    }

    if (user.role_id !== 1) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while checking admin privileges." });
  }
};

module.exports = adminMiddleware;