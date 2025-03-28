// src/models/applicationModel.js
const db = require("../config/db");

const applicationModel = {
  async create({ client_id, title, description, created_by }) {
    const [result] = await db.query(
      "INSERT INTO applications (client_id, title, description, created_by) VALUES (?, ?, ?, ?)",
      [client_id, title, description, created_by]
    );
    return { id: result.insertId, client_id, title, description, created_by };
  },

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM applications WHERE id = ?", [id]);
    return rows[0];
  },

  async findAll() {
    const [rows] = await db.query("SELECT * FROM applications");
    return rows;
  },

  async findByClientId(client_id) {
    const [rows] = await db.query("SELECT * FROM applications WHERE client_id = ?", [client_id]);
    return rows;
  },

  async update(id, { title, description, status, reviewed_by }) {
    await db.query(
      "UPDATE applications SET title = ?, description = ?, status = ?, reviewed_by = ?, updated_at = NOW() WHERE id = ?",
      [title, description, status, reviewed_by, id]
    );
    return { id, title, description, status, reviewed_by };
  },

  async updateStatus(id, status, reviewed_by) {
    await db.query(
      "UPDATE applications SET status = ?, reviewed_by = ?, updated_at = NOW() WHERE id = ?",
      [status, reviewed_by, id]
    );
    return { id, status, reviewed_by };
  },

  async delete(id) {
    await db.query("DELETE FROM applications WHERE id = ?", [id]);
  },
};

module.exports = applicationModel;