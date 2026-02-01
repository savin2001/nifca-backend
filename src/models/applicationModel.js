// src/models/applicationModel.js
const db = require("../config/db");

const applicationModel = {
  async create({ clientId, title, description }) {
    // Generate reference number: APP-YYYY-XXXXX
    const year = new Date().getFullYear();

    const [result] = await db.query(
      "INSERT INTO applications (client_id, title, description) VALUES (?, ?, ?)",
      [clientId, title, description]
    );
    const applicationId = result.insertId;

    // Update with reference number after getting ID
    const referenceNumber = `APP-${year}-${String(applicationId).padStart(5, '0')}`;
    await db.query(
      "UPDATE applications SET reference_number = ? WHERE id = ?",
      [referenceNumber, applicationId]
    );

    // Log the creation action
    await db.query(
      "INSERT INTO application_audit_log (application_id, action, performed_by, new_data) VALUES (?, 'create', ?, ?)",
      [applicationId, clientId, JSON.stringify({ title, description, status: 'pending', reference_number: referenceNumber })]
    );

    return applicationId;
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT id, client_id, application_type_id, reference_number, title, description, status,
              reviewed_by, review_comments, submitted_at, pdf_path, pdf_generated_at,
              current_section, completion_percentage, created_at, updated_at, cancelled_at
       FROM applications WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async getAll() {
    const [rows] = await db.query(
      `SELECT id, client_id, application_type_id, reference_number, title, description, status,
              reviewed_by, review_comments, submitted_at, pdf_path, pdf_generated_at,
              current_section, completion_percentage, created_at, updated_at, cancelled_at
       FROM applications`
    );
    return rows;
  },

  async getByClientId(clientId) {
    const [rows] = await db.query(
      `SELECT id, client_id, application_type_id, reference_number, title, description, status,
              reviewed_by, review_comments, submitted_at, pdf_path, pdf_generated_at,
              current_section, completion_percentage, created_at, updated_at, cancelled_at
       FROM applications WHERE client_id = ? ORDER BY created_at DESC`,
      [clientId]
    );
    return rows;
  },

  async reviewApplication(applicationId, { status, reviewComments }, reviewedBy) {
    const application = await this.findById(applicationId);
    if (!application) throw new Error("Application not found");

    const oldData = {
      status: application.status,
      review_comments: application.review_comments,
      reviewed_by: application.reviewed_by,
    };

    await db.query(
      "UPDATE applications SET status = ?, review_comments = ?, reviewed_by = ?, updated_at = NOW() WHERE id = ?",
      [status, reviewComments, reviewedBy, applicationId]
    );

    const newData = { status, review_comments: reviewComments, reviewed_by: reviewedBy };
    await db.query(
      "INSERT INTO application_audit_log (application_id, action, performed_by, old_data, new_data) VALUES (?, 'review', ?, ?, ?)",
      [applicationId, reviewedBy, JSON.stringify(oldData), JSON.stringify(newData)]
    );

    return await this.findById(applicationId);
  },

  async cancelApplication(applicationId, clientId) {
    const application = await this.findById(applicationId);
    if (!application) throw new Error("Application not found");
    if (application.client_id !== clientId) throw new Error("Unauthorized: You can only cancel your own applications");
    if (application.status !== 'pending') throw new Error("Only pending applications can be cancelled");

    const oldData = { status: application.status, cancelled_at: application.cancelled_at };
    await db.query(
      "UPDATE applications SET status = 'cancelled', cancelled_at = NOW(), updated_at = NOW() WHERE id = ?",
      [applicationId]
    );

    const newData = { status: 'cancelled', cancelled_at: new Date() };
    await db.query(
      "INSERT INTO application_audit_log (application_id, action, performed_by, old_data, new_data) VALUES (?, 'cancel', ?, ?, ?)",
      [applicationId, clientId, JSON.stringify(oldData), JSON.stringify(newData)]
    );

    return await this.findById(applicationId);
  },

  // =====================================================
  // Multi-Section Application Support Methods
  // =====================================================

  /**
   * Get application with type information
   */
  async findByIdWithType(id) {
    const [rows] = await db.query(
      `SELECT a.*, at.name as application_type_name, at.code as application_type_code
       FROM applications a
       LEFT JOIN application_types at ON a.application_type_id = at.id
       WHERE a.id = ?`,
      [id]
    );
    return rows[0];
  },

  /**
   * Get all applications with filtering and pagination (for admin)
   */
  async getAllWithFilters({ status, applicationTypeId, clientId, dateFrom, dateTo, page = 1, limit = 20 }) {
    let query = `
      SELECT a.*, at.name as application_type_name, at.code as application_type_code,
             c.username as client_username, c.email as client_email
      FROM applications a
      LEFT JOIN application_types at ON a.application_type_id = at.id
      LEFT JOIN clients c ON a.client_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += " AND a.status = ?";
      params.push(status);
    }
    if (applicationTypeId) {
      query += " AND a.application_type_id = ?";
      params.push(applicationTypeId);
    }
    if (clientId) {
      query += " AND a.client_id = ?";
      params.push(clientId);
    }
    if (dateFrom) {
      query += " AND a.created_at >= ?";
      params.push(dateFrom);
    }
    if (dateTo) {
      query += " AND a.created_at <= ?";
      params.push(dateTo);
    }

    // Get count - use [\s\S]*? to match across newlines
    const countQuery = query.replace(
      /SELECT a\.\*, at\.name as application_type_name[\s\S]*?FROM/,
      "SELECT COUNT(*) as count FROM"
    );
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0]?.count || 0;

    // Add ordering and pagination
    query += " ORDER BY a.updated_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const [rows] = await db.query(query, params);

    return {
      applications: rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  },

  /**
   * Update application status (for admin workflow)
   */
  async updateStatus(applicationId, status, performedBy) {
    const application = await this.findById(applicationId);
    if (!application) throw new Error("Application not found");

    const oldStatus = application.status;

    await db.query(
      "UPDATE applications SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, applicationId]
    );

    await db.query(
      "INSERT INTO application_audit_log (application_id, action, performed_by, old_data, new_data) VALUES (?, 'status_change', ?, ?, ?)",
      [applicationId, performedBy, JSON.stringify({ status: oldStatus }), JSON.stringify({ status })]
    );

    return await this.findById(applicationId);
  },

  /**
   * Get application statistics (for admin dashboard)
   */
  async getStatistics() {
    const [statusCounts] = await db.query(`
      SELECT status, COUNT(*) as count
      FROM applications
      GROUP BY status
    `);

    const [typeCounts] = await db.query(`
      SELECT at.name as type_name, COUNT(a.id) as count
      FROM application_types at
      LEFT JOIN applications a ON at.id = a.application_type_id
      WHERE at.is_active = 1
      GROUP BY at.id, at.name
    `);

    const [recentActivity] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM applications
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    return {
      byStatus: statusCounts,
      byType: typeCounts,
      recentActivity,
    };
  },

  /**
   * Get applications pending review
   */
  async getPendingReview(limit = 10) {
    const [rows] = await db.query(
      `SELECT a.*, at.name as application_type_name, c.username as client_username
       FROM applications a
       LEFT JOIN application_types at ON a.application_type_id = at.id
       LEFT JOIN clients c ON a.client_id = c.id
       WHERE a.status IN ('submitted', 'under_review')
       ORDER BY a.submitted_at ASC
       LIMIT ?`,
      [limit]
    );
    return rows;
  },
};

module.exports = applicationModel;