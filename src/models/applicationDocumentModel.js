// src/models/applicationDocumentModel.js
const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const applicationDocumentModel = {
  /**
   * Create a new document record
   */
  async create({ applicationId, sectionId, fieldId, documentType, originalFilename, storedFilename, filePath, mimeType, fileSize, uploadedBy }) {
    const [result] = await db.query(
      `INSERT INTO application_documents
       (application_id, section_id, field_id, document_type, original_filename, stored_filename, file_path, mime_type, file_size, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [applicationId, sectionId || null, fieldId || null, documentType || null, originalFilename, storedFilename, filePath, mimeType, fileSize, uploadedBy]
    );
    return result.insertId;
  },

  /**
   * Get document by ID
   */
  async findById(id) {
    const [rows] = await db.query(
      `SELECT d.*, u.username as uploaded_by_name
       FROM application_documents d
       LEFT JOIN users u ON d.uploaded_by = u.id
       WHERE d.id = ?`,
      [id]
    );
    return rows[0];
  },

  /**
   * Get all documents for an application
   */
  async getByApplicationId(applicationId) {
    const [rows] = await db.query(
      `SELECT d.*, s.name as section_name, f.field_label, u.username as uploaded_by_name
       FROM application_documents d
       LEFT JOIN application_sections s ON d.section_id = s.id
       LEFT JOIN section_fields f ON d.field_id = f.id
       LEFT JOIN users u ON d.uploaded_by = u.id
       WHERE d.application_id = ?
       ORDER BY d.created_at DESC`,
      [applicationId]
    );
    return rows;
  },

  /**
   * Get documents for a specific section
   */
  async getBySectionId(applicationId, sectionId) {
    const [rows] = await db.query(
      `SELECT d.*, f.field_label, u.username as uploaded_by_name
       FROM application_documents d
       LEFT JOIN section_fields f ON d.field_id = f.id
       LEFT JOIN users u ON d.uploaded_by = u.id
       WHERE d.application_id = ? AND d.section_id = ?
       ORDER BY d.created_at DESC`,
      [applicationId, sectionId]
    );
    return rows;
  },

  /**
   * Get documents for a specific field
   */
  async getByFieldId(applicationId, fieldId) {
    const [rows] = await db.query(
      `SELECT d.*, u.username as uploaded_by_name
       FROM application_documents d
       LEFT JOIN users u ON d.uploaded_by = u.id
       WHERE d.application_id = ? AND d.field_id = ?
       ORDER BY d.created_at DESC`,
      [applicationId, fieldId]
    );
    return rows;
  },

  /**
   * Delete a document record and optionally the file
   */
  async delete(id, deleteFile = true) {
    const document = await this.findById(id);
    if (!document) return false;

    if (deleteFile) {
      try {
        const fullPath = path.join(__dirname, "..", document.file_path);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    await db.query("DELETE FROM application_documents WHERE id = ?", [id]);
    return true;
  },

  /**
   * Delete all documents for an application
   */
  async deleteByApplicationId(applicationId, deleteFiles = true) {
    if (deleteFiles) {
      const documents = await this.getByApplicationId(applicationId);
      for (const doc of documents) {
        try {
          const fullPath = path.join(__dirname, "..", doc.file_path);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      }
    }

    await db.query("DELETE FROM application_documents WHERE application_id = ?", [applicationId]);
    return true;
  },

  /**
   * Get document count for an application
   */
  async getCountByApplicationId(applicationId) {
    const [rows] = await db.query(
      "SELECT COUNT(*) as count FROM application_documents WHERE application_id = ?",
      [applicationId]
    );
    return rows[0].count;
  },

  /**
   * Get total file size for an application
   */
  async getTotalFileSizeByApplicationId(applicationId) {
    const [rows] = await db.query(
      "SELECT COALESCE(SUM(file_size), 0) as total_size FROM application_documents WHERE application_id = ?",
      [applicationId]
    );
    return rows[0].total_size;
  },

  /**
   * Check if a document exists for a specific field
   */
  async existsForField(applicationId, fieldId) {
    const [rows] = await db.query(
      "SELECT COUNT(*) as count FROM application_documents WHERE application_id = ? AND field_id = ?",
      [applicationId, fieldId]
    );
    return rows[0].count > 0;
  },

  /**
   * Replace document for a field (delete old, add new)
   */
  async replaceForField(applicationId, fieldId, newDocumentData) {
    // Delete existing document for this field
    const existingDocs = await this.getByFieldId(applicationId, fieldId);
    for (const doc of existingDocs) {
      await this.delete(doc.id, true);
    }

    // Create new document
    return await this.create({
      applicationId,
      fieldId,
      ...newDocumentData
    });
  }
};

module.exports = applicationDocumentModel;
