// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const actualToken = token.replace("Bearer ", "");
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if the user still exists and is active
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found. Please log in again." });
    }

    if (user.status === "inactive") {
      return res.status(403).json({ error: "Account has been deactivated. Please contact support." });
    }

    // Check if the token is still valid in the user_tokens table
    const isValid = await userModel.isTokenValid(decoded.userId, actualToken);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid token. Please log in again." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token. Please log in again." });
  }
};

module.exports = authMiddleware;