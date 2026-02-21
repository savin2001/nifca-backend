// src/models/pipelineModel.js
const db = require("../config/db");

const pipelineModel = {
  /**
   * Get all pipeline stage definitions
   */
  async getStageDefinitions() {
    const [rows] = await db.query(
      "SELECT * FROM pipeline_stage_definitions ORDER BY stage_order ASC"
    );
    return rows;
  },

  /**
   * Initialize the pipeline for an application - creates 4 stages, activates the first
   */
  async initializePipeline(applicationId, performedBy) {
    await db.query("START TRANSACTION");
    try {
      // Verify application exists and is in a valid state
      const [apps] = await db.query("SELECT id, status FROM applications WHERE id = ?", [applicationId]);
      if (!apps[0]) throw new Error("Application not found");
      if (!["submitted", "under_review"].includes(apps[0].status)) {
        throw new Error("Application must be submitted or under review to start pipeline");
      }

      // Check if pipeline already exists
      const [existing] = await db.query(
        "SELECT id FROM pipeline_stages WHERE application_id = ?",
        [applicationId]
      );
      if (existing.length > 0) {
        throw new Error("Pipeline already initialized for this application");
      }

      // Get stage definitions
      const [definitions] = await db.query(
        "SELECT * FROM pipeline_stage_definitions ORDER BY stage_order ASC"
      );

      // Create pipeline stages
      let firstStageId = null;
      for (const def of definitions) {
        const isFirst = def.stage_order === 1;
        const [result] = await db.query(
          `INSERT INTO pipeline_stages (application_id, stage_definition_id, status, started_at)
           VALUES (?, ?, ?, ?)`,
          [applicationId, def.id, isFirst ? "active" : "pending", isFirst ? new Date() : null]
        );
        if (isFirst) firstStageId = result.insertId;
      }

      // Update application status
      await db.query(
        `UPDATE applications SET status = 'in_pipeline', pipeline_current_stage_id = ?,
         pipeline_started_at = NOW(), updated_at = NOW() WHERE id = ?`,
        [firstStageId, applicationId]
      );

      // Audit log
      await db.query(
        `INSERT INTO pipeline_audit_log (application_id, pipeline_stage_id, action, performed_by, new_data)
         VALUES (?, ?, 'pipeline_initialized', ?, ?)`,
        [applicationId, firstStageId, performedBy, JSON.stringify({ status: "in_pipeline" })]
      );

      await db.query("COMMIT");
      return { success: true, firstStageId };
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  },

  /**
   * Assign reviewers to a pipeline stage
   */
  async assignReviewers(pipelineStageId, reviewerUserIds, performedBy) {
    await db.query("START TRANSACTION");
    try {
      // Verify stage exists
      const [stages] = await db.query(
        `SELECT ps.*, psd.requires_unanimous, psd.min_reviewers
         FROM pipeline_stages ps
         JOIN pipeline_stage_definitions psd ON ps.stage_definition_id = psd.id
         WHERE ps.id = ?`,
        [pipelineStageId]
      );
      if (!stages[0]) throw new Error("Pipeline stage not found");

      const stage = stages[0];

      // Check minimum reviewers for unanimous stages
      if (stage.requires_unanimous && reviewerUserIds.length < stage.min_reviewers) {
        throw new Error(`This stage requires at least ${stage.min_reviewers} reviewers`);
      }

      // Remove existing reviewers if reassigning
      await db.query("DELETE FROM pipeline_stage_reviewers WHERE pipeline_stage_id = ?", [pipelineStageId]);

      // Insert reviewers with sequential order
      for (let i = 0; i < reviewerUserIds.length; i++) {
        const isFirst = i === 0 && stage.status === "active";
        await db.query(
          `INSERT INTO pipeline_stage_reviewers (pipeline_stage_id, user_id, review_order, status)
           VALUES (?, ?, ?, ?)`,
          [pipelineStageId, reviewerUserIds[i], i + 1, isFirst ? "active" : "pending"]
        );
      }

      // Audit log
      await db.query(
        `INSERT INTO pipeline_audit_log (application_id, pipeline_stage_id, action, performed_by, new_data)
         VALUES (?, ?, 'reviewers_assigned', ?, ?)`,
        [
          stage.application_id,
          pipelineStageId,
          performedBy,
          JSON.stringify({ reviewers: reviewerUserIds }),
        ]
      );

      await db.query("COMMIT");
      return { success: true };
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  },

  /**
   * Get full pipeline details for an application (admin view)
   */
  async getApplicationPipeline(applicationId) {
    const [stages] = await db.query(
      `SELECT ps.*, psd.name as stage_name, psd.stage_order, psd.description as stage_description,
              psd.requires_unanimous, psd.min_reviewers
       FROM pipeline_stages ps
       JOIN pipeline_stage_definitions psd ON ps.stage_definition_id = psd.id
       WHERE ps.application_id = ?
       ORDER BY psd.stage_order ASC`,
      [applicationId]
    );

    // Get reviewers for each stage
    for (const stage of stages) {
      const [reviewers] = await db.query(
        `SELECT psr.*, u.username as reviewer_name, u.email as reviewer_email
         FROM pipeline_stage_reviewers psr
         JOIN users u ON psr.user_id = u.id
         WHERE psr.pipeline_stage_id = ?
         ORDER BY psr.review_order ASC`,
        [stage.id]
      );
      stage.reviewers = reviewers;
    }

    return stages;
  },

  /**
   * Get the reviewer's currently active review assignment
   */
  async getReviewerActiveTask(userId) {
    const [rows] = await db.query(
      `SELECT psr.*, ps.application_id, ps.status as stage_status,
              psd.name as stage_name, psd.stage_order,
              a.reference_number, a.title as application_title
       FROM pipeline_stage_reviewers psr
       JOIN pipeline_stages ps ON psr.pipeline_stage_id = ps.id
       JOIN pipeline_stage_definitions psd ON ps.stage_definition_id = psd.id
       JOIN applications a ON ps.application_id = a.id
       WHERE psr.user_id = ? AND psr.status = 'active'
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  },

  /**
   * Get all pending/active review assignments for a user
   */
  async getPendingReviewsForUser(userId) {
    const [rows] = await db.query(
      `SELECT psr.*, ps.application_id, ps.status as stage_status,
              psd.name as stage_name, psd.stage_order,
              a.reference_number, a.title as application_title, a.status as application_status
       FROM pipeline_stage_reviewers psr
       JOIN pipeline_stages ps ON psr.pipeline_stage_id = ps.id
       JOIN pipeline_stage_definitions psd ON ps.stage_definition_id = psd.id
       JOIN applications a ON ps.application_id = a.id
       WHERE psr.user_id = ? AND psr.status IN ('pending', 'active')
       ORDER BY psr.status DESC, psd.stage_order ASC`,
      [userId]
    );
    return rows;
  },

  /**
   * Process a reviewer's decision - core state machine
   */
  async processReviewerDecision(reviewerId, decision, comments, performedBy) {
    await db.query("START TRANSACTION");
    try {
      // Get reviewer with stage and definition info
      const [reviewers] = await db.query(
        `SELECT psr.*, ps.application_id, ps.stage_definition_id, ps.status as stage_status,
                psd.requires_unanimous, psd.min_reviewers, psd.stage_order
         FROM pipeline_stage_reviewers psr
         JOIN pipeline_stages ps ON psr.pipeline_stage_id = ps.id
         JOIN pipeline_stage_definitions psd ON ps.stage_definition_id = psd.id
         WHERE psr.id = ?`,
        [reviewerId]
      );
      if (!reviewers[0]) throw new Error("Reviewer assignment not found");

      const reviewer = reviewers[0];

      // Verify reviewer is active
      if (reviewer.status !== "active") {
        throw new Error("This review assignment is not currently active");
      }

      // Verify the performing user is the assigned reviewer
      if (reviewer.user_id !== performedBy) {
        throw new Error("You can only submit decisions for your own review assignments");
      }

      const oldData = { status: reviewer.status };

      // Update reviewer status
      await db.query(
        `UPDATE pipeline_stage_reviewers SET status = ?, comments = ?, reviewed_at = NOW()
         WHERE id = ?`,
        [decision, comments, reviewerId]
      );

      if (decision === "approved") {
        // Check if there's a next reviewer in this stage
        const [nextReviewers] = await db.query(
          `SELECT id FROM pipeline_stage_reviewers
           WHERE pipeline_stage_id = ? AND review_order > ? AND status = 'pending'
           ORDER BY review_order ASC LIMIT 1`,
          [reviewer.pipeline_stage_id, reviewer.review_order]
        );

        if (nextReviewers.length > 0) {
          // Activate next reviewer
          await db.query(
            "UPDATE pipeline_stage_reviewers SET status = 'active' WHERE id = ?",
            [nextReviewers[0].id]
          );
        } else {
          // All reviewers in this stage have approved - check unanimous requirement
          if (reviewer.requires_unanimous) {
            const [allReviewers] = await db.query(
              `SELECT status FROM pipeline_stage_reviewers WHERE pipeline_stage_id = ?`,
              [reviewer.pipeline_stage_id]
            );
            const allApproved = allReviewers.every(
              (r) => r.status === "approved" || (r.status === "approved")
            );
            // The current reviewer is already set to approved, check count
            const approvedCount = allReviewers.filter((r) => r.status === "approved").length;
            // +1 for current reviewer who was just updated
            if (approvedCount < reviewer.min_reviewers) {
              // Should not happen if reviewers were properly assigned, but safeguard
              await db.query("COMMIT");
              return { success: true, message: "Review submitted, waiting for more reviewers" };
            }
          }

          // Mark stage as approved
          await db.query(
            `UPDATE pipeline_stages SET status = 'approved', completed_at = NOW(), updated_at = NOW()
             WHERE id = ?`,
            [reviewer.pipeline_stage_id]
          );

          // Check if there's a next stage
          const [nextStages] = await db.query(
            `SELECT ps.id FROM pipeline_stages ps
             JOIN pipeline_stage_definitions psd ON ps.stage_definition_id = psd.id
             WHERE ps.application_id = ? AND psd.stage_order > ? AND ps.status = 'pending'
             ORDER BY psd.stage_order ASC LIMIT 1`,
            [reviewer.application_id, reviewer.stage_order]
          );

          if (nextStages.length > 0) {
            // Activate next stage
            const nextStageId = nextStages[0].id;
            await db.query(
              `UPDATE pipeline_stages SET status = 'active', started_at = NOW(), updated_at = NOW()
               WHERE id = ?`,
              [nextStageId]
            );

            // Activate first reviewer of next stage (if assigned)
            await db.query(
              `UPDATE pipeline_stage_reviewers SET status = 'active'
               WHERE pipeline_stage_id = ? AND review_order = 1`,
              [nextStageId]
            );

            // Update application's current stage pointer
            await db.query(
              "UPDATE applications SET pipeline_current_stage_id = ?, updated_at = NOW() WHERE id = ?",
              [nextStageId, reviewer.application_id]
            );
          } else {
            // All stages complete - approve application
            await db.query(
              `UPDATE applications SET status = 'approved', pipeline_completed_at = NOW(),
               updated_at = NOW() WHERE id = ?`,
              [reviewer.application_id]
            );
          }
        }
      } else if (decision === "rejected") {
        // Mark stage as rejected
        await db.query(
          `UPDATE pipeline_stages SET status = 'rejected', completed_at = NOW(), updated_at = NOW()
           WHERE id = ?`,
          [reviewer.pipeline_stage_id]
        );

        // Mark application as rejected
        await db.query(
          `UPDATE applications SET status = 'rejected', pipeline_completed_at = NOW(),
           updated_at = NOW() WHERE id = ?`,
          [reviewer.application_id]
        );
      } else if (decision === "returned") {
        // Mark stage as returned
        await db.query(
          `UPDATE pipeline_stages SET status = 'returned', completed_at = NOW(), updated_at = NOW()
           WHERE id = ?`,
          [reviewer.pipeline_stage_id]
        );
        // Application stays in_pipeline - admin can reassign or return to client
      }

      // Audit log
      await db.query(
        `INSERT INTO pipeline_audit_log (application_id, pipeline_stage_id, action, performed_by, old_data, new_data)
         VALUES (?, ?, 'reviewer_decision', ?, ?, ?)`,
        [
          reviewer.application_id,
          reviewer.pipeline_stage_id,
          performedBy,
          JSON.stringify(oldData),
          JSON.stringify({ status: decision, comments }),
        ]
      );

      await db.query("COMMIT");
      return { success: true };
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  },

  /**
   * Get sanitized pipeline view for clients (no reviewer names/comments)
   */
  async getClientPipelineView(applicationId) {
    const [stages] = await db.query(
      `SELECT ps.id, ps.status, ps.started_at, ps.completed_at,
              psd.name as stage_name, psd.stage_order, psd.description as stage_description
       FROM pipeline_stages ps
       JOIN pipeline_stage_definitions psd ON ps.stage_definition_id = psd.id
       WHERE ps.application_id = ?
       ORDER BY psd.stage_order ASC`,
      [applicationId]
    );
    return stages;
  },

  /**
   * Get pipeline audit log for an application
   */
  async getPipelineAuditLog(applicationId) {
    const [rows] = await db.query(
      `SELECT pal.*, u.username as performed_by_name
       FROM pipeline_audit_log pal
       LEFT JOIN users u ON pal.performed_by = u.id
       WHERE pal.application_id = ?
       ORDER BY pal.created_at DESC`,
      [applicationId]
    );
    return rows;
  },
};

module.exports = pipelineModel;
