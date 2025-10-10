// src/models/contentModel.js
const db = require("../config/db");

const contentModel = {
  // News
  async createNews({ title, content, created_by, picture }) {
    const [result] = await db.query(
      "INSERT INTO news (title, content, created_by, picture) VALUES (?, ?, ?, ?)",
      [title, content, created_by, picture]
    );
    return result.insertId;
  },

  async getAllNewsPaginated({ limit, offset }) {
    const [[{ total }]] = await db.query("SELECT COUNT(*) as total FROM news");
    const [rows] = await db.query("SELECT id, title, content, picture, created_at FROM news ORDER BY created_at DESC LIMIT ? OFFSET ?", [limit, offset]);
    return { total, rows };
  },

  async getNewsById(id) {
    const [rows] = await db.query("SELECT id, title, content, picture, created_at FROM news WHERE id = ?", [id]);
    return rows[0];
  },

  async updateNews(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);

    if (fields.length === 0) {
      return this.getNewsById(id);
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');

    const query = `UPDATE news SET ${setClause}, updated_at = NOW() WHERE id = ?`;
    const queryParams = [...values, id];

    await db.query(query, queryParams);
    return await this.getNewsById(id);
  },

  async deleteNews(id) {
    await db.query("DELETE FROM news WHERE id = ?", [id]);
  },

  // Press Releases
  async createPressRelease({ title, content, created_by }) {
    const [result] = await db.query(
      "INSERT INTO press_releases (title, content, created_by) VALUES (?, ?, ?)",
      [title, content, created_by]
    );
    return result.insertId;
  },

  async getAllPressReleasesPaginated({ limit, offset }) {
    const [[{ total }]] = await db.query("SELECT COUNT(*) as total FROM press_releases");
    const [rows] = await db.query("SELECT id, title, content, created_at FROM press_releases ORDER BY created_at DESC LIMIT ? OFFSET ?", [limit, offset]);
    return { total, rows };
  },

  async getPressReleaseById(id) {
    const [rows] = await db.query("SELECT * FROM press_releases WHERE id = ?", [id]);
    return rows[0];
  },

  async updatePressRelease(id, { title, content }) {
    await db.query(
      "UPDATE press_releases SET title = ?, content = ?, updated_at = NOW() WHERE id = ?",
      [title, content, id]
    );
    return await this.getPressReleaseById(id);
  },

  async deletePressRelease(id) {
    await db.query("DELETE FROM press_releases WHERE id = ?", [id]);
  },

  // Events
  async createEvent({ title, description, event_date, location, created_by }) {
    const [result] = await db.query(
      "INSERT INTO events (title, description, event_date, location, created_by) VALUES (?, ?, ?, ?, ?)",
      [title, description, event_date, location, created_by]
    );
    return result.insertId;
  },

  async getAllEvents() {
    const [rows] = await db.query("SELECT * FROM events");
    return rows;
  },

  async getEventById(id) {
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
    return rows[0];
  },

  async updateEvent(id, { title, description, event_date, location }) {
    await db.query(
      "UPDATE events SET title = ?, description = ?, event_date = ?, location = ?, updated_at = NOW() WHERE id = ?",
      [title, description, event_date, location, id]
    );
    return await this.getEventById(id);
  },

  async deleteEvent(id) {
    await db.query("DELETE FROM events WHERE id = ?", [id]);
  },

  // Gallery Media
  async createGalleryMedia({ type, url, caption, created_by }) {
    const [result] = await db.query(
      "INSERT INTO gallery_media (type, url, caption, created_by) VALUES (?, ?, ?, ?)",
      [type, url, caption, created_by]
    );
    return result.insertId;
  },

  async getAllGalleryMedia() {
    const [rows] = await db.query("SELECT * FROM gallery_media");
    return rows;
  },

  async getGalleryMediaById(id) {
    const [rows] = await db.query("SELECT * FROM gallery_media WHERE id = ?", [id]);
    return rows[0];
  },

  async updateGalleryMedia(id, { type, url, caption }) {
    await db.query(
      "UPDATE gallery_media SET type = ?, url = ?, caption = ?, updated_at = NOW() WHERE id = ?",
      [type, url, caption, id]
    );
    return await this.getGalleryMediaById(id);
  },

  async deleteGalleryMedia(id) {
    await db.query("DELETE FROM gallery_media WHERE id = ?", [id]);
  },
};

module.exports = contentModel;