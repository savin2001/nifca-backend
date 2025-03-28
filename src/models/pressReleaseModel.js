// src/models/pressReleaseModel.js
const db = require("../config/db");

const pressReleaseModel = {
  async create({ title, content, release_date, created_by }) {
    const [result] = await db.query(
      "INSERT INTO press_releases (title, content, release_date, created_by) VALUES (?, ?, ?, ?)",
      [title, content, release_date, created_by]
    );
    return { id: result.insertId, title, content, release_date, created_by };
  },

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM press_releases WHERE id = ?", [id]);
    return rows[0];
  },

  async findAll() {
    const [rows] = await db.query("SELECT * FROM press_releases");
    return rows;
  },

  async update(id, { title, content, release_date }) {
    await db.query(
      "UPDATE press_releases SET title = ?, content = ?, release_date = ?, updated_at = NOW() WHERE id = ?",
      [title, content, release_date, id]
    );
    return { id, title, content, release_date };
  },

  async delete(id) {
    await db.query("DELETE FROM press_releases WHERE id = ?", [id]);
  },
};

module.exports = pressReleaseModel;