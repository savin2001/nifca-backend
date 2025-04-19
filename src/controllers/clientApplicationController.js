// src/controllers/clientApplicationController.js
const applicationModel = require("../models/applicationModel");
const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");

const clientApplicationController = {
  async createApplication(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const clientId = req.user.userId;
    const { title, description } = req.body;

    try {
      const user = await userModel.findById(clientId);
      if (user.role_id !== 7) {
        return res.status(403).json({ error: "Only clients can create applications" });
      }

      const applicationId = await applicationModel.create({ clientId, title, description });
      const application = await applicationModel.findById(applicationId);
      res.status(201).json({ message: "Application created successfully", application });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating application" });
    }
  },

  async getClientApplications(req, res) {
    const clientId = req.user.userId;

    try {
      const user = await userModel.findById(clientId);
      if (user.role_id !== 7) {
        return res.status(403).json({ error: "Only clients can view their applications" });
      }

      const applications = await applicationModel.getByClientId(clientId);
      res.status(200).json(applications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching applications" });
    }
  },

  async cancelApplication(req, res) {
    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);

    try {
      const user = await userModel.findById(clientId);
      if (user.role_id !== 7) {
        return res.status(403).json({ error: "Only clients can cancel their applications" });
      }

      const updatedApplication = await applicationModel.cancelApplication(applicationId, clientId);
      res.status(200).json({ message: "Application cancelled successfully", application: updatedApplication });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Server error while cancelling application" });
    }
  },
};

module.exports = clientApplicationController;