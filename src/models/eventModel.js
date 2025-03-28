// src/models/eventModel.js
const db = require("../config/db");

const eventModel = {
  async create({ title, description, event_date, location, created_by }) {
    const [result] = await db.query(
      "INSERT INTO events (title, description, event_date, location, created_by) VALUES (?, ?, ?, ?, ?)",
      [title, description, event_date, location, created_by]
    );
    return { id: result.insertId, title, description, event_date, location, created_by };
  },

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
    return rows[0];
  },

  async findAll() {
    const [rows] = await db.query("SELECT * FROM events");
    return rows;
  },

  async update(id, { title, description, event_date, location }) {
    await db.query(
      "UPDATE events SET title = ?, description = ?, event_date = ?, location = ?, updated_at = NOW() WHERE id = ?",
      [title, description, event_date, location, id]
    );
    return { id, title, description, event_date, location };
  },

  async delete(id) {
    await db.query("DELETE FROM events WHERE id = ?", [id]);
  },
};

module.exports = eventModel;