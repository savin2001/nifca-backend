// src/controllers/applicationController.js
const userModel = require("../models/userModel");
const applicationModel = require("../models/applicationModel");
const { validationResult } = require("express-validator");

const applicationController = {
  async disableClient(req, res) {
    const userId = req.user.userId;
    const clientId = parseInt(req.params.id);

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 3) {
        return res.status(403).json({ error: "Only Application Admins can access this endpoint." });
      }

      const client = await userModel.findById(clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      if (!(await userModel.isClient(clientId))) {
        return res.status(400).json({ error: "Target user is not a client" });
      }

      if (!client.enabled) {
        return res.status(400).json({ error: "Client is already disabled" });
      }

      await userModel.setEnabled(clientId, false, userId);
      await userModel.removeAllTokens(clientId); // Log out the client
      res.status(200).json({ message: "Client disabled successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Server error while disabling client" });
    }
  },

  async softDeleteClient(req, res) {
    const userId = req.user.userId;
    const clientId = parseInt(req.params.id);

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 3) {
        return res.status(403).json({ error: "Only Application Admins can access this endpoint." });
      }

      const client = await userModel.findById(clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      if (!(await userModel.isClient(clientId))) {
        return res.status(400).json({ error: "Target user is not a client" });
      }

      const hasDependencies = await userModel.hasDependencies(clientId);
      if (hasDependencies) {
        return res.status(400).json({ error: "Cannot delete client with associated applications." });
      }

      await userModel.softDelete(clientId, userId);
      res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Server error while deleting client" });
    }
  },

  async getAllApplications(req, res) {
    const userId = req.user.userId;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 3) {
        return res.status(403).json({ error: "Only Application Admins can access this endpoint." });
      }

      const applications = await applicationModel.getAll();
      res.status(200).json(applications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching applications" });
    }
  },

  async reviewApplication(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const applicationId = parseInt(req.params.id);
    const { status, reviewComments } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 3) {
        return res.status(403).json({ error: "Only Application Admins can access this endpoint." });
      }

      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      if (application.status !== 'pending') {
        return res.status(400).json({ error: "Only pending applications can be reviewed" });
      }

      const updatedApplication = await applicationModel.reviewApplication(applicationId, { status, reviewComments }, userId);
      res.status(200).json({ message: "Application reviewed successfully", application: updatedApplication });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Server error while reviewing application" });
    }
  },
};

module.exports = applicationController;