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
    console.log("Token received:", actualToken); // Debug log

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug log
    req.user = decoded;

    // Check if the user still exists and is active
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      console.log("User not found for ID:", decoded.userId); // Debug log
      return res.status(401).json({ error: "User not found. Please log in again." });
    }

    if (user.status === "inactive") {
      console.log("User is inactive:", user.email); // Debug log
      return res.status(403).json({ error: "Account has been deactivated. Please contact support." });
    }

    // Check if the token is still valid in the user_tokens table
    const isValid = await userModel.isTokenValid(decoded.userId, actualToken);
    if (!isValid) {
      console.log("Token validation failed for user ID:", decoded.userId); // Debug log
      const [tokens] = await db.query("SELECT * FROM user_tokens WHERE user_id = ?", [decoded.userId]);
      console.log("Stored tokens for user:", tokens); // Debug log
      return res.status(401).json({ error: "Invalid token. Please log in again." });
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error.message); // Debug log
    return res.status(401).json({ error: "Invalid token. Please log in again." });
  }
};

module.exports = authMiddleware;