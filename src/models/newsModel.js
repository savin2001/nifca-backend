// src/models/newsModel.js
const db = require("../config/db");

const newsModel = {
  async create({ title, content, created_by }) {
    const [result] = await db.query(
      "INSERT INTO news (title, content, created_by) VALUES (?, ?, ?)",
      [title, content, created_by]
    );
    return { id: result.insertId, title, content, created_by };
  },

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM news WHERE id = ?", [id]);
    return rows[0];
  },

  async findAll() {
    const [rows] = await db.query("SELECT * FROM news");
    return rows;
  },

  async update(id, { title, content }) {
    await db.query(
      "UPDATE news SET title = ?, content = ?, updated_at = NOW() WHERE id = ?",
      [title, content, id]
    );
    return { id, title, content };
  },

  async delete(id) {
    await db.query("DELETE FROM news WHERE id = ?", [id]);
  },
};

module.exports = newsModel;