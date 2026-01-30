// src/models/applicationTypeModel.js
const db = require("../config/db");

const applicationTypeModel = {
  // =====================================================
  // Application Types
  // =====================================================

  async getAllTypes(activeOnly = true) {
    const query = activeOnly
      ? "SELECT id, name, code, description, is_active, created_at, updated_at FROM application_types WHERE is_active = 1 ORDER BY name"
      : "SELECT id, name, code, description, is_active, created_at, updated_at FROM application_types ORDER BY name";
    const [rows] = await db.query(query);
    return rows;
  },

  async getTypeById(id) {
    const [rows] = await db.query(
      "SELECT id, name, code, description, is_active, created_at, updated_at FROM application_types WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async getTypeByCode(code) {
    const [rows] = await db.query(
      "SELECT id, name, code, description, is_active, created_at, updated_at FROM application_types WHERE code = ?",
      [code]
    );
    return rows[0];
  },

  async createType({ name, code, description }) {
    const [result] = await db.query(
      "INSERT INTO application_types (name, code, description) VALUES (?, ?, ?)",
      [name, code, description]
    );
    return result.insertId;
  },

  async updateType(id, { name, code, description, is_active }) {
    const updates = [];
    const values = [];

    if (name !== undefined) { updates.push("name = ?"); values.push(name); }
    if (code !== undefined) { updates.push("code = ?"); values.push(code); }
    if (description !== undefined) { updates.push("description = ?"); values.push(description); }
    if (is_active !== undefined) { updates.push("is_active = ?"); values.push(is_active); }

    if (updates.length === 0) return false;

    values.push(id);
    await db.query(
      `UPDATE application_types SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    return true;
  },

  async deleteType(id) {
    await db.query("DELETE FROM application_types WHERE id = ?", [id]);
    return true;
  },

  // =====================================================
  // Application Sections
  // =====================================================

  async getSectionsByTypeId(typeId) {
    const [rows] = await db.query(
      `SELECT id, application_type_id, name, description, display_order, is_required, created_at, updated_at
       FROM application_sections
       WHERE application_type_id = ?
       ORDER BY display_order`,
      [typeId]
    );
    return rows;
  },

  async getSectionById(id) {
    const [rows] = await db.query(
      "SELECT id, application_type_id, name, description, display_order, is_required, created_at, updated_at FROM application_sections WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async createSection({ application_type_id, name, description, display_order, is_required = 1 }) {
    const [result] = await db.query(
      "INSERT INTO application_sections (application_type_id, name, description, display_order, is_required) VALUES (?, ?, ?, ?, ?)",
      [application_type_id, name, description, display_order, is_required]
    );
    return result.insertId;
  },

  async updateSection(id, { name, description, display_order, is_required }) {
    const updates = [];
    const values = [];

    if (name !== undefined) { updates.push("name = ?"); values.push(name); }
    if (description !== undefined) { updates.push("description = ?"); values.push(description); }
    if (display_order !== undefined) { updates.push("display_order = ?"); values.push(display_order); }
    if (is_required !== undefined) { updates.push("is_required = ?"); values.push(is_required); }

    if (updates.length === 0) return false;

    values.push(id);
    await db.query(
      `UPDATE application_sections SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    return true;
  },

  async deleteSection(id) {
    await db.query("DELETE FROM application_sections WHERE id = ?", [id]);
    return true;
  },

  // =====================================================
  // Section Fields
  // =====================================================

  async getFieldsBySectionId(sectionId) {
    const [rows] = await db.query(
      `SELECT id, section_id, field_name, field_label, field_type, field_options,
              validation_rules, is_required, display_order, placeholder, help_text,
              created_at, updated_at
       FROM section_fields
       WHERE section_id = ?
       ORDER BY display_order`,
      [sectionId]
    );
    // Parse JSON fields (handle both string and already-parsed object)
    return rows.map(row => ({
      ...row,
      field_options: row.field_options
        ? (typeof row.field_options === 'string' ? JSON.parse(row.field_options) : row.field_options)
        : null,
      validation_rules: row.validation_rules
        ? (typeof row.validation_rules === 'string' ? JSON.parse(row.validation_rules) : row.validation_rules)
        : null
    }));
  },

  async getFieldById(id) {
    const [rows] = await db.query(
      "SELECT * FROM section_fields WHERE id = ?",
      [id]
    );
    if (!rows[0]) return null;
    return {
      ...rows[0],
      field_options: rows[0].field_options
        ? (typeof rows[0].field_options === 'string' ? JSON.parse(rows[0].field_options) : rows[0].field_options)
        : null,
      validation_rules: rows[0].validation_rules
        ? (typeof rows[0].validation_rules === 'string' ? JSON.parse(rows[0].validation_rules) : rows[0].validation_rules)
        : null
    };
  },

  async createField({ section_id, field_name, field_label, field_type, field_options, validation_rules, is_required, display_order, placeholder, help_text }) {
    const [result] = await db.query(
      `INSERT INTO section_fields (section_id, field_name, field_label, field_type, field_options,
                                   validation_rules, is_required, display_order, placeholder, help_text)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        section_id,
        field_name,
        field_label,
        field_type,
        field_options ? JSON.stringify(field_options) : null,
        validation_rules ? JSON.stringify(validation_rules) : null,
        is_required || 0,
        display_order,
        placeholder,
        help_text
      ]
    );
    return result.insertId;
  },

  async updateField(id, updates) {
    const allowedFields = ['field_name', 'field_label', 'field_type', 'field_options', 'validation_rules', 'is_required', 'display_order', 'placeholder', 'help_text'];
    const updateParts = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updateParts.push(`${key} = ?`);
        if (key === 'field_options' || key === 'validation_rules') {
          values.push(value ? JSON.stringify(value) : null);
        } else {
          values.push(value);
        }
      }
    }

    if (updateParts.length === 0) return false;

    values.push(id);
    await db.query(
      `UPDATE section_fields SET ${updateParts.join(", ")} WHERE id = ?`,
      values
    );
    return true;
  },

  async deleteField(id) {
    await db.query("DELETE FROM section_fields WHERE id = ?", [id]);
    return true;
  },

  // =====================================================
  // Full Structure Retrieval (for displaying forms)
  // =====================================================

  async getTypeWithStructure(typeId) {
    const type = await this.getTypeById(typeId);
    if (!type) return null;

    const sections = await this.getSectionsByTypeId(typeId);

    // Get fields for each section
    for (const section of sections) {
      section.fields = await this.getFieldsBySectionId(section.id);
    }

    return {
      ...type,
      sections
    };
  },

  async getTotalSectionsCount(typeId) {
    const [rows] = await db.query(
      "SELECT COUNT(*) as count FROM application_sections WHERE application_type_id = ?",
      [typeId]
    );
    return rows[0].count;
  },

  async getRequiredSectionsCount(typeId) {
    const [rows] = await db.query(
      "SELECT COUNT(*) as count FROM application_sections WHERE application_type_id = ? AND is_required = 1",
      [typeId]
    );
    return rows[0].count;
  }
};

module.exports = applicationTypeModel;
