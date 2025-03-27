// src/controllers/userController.js
const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");

const userController = {
  async modifyUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const { username, email, role_id, company_id } = req.body;

    try {
      const updatedUser = await userModel.update(userId, { username, email, role_id, company_id });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while updating user" });
    }
  },

  async deleteUser(req, res) {
    const { userId } = req.params;

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await userModel.softDelete(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while deleting user" });
    }
  },

  async disableUser(req, res) {
    const { userId } = req.params;

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await userModel.setEnabled(userId, false);
      res.status(200).json({ message: "User disabled successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while disabling user" });
    }
  },

  async enableUser(req, res) {
    const { userId } = req.params;

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await userModel.setEnabled(userId, true);
      res.status(200).json({ message: "User enabled successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while enabling user" });
    }
  },

  async resetPassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const { newPassword } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await userModel.updatePassword(userId, newPassword);
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while resetting password" });
    }
  },

  async getUsers(req, res) {
    try {
      const users = await userModel.getAll();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching users" });
    }
  },

  async getUserById(req, res) {
    const { userId } = req.params;

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching user" });
    }
  },

  async updateUserRole(req, res) {
    const { userId } = req.params;
    const { role_id } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await userModel.updateRole(userId, role_id);
      res.status(200).json({ message: "User role updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while updating user role" });
    }
  },

  async forceLogoutUser(req, res) {
    const { userId } = req.params;

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await userModel.forceLogout(userId);
      res.status(200).json({ message: "User forcefully logged out" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while logging out user" });
    }
  },
};

module.exports = userController;