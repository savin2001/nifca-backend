// src/controllers/applicationController.js
const applicationModel = require("../models/applicationModel");
const clientModel = require("../models/clientModel");
const { validationResult } = require("express-validator");

const applicationController = {
  // Application Operations
  async createApplication(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { client_id, title, description } = req.body;
    const userId = req.user.userId;

    try {
      if (req.user.role !== 3) {
        return res.status(403).json({ error: "Only Application Admins can create applications." });
      }

      const client = await clientModel.findById(client_id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const application = await applicationModel.create({
        client_id,
        title,
        description,
        created_by: client_id,
      });
      res.status(201).json({ message: "Application created successfully", application });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while creating application" });
    }
  },

  async getAllApplications(req, res) {
    try {
      if (req.user.role !== 3) {
        return res.status(403).json({ error: "Only Application Admins can view applications." });
      }

      const applications = await applicationModel.findAll();
      res.status(200).json(applications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching applications" });
    }
  },

  async getApplicationById(req, res) {
    const applicationId = req.params.id;

    try {
      if (req.user.role !== 3) {
        return res.status(403).json({ error: "Only Application Admins can view applications." });
      }

      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.status(200).json(application);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching application" });
    }
  },

  async updateApplication(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const applicationId = req.params.id;
    const { title, description, status } = req.body;
    const userId = req.user.userId;

    try {
      if (req.user.role !== 3) {
        return res.status(403).json({ error: "Only Application Admins can update applications." });
      }

      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      const updatedApplication = await applicationModel.update(applicationId, {
        title,
        description,
        status,
        reviewed_by: userId,
      });
      res.status(200).json({ message: "Application updated successfully", application: updatedApplication });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while updating application" });
    }
  },

  async reviewApplication(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const applicationId = req.params.id;
    const { status } = req.body;
    const userId = req.user.userId;

    try {
      if (req.user.role !== 3) {
        return res.status(403).json({ error: "Only Application Admins can review applications." });
      }

      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      const updatedApplication = await applicationModel.updateStatus(applicationId, status, userId);
      res.status(200).json({ message: "Application reviewed successfully", application: updatedApplication });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while reviewing application" });
    }
  },

  async deleteApplication(req, res) {
    const applicationId = req.params.id;

    try {
      if (req.user.role !== 3) {
        return res.status(403).json({ error: "Only Application Admins can delete applications." });
      }

      const application = await applicationModel.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      await applicationModel.delete(applicationId);
      res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while deleting application" });
    }
  },

  // Client Management Operations
  async getAllClients(req, res) {
    try {
      if (req.user.role !== 3) {
        return res.status(403).json({ error: "Only Application Admins can view clients." });
      }

      const clients = await clientModel.getAll();
      res.status(200).json(clients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching clients" });
    }
  },

  async getClientById(req, res) {
    const clientId = req.params.id;

    try {
      if (req.user.role !== 3) {
        return res.status(403).json({ error: "Only Application Admins can view clients." });
      }

      const client = await clientModel.findById(clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.status(200).json(client);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching client" });
    }
  },

  async updateClient(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const clientId = req.params.id;
    const { username, email, company_id, status, enabled } = req.body;

    try {
      if (req.user.role !== 3) {
        return res.status(403).json({ error: "Only Application Admins can update clients." });
      }

      const client = await clientModel.findById(clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const updatedClient = await clientModel.update(clientId, {
        username: username || client.username,
        email: email || client.email,
        company_id: company_id || client.company_id,
      });

      if (status) {
        await clientModel.softDelete(clientId); // Updates status to 'inactive' if status is provided
      }

      if (enabled !== undefined) {
        await clientModel.setEnabled(clientId, enabled);
      }

      const updatedClientDetails = await clientModel.findById(clientId);
      res.status(200).json({ message: "Client updated successfully", client: updatedClientDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while updating client" });
    }
  },

  async deleteClient(req, res) {
    const clientId = req.params.id;

    try {
      if (req.user.role !== 3) {
        return res.status(403).json({ error: "Only Application Admins can delete clients." });
      }

      const client = await clientModel.findById(clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      await clientModel.softDelete(clientId);
      res.status(200).json({ message: "Client soft-deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while deleting client" });
    }
  },
};

module.exports = applicationController;