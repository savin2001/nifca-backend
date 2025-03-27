// src/models/userModel.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

class UserModel {
  // Find user by email
  async findByEmail(email) {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return users[0];
  }

  // Find user by ID
  async findById(id) {
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return users[0];
  }

  // Find user by verification token
  async findByVerificationToken(token) {
    const [users] = await db.query("SELECT * FROM users WHERE verification_token = ?", [token]);
    return users[0];
  }

  // Create a new user
  async create({ username, email, password, role_id, company_id, created_by }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const [result] = await db.query(
      "INSERT INTO users (username, email, password_hash, role_id, company_id, verification_token, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [username, email, passwordHash, role_id, company_id, verificationToken, "inactive", created_by]
    );
    return { id: result.insertId, email, verificationToken };
  }

  // Get all users
  async getAll() {
    const [users] = await db.query("SELECT id, username, email, role_id, status, enabled FROM users");
    return users;
  }

  // Update user details
  async update(id, { username, email, role_id, company_id }) {
    await db.query(
      "UPDATE users SET username = ?, email = ?, role_id = ?, company_id = ? WHERE id = ?",
      [username, email, role_id, company_id, id]
    );
    return this.findById(id);
  }

  // Soft delete user
  async softDelete(id) {
    await db.query("UPDATE users SET status = 'inactive' WHERE id = ?", [id]);
  }

  // Enable/disable user
  async setEnabled(id, enabled) {
    await db.query("UPDATE users SET enabled = ? WHERE id = ?", [enabled, id]);
  }

  // Update password
  async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password_hash = ?, enabled = TRUE, status = 'active' WHERE id = ?", [
      hashedPassword,
      id,
    ]);
  }

  // Update role
  async updateRole(id, role_id) {
    await db.query("UPDATE users SET role_id = ? WHERE id = ?", [role_id, id]);
  }

  // Force logout (invalidate token)
  async forceLogout(id) {
    await db.query("UPDATE users SET token = NULL WHERE id = ?", [id]);
  }

  // Verify email
  async verifyEmail(userId) {
    await db.query(
      "UPDATE users SET verified_at = NOW(), verification_token = NULL WHERE id = ?",
      [userId]
    );
  }

  // Validate role exists
  async validateRole(role_id) {
    const [roles] = await db.query("SELECT name FROM roles WHERE id = ?", [role_id]);
    return roles[0];
  }

  // Validate company exists
  async validateCompany(company_id) {
    const [companies] = await db.query("SELECT id FROM companies WHERE id = ?", [company_id]);
    return companies[0];
  }
}

module.exports = new UserModel();