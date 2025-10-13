// src/models/clientModel.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

class ClientModel {
  async findByEmail(email) {
    const [clients] = await db.query("SELECT * FROM clients WHERE email = ?", [email]);
    return clients[0];
  }

  async findById(id) {
    const [clients] = await db.query("SELECT * FROM clients WHERE id = ?", [id]);
    return clients[0];
  }

  async findByVerificationToken(token) {
    const [clients] = await db.query("SELECT * FROM clients WHERE verification_token = ?", [token]);
    return clients[0];
  }

  async findByResetToken(token) {
    const [clients] = await db.query(
      "SELECT * FROM clients WHERE reset_token = ? AND reset_token_expires_at > NOW()",
      [token]
    );
    return clients[0];
  }

  async getAll() {
    const [clients] = await db.query(
      `SELECT id, username, email, company_id, status, enabled, 
              failed_attempts, last_login, verified_at 
       FROM clients`
    );
    return clients;
  }

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

  async update(id, { username, email, company_id }) {
    await db.query(
      `UPDATE clients 
       SET username = ?, email = ?, company_id = ? 
       WHERE id = ?`,
      [username, email, company_id, id]
    );
    return this.findById(id);
  }

  async softDelete(id) {
    await db.query("UPDATE clients SET status = 'inactive' WHERE id = ?", [id]);
  }

  async setEnabled(id, enabled) {
    await db.query("UPDATE clients SET enabled = ? WHERE id = ?", [enabled, id]);
  }

  async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      `UPDATE clients 
       SET password_hash = ?, enabled = TRUE, status = 'active', reset_token = NULL, reset_token_expires_at = NULL 
       WHERE id = ?`,
      [hashedPassword, id]
    );
  }

  async verifyEmail(clientId) {
    await db.query(
      `UPDATE clients 
       SET verified_at = NOW(), verification_token = NULL 
       WHERE id = ?`,
      [clientId]
    );
  }

  async activateAccount(clientId) {
    await db.query(
      `UPDATE clients 
       SET enabled = TRUE, status = 'active' 
       WHERE id = ?`,
      [clientId]
    );
  }

  async incrementFailedAttempts(id) {
    await db.query(
      `UPDATE clients 
       SET failed_attempts = failed_attempts + 1 
       WHERE id = ?`,
      [id]
    );
  }

  async resetFailedAttempts(id) {
    await db.query("UPDATE clients SET failed_attempts = 0 WHERE id = ?", [id]);
  }

  async updateLastLogin(id) {
    await db.query(
      `UPDATE clients 
       SET last_login = NOW() 
       WHERE id = ?`,
      [id]
    );
  }

  async validateCompany(company_id) {
    const [companies] = await db.query("SELECT id FROM companies WHERE id = ?", [company_id]);
    return companies[0];
  }

  async generateResetToken(clientId) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600 * 1000); // Token expires in 1 hour
    await db.query(
      `UPDATE clients 
       SET reset_token = ?, reset_token_expires_at = ? 
       WHERE id = ?`,
      [resetToken, expiresAt, clientId]
    );
    return resetToken;
  }
}

module.exports = new ClientModel();