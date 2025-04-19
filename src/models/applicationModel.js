// src/models/applicationModel.js
const db = require("../config/db");

const applicationModel = {
  async create({ clientId, title, description }) {
    const [result] = await db.query(
      "INSERT INTO applications (client_id, title, description) VALUES (?, ?, ?)",
      [clientId, title, description]
    );
    const applicationId = result.insertId;

    // Log the creation action
    // await db.query(
    //   "INSERT INTO application_audit_log (application_id, action, performed_by, new_data) VALUES (?, 'create', ?, ?)",
    //   [applicationId, clientId, JSON.stringify({ title, description, status: 'pending' })]
    // );

    return applicationId;
  },

  async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM applications WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async getAll() {
    const [rows] = await db.query(
      "SELECT id, client_id, title, description, status, reviewed_by, review_comments, created_at, updated_at, cancelled_at FROM applications"
    );
    return rows;
  },

  async getByClientId(clientId) {
    const [rows] = await db.query(
      "SELECT id, client_id, title, description, status, reviewed_by, review_comments, created_at, updated_at, cancelled_at FROM applications WHERE client_id = ?",
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
};

module.exports = applicationModel;