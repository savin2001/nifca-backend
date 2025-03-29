// src/models/userModel.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userModel = {
  async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  async findByVerificationToken(token) {
    const [rows] = await db.query("SELECT * FROM users WHERE verification_token = ?", [token]);
    return rows[0];
  },

  async create({ username, email, password, role_id, company_id, created_by }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const [result] = await db.query(
      "INSERT INTO users (username, email, password_hash, role_id, company_id, created_by, verification_token, status, enabled) VALUES (?, ?, ?, ?, ?, ?, ?, 'inactive', 0)",
      [username, email, hashedPassword, role_id, company_id, created_by, verificationToken]
    );
    return { id: result.insertId, verificationToken };
  },

  async validateRole(role_id) {
    const [rows] = await db.query("SELECT * FROM roles WHERE id = ?", [role_id]);
    return rows[0];
  },

  async verifyEmail(userId) {
    await db.query(
      "UPDATE users SET verified_at = NOW(), verification_token = NULL, status = 'active' WHERE id = ?",
      [userId]
    );
  },

  async incrementFailedAttempts(userId) {
    await db.query("UPDATE users SET failed_attempts = failed_attempts + 1 WHERE id = ?", [userId]);
  },

  async resetFailedAttempts(userId) {
    await db.query("UPDATE users SET failed_attempts = 0 WHERE id = ?", [userId]);
  },

  async updateLastLogin(userId) {
    await db.query("UPDATE users SET last_login = NOW() WHERE id = ?", [userId]);
  },

  async storeToken(userId, token, expiresAt) {
    await db.query("INSERT INTO user_tokens (user_id, token, expires_at) VALUES (?, ?, ?)", [
      userId,
      token,
      expiresAt,
    ]);
  },

  async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password_hash = ?, enabled = 1 WHERE id = ?", [
      hashedPassword,
      userId,
    ]);
  },

  async removeToken(userId, token) {
    await db.query("DELETE FROM user_tokens WHERE user_id = ? AND token = ?", [userId, token]);
  },

  async removeAllTokens(userId) {
    await db.query("DELETE FROM user_tokens WHERE user_id = ?", [userId]);
  },

  // New methods for user management
  async getAllUsers() {
    const [rows] = await db.query("SELECT id, username, email, role_id, company_id, status, enabled, created_at, updated_at FROM users");
    return rows;
  },

  async updateUser(userId, updates) {
    const { username, email, role_id, company_id, status, enabled } = updates;
    await db.query(
      "UPDATE users SET username = ?, email = ?, role_id = ?, company_id = ?, status = ?, enabled = ?, updated_at = NOW() WHERE id = ?",
      [username, email, role_id, company_id, status, enabled, userId]
    );
    return await this.findById(userId);
  },

  async deleteUser(userId) {
    await db.query("DELETE FROM user_tokens WHERE user_id = ?", [userId]);
    await db.query("DELETE FROM users WHERE id = ?", [userId]);
  },
};

module.exports = userModel;