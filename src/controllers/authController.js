// src/controllers/authController.js
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { sendVerificationEmail } = require("../config/mailer");

const authController = {
  async registerUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role_id, company_id } = req.body;
    const adminId = req.user?.userId || null;

    try {
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const role = await userModel.validateRole(role_id);
      if (!role) {
        return res.status(400).json({ error: "Invalid role ID" });
      }

      const roleName = role.name;

      if (!adminId) {
        return res.status(403).json({ error: "Only site admins can create users." });
      }

      const adminUser = await userModel.findById(adminId);
      if (adminUser.role_id !== 1) {
        return res.status(403).json({ error: "Only site admins can create other users." });
      }

      if (roleName === "client") {
        return res.status(403).json({ error: "Clients cannot be registered through this endpoint. Use the client registration endpoint." });
      }

      const newUser = await userModel.create({
        username,
        email,
        password,
        role_id,
        company_id: company_id || 1,
        created_by: adminId,
      });

      await sendVerificationEmail(email, newUser.verificationToken, "admin");

      res.status(201).json({ message: "User registered successfully. Verification email sent." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during registration" });
    }
  },

  async getAllUsers(req, res) {
    const adminId = req.user.userId;

    try {
      const adminUser = await userModel.findById(adminId);
      if (adminUser.role_id !== 1) {
        return res.status(403).json({ error: "Only site admins can view all users." });
      }

      const users = await userModel.getAll();
      // Filter out clients (role_id: 7)
      const filteredUsers = users.filter(user => user.role_id !== 7);
      res.status(200).json(filteredUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching users" });
    }
  },

  async getUserById(req, res) {
    const adminId = req.user.userId;
    const userId = req.params.id;

    try {
      const adminUser = await userModel.findById(adminId);
      if (adminUser.role_id !== 1) {
        return res.status(403).json({ error: "Only site admins can view user details." });
      }

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.role_id === 7) {
        return res.status(403).json({ error: "Clients cannot be viewed through this endpoint. Use the client management endpoint." });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while fetching user" });
    }
  },

  async updateUser(req, res) {
    const adminId = req.user.userId;
    const userId = req.params.id;
    const { username, email, role_id, company_id, status, enabled } = req.body;

    try {
      const adminUser = await userModel.findById(adminId);
      if (adminUser.role_id !== 1) {
        return res.status(403).json({ error: "Only site admins can update users." });
      }

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.role_id === 7) {
        return res.status(403).json({ error: "Clients cannot be updated through this endpoint. Use the client management endpoint." });
      }

      const updatedUser = await userModel.update(userId, {
        username: username || user.username,
        email: email || user.email,
        role_id: role_id || user.role_id,
        company_id: company_id || user.company_id,
      });

      if (status) {
        await userModel.softDelete(userId); // Updates status to 'inactive' if status is provided
      }

      if (enabled !== undefined) {
        await userModel.setEnabled(userId, enabled);
      }

      const updatedUserDetails = await userModel.findById(userId);
      res.status(200).json({ message: "User updated successfully", user: updatedUserDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while updating user" });
    }
  },

  async deleteUser(req, res) {
    const adminId = req.user.userId;
    const userId = req.params.id;

    try {
      const adminUser = await userModel.findById(adminId);
      if (adminUser.role_id !== 1) {
        return res.status(403).json({ error: "Only site admins can delete users." });
      }

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.role_id === 7) {
        return res.status(403).json({ error: "Clients cannot be deleted through this endpoint. Use the client management endpoint." });
      }

      await userModel.softDelete(userId);
      res.status(200).json({ message: "User soft-deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while deleting user" });
    }
  },

  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      if (user.status === "inactive") {
        return res.status(403).json({ error: "Account has been deactivated. Please contact support." });
      }

      if (!user.verified_at) {
        return res.status(403).json({
          error: "Please verify your email before logging in",
          redirect: "/verify-email",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        await userModel.incrementFailedAttempts(user.id);
        return res.status(401).json({ error: "Invalid email or password" });
      }

      await userModel.resetFailedAttempts(user.id);
      await userModel.updateLastLogin(user.id);

      const expiresIn = 3600;
      const token = jwt.sign(
        { userId: user.id, role: user.role_id, companyId: user.company_id },
        process.env.JWT_SECRET,
        { expiresIn }
      );

      const expiresAt = new Date(Date.now() + expiresIn * 1000);
      await userModel.storeToken(user.id, token, expiresAt);

      if (!user.enabled) {
        return res.status(200).json({
          token,
          message: "Please change your password before proceeding",
          forcePasswordChange: true,
        });
      }

      return res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during login" });
    }
  },

  async verifyEmail(req, res) {
    const { token } = req.query;

    try {
      const user = await userModel.findByVerificationToken(token);
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      await userModel.verifyEmail(user.id);

      res.status(200).json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during verification" });
    }
  },

  async changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Old password is incorrect" });
      }

      await userModel.updatePassword(userId, newPassword);
      await userModel.removeAllTokens(userId);

      res.status(200).json({ message: "Password changed successfully. Please log in again." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during password change" });
    }
  },

  async logoutUser(req, res) {
    const userId = req.user.userId;

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.status === "inactive") {
        return res.status(403).json({ error: "Account has been deactivated. Please contact support." });
      }

      const token = req.header("Authorization")?.replace("Bearer ", "");
      await userModel.removeToken(userId, token);

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during logout" });
    }
  },
};

module.exports = authController;