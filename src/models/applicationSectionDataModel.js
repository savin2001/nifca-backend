// src/models/applicationSectionDataModel.js
const db = require("../config/db");

// Helper function to safely parse JSON field_data
// MySQL2 may auto-parse JSON columns, so we need to handle both string and object
const parseFieldData = (fieldData) => {
  if (!fieldData) return {};
  if (typeof fieldData === 'object') return fieldData;
  try {
    return JSON.parse(fieldData);
  } catch (e) {
    console.warn('Failed to parse field_data:', e.message);
    return {};
  }
};

const applicationSectionDataModel = {
  /**
   * Get section data for a specific application and section
   */
  async getSectionData(applicationId, sectionId) {
    const [rows] = await db.query(
      `SELECT id, application_id, section_id, field_data, is_complete, validated_at, created_at, updated_at
       FROM application_section_data
       WHERE application_id = ? AND section_id = ?`,
      [applicationId, sectionId]
    );
    if (!rows[0]) return null;
    return {
      ...rows[0],
      field_data: parseFieldData(rows[0].field_data)
    };
  },

  /**
   * Get all section data for an application
   */
  async getAllSectionData(applicationId) {
    const [rows] = await db.query(
      `SELECT asd.id, asd.application_id, asd.section_id, asd.field_data, asd.is_complete,
              asd.validated_at, asd.created_at, asd.updated_at,
              s.name as section_name, s.display_order
       FROM application_section_data asd
       JOIN application_sections s ON asd.section_id = s.id
       WHERE asd.application_id = ?
       ORDER BY s.display_order`,
      [applicationId]
    );
    return rows.map(row => ({
      ...row,
      field_data: parseFieldData(row.field_data)
    }));
  },

  /**
   * Save section data (insert or update)
   * Returns the section data ID
   */
  async saveSectionData(applicationId, sectionId, fieldData, isComplete = false) {
    const existingData = await this.getSectionData(applicationId, sectionId);
    const fieldDataJson = JSON.stringify(fieldData);

    if (existingData) {
      // Update existing
      await db.query(
        `UPDATE application_section_data
         SET field_data = ?, is_complete = ?, validated_at = ?
         WHERE application_id = ? AND section_id = ?`,
        [fieldDataJson, isComplete ? 1 : 0, isComplete ? new Date() : null, applicationId, sectionId]
      );
      return existingData.id;
    } else {
      // Insert new
      const [result] = await db.query(
        `INSERT INTO application_section_data (application_id, section_id, field_data, is_complete, validated_at)
         VALUES (?, ?, ?, ?, ?)`,
        [applicationId, sectionId, fieldDataJson, isComplete ? 1 : 0, isComplete ? new Date() : null]
      );
      return result.insertId;
    }
  },

  /**
   * Mark a section as complete
   */
  async markSectionComplete(applicationId, sectionId) {
    await db.query(
      `UPDATE application_section_data
       SET is_complete = 1, validated_at = NOW()
       WHERE application_id = ? AND section_id = ?`,
      [applicationId, sectionId]
    );
  },

  /**
   * Mark a section as incomplete
   */
  async markSectionIncomplete(applicationId, sectionId) {
    await db.query(
      `UPDATE application_section_data
       SET is_complete = 0, validated_at = NULL
       WHERE application_id = ? AND section_id = ?`,
      [applicationId, sectionId]
    );
  },

  /**
   * Delete section data
   */
  async deleteSectionData(applicationId, sectionId) {
    await db.query(
      "DELETE FROM application_section_data WHERE application_id = ? AND section_id = ?",
      [applicationId, sectionId]
    );
  },

  /**
   * Delete all section data for an application
   */
  async deleteAllSectionData(applicationId) {
    await db.query(
      "DELETE FROM application_section_data WHERE application_id = ?",
      [applicationId]
    );
  },

  /**
   * Get completion status for all sections of an application
   */
  async getCompletionStatus(applicationId, applicationTypeId) {
    const [rows] = await db.query(
      `SELECT s.id as section_id, s.name, s.display_order, s.is_required,
              COALESCE(asd.is_complete, 0) as is_complete,
              CASE WHEN asd.id IS NOT NULL THEN 1 ELSE 0 END as has_data
       FROM application_sections s
       LEFT JOIN application_section_data asd ON s.id = asd.section_id AND asd.application_id = ?
       WHERE s.application_type_id = ?
       ORDER BY s.display_order`,
      [applicationId, applicationTypeId]
    );
    return rows;
  },

  /**
   * Calculate completion percentage for an application
   */
  async calculateCompletionPercentage(applicationId, applicationTypeId) {
    const status = await this.getCompletionStatus(applicationId, applicationTypeId);
    if (status.length === 0) return 0;

    const requiredSections = status.filter(s => s.is_required);
    if (requiredSections.length === 0) return 100;

    const completedRequired = requiredSections.filter(s => s.is_complete).length;
    return Math.round((completedRequired / requiredSections.length) * 100);
  },

  /**
   * Check if all required sections are complete
   */
  async areAllRequiredSectionsComplete(applicationId, applicationTypeId) {
    const [rows] = await db.query(
      `SELECT COUNT(*) as incomplete_count
       FROM application_sections s
       LEFT JOIN application_section_data asd ON s.id = asd.section_id AND asd.application_id = ?
       WHERE s.application_type_id = ? AND s.is_required = 1 AND (asd.is_complete IS NULL OR asd.is_complete = 0)`,
      [applicationId, applicationTypeId]
    );
    return rows[0].incomplete_count === 0;
  },

  /**
   * Get incomplete required sections
   */
  async getIncompleteRequiredSections(applicationId, applicationTypeId) {
    const [rows] = await db.query(
      `SELECT s.id, s.name, s.display_order
       FROM application_sections s
       LEFT JOIN application_section_data asd ON s.id = asd.section_id AND asd.application_id = ?
       WHERE s.application_type_id = ? AND s.is_required = 1 AND (asd.is_complete IS NULL OR asd.is_complete = 0)
       ORDER BY s.display_order`,
      [applicationId, applicationTypeId]
    );
    return rows;
  }
};

module.exports = applicationSectionDataModel;
