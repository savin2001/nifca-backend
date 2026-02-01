// src/controllers/clientApplicationController.js
const applicationModel = require("../models/applicationModel");
const clientModel = require("../models/clientModel");
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
      const client = await clientModel.findById(clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
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
    console.log('=== GET CLIENT APPLICATIONS ===');
    console.log('Request user:', req.user);
    console.log('Session:', req.session);

    const clientId = req.user.userId;
    console.log('Client ID:', clientId);

    try {
      const client = await clientModel.findById(clientId);
      console.log('Client found:', client ? 'Yes' : 'No');

      if (!client) {
        console.log('ERROR: Client not found');
        return res.status(404).json({ error: "Client not found" });
      }

      const applications = await applicationModel.getByClientId(clientId);
      console.log('Applications found:', applications.length);
      console.log('Applications data:', JSON.stringify(applications, null, 2));

      res.status(200).json(applications);
    } catch (error) {
      console.error('ERROR in getClientApplications:', error);
      res.status(500).json({ error: "Server error while fetching applications" });
    }
  },

  async getClientApplication(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);

    try {
      const client = await clientModel.findById(clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Verify the application belongs to the client
      if (application.client_id !== clientId) {
        return res.status(403).json({ error: "Unauthorized: You can only view your own applications" });
      }

      res.status(200).json(application);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching application" });
    }
  },

  async cancelApplication(req, res) {
    const clientId = req.user.userId;
    const applicationId = parseInt(req.params.id);

    try {
      const client = await clientModel.findById(clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
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