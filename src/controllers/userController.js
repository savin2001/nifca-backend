// src/controllers/userController.js
const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");

const userController = {
  async getUsers(req, res) {
    const userId = req.user.userId;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 1) {
        return res.status(403).json({ error: "Only site admins can access this endpoint." });
      }

      const users = await userModel.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching users" });
    }
  },

  async getUserById(req, res) {
    const userId = req.user.userId;
    const targetUserId = parseInt(req.params.id);

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 1) {
        return res.status(403).json({ error: "Only site admins can access this endpoint." });
      }

      const targetUser = await userModel.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        id: targetUser.id,
        username: targetUser.username,
        email: targetUser.email,
        role_id: targetUser.role_id,
        status: targetUser.status,
        enabled: targetUser.enabled,
        failed_attempts: targetUser.failed_attempts,
        last_login: targetUser.last_login,
        company_id: targetUser.company_id,
        created_by: targetUser.created_by,
        created_at: targetUser.created_at,
        updated_at: targetUser.updated_at,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching user" });
    }
  },

  async updateUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const targetUserId = parseInt(req.params.id);
    const updates = req.body;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 1) {
        return res.status(403).json({ error: "Only site admins can access this endpoint." });
      }

      const targetUser = await userModel.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (targetUser.role_id === 7) {
        return res.status(403).json({ error: "Clients cannot be managed through this endpoint. Use the client management endpoint." });
      }

      const updatedUser = await userModel.updateUser(targetUserId, updates, userId);
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Server error while updating user" });
    }
  },

  async deleteUser(req, res) {
    const userId = req.user.userId;
    const targetUserId = parseInt(req.params.id);

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 1) {
        return res.status(403).json({ error: "Only site admins can access this endpoint." });
      }

      const targetUser = await userModel.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (targetUser.role_id === 7) {
        return res.status(403).json({ error: "Clients cannot be managed through this endpoint. Use the client management endpoint." });
      }

      if (targetUserId === userId) {
        return res.status(400).json({ error: "You cannot delete your own account." });
      }

      const hasDependencies = await userModel.hasDependencies(targetUserId);
      if (hasDependencies) {
        return res.status(400).json({ error: "Cannot delete user with associated content or applications." });
      }

      await userModel.softDelete(targetUserId, userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Server error while deleting user" });
    }
  },

  async disableUser(req, res) {
    const userId = req.user.userId;
    const targetUserId = parseInt(req.params.id);

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 1) {
        return res.status(403).json({ error: "Only site admins can access this endpoint." });
      }

      const targetUser = await userModel.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (targetUser.role_id === 7) {
        return res.status(403).json({ error: "Clients cannot be managed through this endpoint. Use the client management endpoint." });
      }

      if (targetUserId === userId) {
        return res.status(400).json({ error: "You cannot disable your own account." });
      }

      if (!targetUser.enabled) {
        return res.status(400).json({ error: "User is already disabled" });
      }

      await userModel.setEnabled(targetUserId, false, userId);
      await userModel.removeAllTokens(targetUserId); // Log out the user
      res.status(200).json({ message: "User disabled successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Server error while disabling user" });
    }
  },

  async enableUser(req, res) {
    const userId = req.user.userId;
    const targetUserId = parseInt(req.params.id);

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 1) {
        return res.status(403).json({ error: "Only site admins can access this endpoint." });
      }

      const targetUser = await userModel.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (targetUser.role_id === 7) {
        return res.status(403).json({ error: "Clients cannot be managed through this endpoint. Use the client management endpoint." });
      }

      if (targetUser.enabled) {
        return res.status(400).json({ error: "User is already enabled" });
      }

      await userModel.setEnabled(targetUserId, true, userId);
      res.status(200).json({ message: "User enabled successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Server error while enabling user" });
    }
  },

  async resetPassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const targetUserId = parseInt(req.params.id);
    const { newPassword } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 1) {
        return res.status(403).json({ error: "Only site admins can access this endpoint." });
      }

      const targetUser = await userModel.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (targetUser.role_id === 7) {
        return res.status(403).json({ error: "Clients cannot be managed through this endpoint. Use the client management endpoint." });
      }

      await userModel.updatePassword(targetUserId, newPassword, userId);
      await userModel.removeAllTokens(targetUserId); // Force re-login
      res.status(200).json({ message: "Password reset successfully. User must log in again." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Server error while resetting password" });
    }
  },

  async forceLogoutUser(req, res) {
    const userId = req.user.userId;
    const targetUserId = parseInt(req.params.id);

    try {
      const user = await userModel.findById(userId);
      if (user.role_id !== 1) {
        return res.status(403).json({ error: "Only site admins can access this endpoint." });
      }

      const targetUser = await userModel.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (targetUser.role_id === 7) {
        return res.status(403).json({ error: "Clients cannot be managed through this endpoint. Use the client management endpoint." });
      }

      if (targetUserId === userId) {
        return res.status(400).json({ error: "You cannot force logout your own account." });
      }

      await userModel.removeAllTokens(targetUserId);
      res.status(200).json({ message: "User forcefully logged out" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while logging out user" });
    }
  },
};

module.exports = userController;