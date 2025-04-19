// src/models/userModel.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userModel = {
  async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ? AND deleted_at IS NULL", [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ? AND deleted_at IS NULL", [id]);
    return rows[0];
  },
  async isTokenValid(userId, token) {
    const [rows] = await db.query(
      "SELECT * FROM user_tokens WHERE user_id = ? AND token = ? AND expires_at > NOW()",
      [userId, token]
    );
    return rows.length > 0;
  },
  async findByVerificationToken(token) {
    const [rows] = await db.query("SELECT * FROM users WHERE verification_token = ? AND deleted_at IS NULL", [token]);
    return rows[0];
  },

  

  async create({ username, email, password, role_id, company_id, created_by }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const [result] = await db.query(
      "INSERT INTO users (username, email, password_hash, role_id, company_id, created_by, verification_token, status, enabled) VALUES (?, ?, ?, ?, ?, ?, ?, 'inactive', 0)",
      [username, email, hashedPassword, role_id, company_id, created_by, verificationToken]
    );
    const userId = result.insertId;

    // Log the creation action
    await db.query(
      "INSERT INTO user_audit_log (user_id, action, performed_by, new_data) VALUES (?, 'create', ?, ?)",
      [userId, created_by, JSON.stringify({ username, email, role_id, company_id })]
    );

    return { id: userId, verificationToken };
  },

  async validateRole(role_id) {
    const [rows] = await db.query("SELECT * FROM roles WHERE id = ?", [role_id]);
    return rows[0];
  },

  async validateCompany(company_id) {
    const [rows] = await db.query("SELECT * FROM companies WHERE id = ?", [company_id]);
    return rows[0];
  },

  async verifyEmail(userId) {
    const user = await this.findById(userId);
    if (!user) throw new Error("User not found");

    await db.query(
      "UPDATE users SET verified_at = NOW(), verification_token = NULL, status = 'active' WHERE id = ?",
      [userId]
    );

    // Log the verification action
    await db.query(
      "INSERT INTO user_audit_log (user_id, action, performed_by, old_data, new_data) VALUES (?, 'verify_email', ?, ?, ?)",
      [userId, userId, JSON.stringify({ status: user.status }), JSON.stringify({ status: 'active' })]
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

  async updatePassword(userId, newPassword, performedBy) {
    const user = await this.findById(userId);
    if (!user) throw new Error("User not found");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password_hash = ?, enabled = 1 WHERE id = ?", [
      hashedPassword,
      userId,
    ]);

    // Log the password reset action
    await db.query(
      "INSERT INTO user_audit_log (user_id, action, performed_by) VALUES (?, 'reset_password', ?)",
      [userId, performedBy || userId]
    );
  },

  async removeToken(userId, token) {
    await db.query("DELETE FROM user_tokens WHERE user_id = ? AND token = ?", [userId, token]);
  },

  async removeAllTokens(userId) {
    await db.query("DELETE FROM user_tokens WHERE user_id = ?", [userId]);
  },

  // Updated methods for user management
  async getAllUsers() {
    const [rows] = await db.query(
      "SELECT id, username, email, role_id, company_id, status, enabled, created_at, updated_at FROM users WHERE deleted_at IS NULL"
    );
    return rows;
  },

  async updateUser(userId, updates, performedBy) {
    const { username, email, role_id, company_id, status, enabled } = updates;
    const user = await this.findById(userId);
    if (!user) throw new Error("User not found");

    // Validate role_id and company_id if provided
    if (role_id) {
      const role = await this.validateRole(role_id);
      if (!role) throw new Error("Invalid role ID");
    }
    if (company_id) {
      const company = await this.validateCompany(company_id);
      if (!company) throw new Error("Invalid company ID");
    }

    const oldData = {
      username: user.username,
      email: user.email,
      role_id: user.role_id,
      company_id: user.company_id,
      status: user.status,
      enabled: user.enabled,
    };

    await db.query(
      "UPDATE users SET username = ?, email = ?, role_id = ?, company_id = ?, status = ?, enabled = ?, updated_at = NOW() WHERE id = ?",
      [username || user.username, email || user.email, role_id || user.role_id, company_id || user.company_id, status || user.status, enabled !== undefined ? enabled : user.enabled, userId]
    );

    const updatedUser = await this.findById(userId);

    // Log the update action
    await db.query(
      "INSERT INTO user_audit_log (user_id, action, performed_by, old_data, new_data) VALUES (?, 'update', ?, ?, ?)",
      [userId, performedBy, JSON.stringify(oldData), JSON.stringify(updates)]
    );

    return updatedUser;
  },

  async setEnabled(userId, enabled, performedBy) {
    const user = await this.findById(userId);
    if (!user) throw new Error("User not found");

    await db.query("UPDATE users SET enabled = ?, updated_at = NOW() WHERE id = ?", [enabled ? 1 : 0, userId]);

    // Log the enable/disable action
    await db.query(
      "INSERT INTO user_audit_log (user_id, action, performed_by, old_data, new_data) VALUES (?, ?, ?, ?, ?)",
      [userId, enabled ? 'enable' : 'disable', performedBy, JSON.stringify({ enabled: user.enabled }), JSON.stringify({ enabled })]
    );
  },

  async softDelete(userId, performedBy) {
    const user = await this.findById(userId);
    if (!user) throw new Error("User not found");

    await db.query("UPDATE users SET deleted_at = NOW() WHERE id = ?", [userId]);
    await this.removeAllTokens(userId);

    // Log the deletion action
    await db.query(
      "INSERT INTO user_audit_log (user_id, action, performed_by, old_data) VALUES (?, 'delete', ?, ?)",
      [userId, performedBy, JSON.stringify(user)]
    );
  },

  async destroyClientSession(userId) {
    try {
      // Find the session for the user in the sessions table
      const [sessions] = await db.query(
        "SELECT sid FROM sessions WHERE JSON_EXTRACT(data, '$.user.userId') = ?",
        [userId]
      );

      // Destroy each session
      for (const session of sessions) {
        await new Promise((resolve, reject) => {
          sessionStore.destroy(session.sid, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    } catch (error) {
      console.error("Error destroying client session:", error);
      throw error;
    }
  },

  async hasDependencies(userId) {
    // Check for content created by the user
    const [content] = await db.query(
      "SELECT COUNT(*) as count FROM news WHERE created_by = ? UNION ALL " +
      "SELECT COUNT(*) as count FROM press_releases WHERE created_by = ? UNION ALL " +
      "SELECT COUNT(*) as count FROM events WHERE created_by = ? UNION ALL " +
      "SELECT COUNT(*) as count FROM gallery_media WHERE created_by = ?",
      [userId, userId, userId, userId]
    );
    const contentCount = content.reduce((sum, row) => sum + row.count, 0);

    // Check for applications reviewed by the user
    const [applications] = await db.query(
      "SELECT COUNT(*) as count FROM applications WHERE reviewed_by = ?",
      [userId]
    );

    return contentCount > 0 || applications[0].count > 0;
  },
};

module.exports = userModel;