// src/models/clientModel.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

class ClientModel {
  // Find client by email
  async findByEmail(email) {
    const [clients] = await db.query("SELECT * FROM clients WHERE email = ?", [email]);
    return clients[0];
  }

  // Find client by ID
  async findById(id) {
    const [clients] = await db.query("SELECT * FROM clients WHERE id = ?", [id]);
    return clients[0];
  }

  // Find client by verification token
  async findByVerificationToken(token) {
    const [clients] = await db.query("SELECT * FROM clients WHERE verification_token = ?", [token]);
    return clients[0];
  }

  // Create a new client
  async create({ username, email, password, company_id }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const [result] = await db.query(
      `INSERT INTO clients (
        username, email, password_hash, company_id, 
        verification_token, status, enabled, failed_attempts
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        email,
        passwordHash,
        company_id,
        verificationToken,
        "inactive",
        0,
        0,
      ]
    );
    return { id: result.insertId, email, verificationToken };
  }

  // Update client details
  async update(id, { username, email, company_id }) {
    await db.query(
      `UPDATE clients 
       SET username = ?, email = ?, company_id = ? 
       WHERE id = ?`,
      [username, email, company_id, id]
    );
    return this.findById(id);
  }

  // Soft delete client
  async softDelete(id) {
    await db.query("UPDATE clients SET status = 'inactive' WHERE id = ?", [id]);
  }

  // Enable/disable client
  async setEnabled(id, enabled) {
    await db.query("UPDATE clients SET enabled = ? WHERE id = ?", [enabled, id]);
  }

  // Update password
  async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      `UPDATE clients 
       SET password_hash = ?, enabled = TRUE, status = 'active' 
       WHERE id = ?`,
      [hashedPassword, id]
    );
  }

  // Verify email
  async verifyEmail(clientId) {
    await db.query(
      `UPDATE clients 
       SET verified_at = NOW(), verification_token = NULL 
       WHERE id = ?`,
      [clientId]
    );
  }

  // Update failed attempts
  async incrementFailedAttempts(id) {
    await db.query(
      `UPDATE clients 
       SET failed_attempts = failed_attempts + 1 
       WHERE id = ?`,
      [id]
    );
  }

  // Reset failed attempts
  async resetFailedAttempts(id) {
    await db.query("UPDATE clients SET failed_attempts = 0 WHERE id = ?", [id]);
  }

  // Update last login
  async updateLastLogin(id) {
    await db.query(
      `UPDATE clients 
       SET last_login = NOW() 
       WHERE id = ?`,
      [id]
    );
  }

  // Validate company exists
  async validateCompany(company_id) {
    const [companies] = await db.query("SELECT id FROM companies WHERE id = ?", [company_id]);
    return companies[0];
  }
}

module.exports = new ClientModel();