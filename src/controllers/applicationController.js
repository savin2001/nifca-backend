// src/controllers/applicationController.js
const userModel = require("../models/userModel");
const applicationModel = require("../models/applicationModel");
const { validationResult } = require("express-validator");

const applicationController = {
<<<<<<< HEAD
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
          await userModel.destroyClientSession(clientId); // Changed from removeAllTokens
          res.status(200).json({ message: "Client disabled successfully" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: error.message || "Server error while disabling client" });
        }
      },
=======
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
      await userModel.destroyClientSession(clientId); // Changed from removeAllTokens
      res.status(200).json({ message: "Client disabled successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Server error while disabling client" });
    }
  },
>>>>>>> 64afb1c8b48a2d7cadea3214dcf9cd57db070954

  // ... (rest of the methods remain unchanged)
};

module.exports = applicationController;