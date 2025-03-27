// src/controllers/clientController.js
const clientModel = require("../models/clientModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { sendVerificationEmail } = require("../config/mailer");

const clientController = {
  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, company_id } = req.body;

    try {
      const existingClient = await clientModel.findByEmail(email);
      if (existingClient) {
        return res.status(400).json({ error: "Email already in use" });
      }

      if (!company_id) {
        return res.status(400).json({ error: "Client users must provide a company_id" });
      }

      const company = await clientModel.validateCompany(company_id);
      if (!company) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const newClient = await clientModel.create({
        username,
        email,
        password,
        company_id,
      });

      await sendVerificationEmail(email, newClient.verificationToken, "client");

      res.status(201).json({ message: "Client registered successfully. Verification email sent." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during registration" });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const client = await clientModel.findByEmail(email);
      if (!client) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      if (client.status === "inactive") {
        return res.status(403).json({ error: "Account has been deactivated. Please contact support." });
      }

      if (!client.verified_at) {
        return res.status(403).json({
          error: "Please verify your email before logging in",
          redirect: "/verify-email",
        });
      }

      if (!client.enabled) {
        return res.status(403).json({
          error: "Please activate your account before logging in",
          redirect: "/activate-account",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, client.password_hash);
      if (!isPasswordValid) {
        await clientModel.incrementFailedAttempts(client.id);
        return res.status(401).json({ error: "Invalid email or password" });
      }

      await clientModel.resetFailedAttempts(client.id);
      await clientModel.updateLastLogin(client.id);

      req.session.user = {
        userId: client.id,
        role: 7,
        companyId: client.company_id,
        isClient: true,
      };

      return res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during login" });
    }
  },

  async verifyEmail(req, res) {
    const { token } = req.query;

    try {
      const client = await clientModel.findByVerificationToken(token);
      if (!client) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      await clientModel.verifyEmail(client.id);

      return res.status(200).json({
        message: "Email verified successfully. Please activate your account.",
        redirect: "/activate-account",
        requiresActivation: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during verification" });
    }
  },

  async activateAccount(req, res) {
    const { email, password } = req.body;

    try {
      const client = await clientModel.findByEmail(email);
      if (!client) {
        return res.status(404).json({ error: "Client not found." });
      }

      if (!client.verified_at) {
        return res.status(400).json({ error: "Please verify your email before activating your account." });
      }

      if (client.enabled) {
        return res.status(400).json({ error: "Account is already activated." });
      }

      const isPasswordValid = await bcrypt.compare(password, client.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password." });
      }

      await clientModel.activateAccount(client.id);

      res.status(200).json({ message: "Account activated successfully. You can now log in." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during account activation" });
    }
  },

  async requestPasswordReset(req, res) {
    const { email } = req.body;

    try {
      const client = await clientModel.findByEmail(email);
      if (!client) {
        return res.status(200).json({ message: "If the email exists, a password reset link has been sent." });
      }

      if (!client.verified_at) {
        return res.status(400).json({ error: "Please verify your email before requesting a password reset." });
      }

      if (client.status === "inactive") {
        return res.status(403).json({ error: "Account has been deactivated. Please contact support." });
      }

      const resetToken = await clientModel.generateResetToken(client.id);
      try {
        await sendPasswordResetEmail(email, resetToken);
      } catch (emailError) {
        console.error("Email sending failed, but request processed:", emailError);
      }

      res.status(200).json({ message: "If the email exists, a password reset link has been sent." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during password reset request" });
    }
  },

  async resetPassword(req, res) {
    const { token, newPassword } = req.body;

    try {
      const client = await clientModel.findByResetToken(token);
      if (!client) {
        return res.status(400).json({ error: "Invalid or expired reset token." });
      }

      await clientModel.updatePassword(client.id, newPassword);

      res.status(200).json({ message: "Password reset successfully. You can now log in with your new password." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during password reset" });
    }
  },

  async changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    try {
      const client = await clientModel.findById(userId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, client.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Old password is incorrect" });
      }

      await clientModel.updatePassword(userId, newPassword);

      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to log out after password change" });
        }
        res.status(200).json({ message: "Password changed successfully. Please log in again." });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during password change" });
    }
  },

  async logout(req, res) {
    const userId = req.user.userId;

    try {
      const client = await clientModel.findById(userId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      if (client.status === "inactive") {
        return res.status(403).json({ error: "Account has been deactivated. Please contact support." });
      }

      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to log out" });
        }
        res.status(200).json({ message: "Logged out successfully" });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during logout" });
    }
  },
};

module.exports = clientController;