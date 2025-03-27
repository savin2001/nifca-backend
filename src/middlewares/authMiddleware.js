// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;

    // Check if the user still exists and is active
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found. Please log in again." });
    }

    if (user.status === "inactive") {
      return res.status(403).json({ error: "Account has been deactivated. Please contact support." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token. Please log in again." });
  }
};

module.exports = authMiddleware;