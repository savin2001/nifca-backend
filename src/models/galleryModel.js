// src/models/galleryModel.js
const db = require("../config/db");

const galleryModel = {
  async create({ media_type, url, caption, created_by }) {
    const [result] = await db.query(
      "INSERT INTO gallery (media_type, url, caption, created_by) VALUES (?, ?, ?, ?)",
      [media_type, url, caption, created_by]
    );
    return { id: result.insertId, media_type, url, caption, created_by };
  },

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM gallery WHERE id = ?", [id]);
    return rows[0];
  },

  async findAll() {
    const [rows] = await db.query("SELECT * FROM gallery");
    return rows;
  },

  async update(id, { media_type, url, caption }) {
    await db.query(
      "UPDATE gallery SET media_type = ?, url = ?, caption = ?, updated_at = NOW() WHERE id = ?",
      [media_type, url, caption, id]
    );
    return { id, media_type, url, caption };
  },

  async delete(id) {
    await db.query("DELETE FROM gallery WHERE id = ?", [id]);
  },
};

module.exports = galleryModel;