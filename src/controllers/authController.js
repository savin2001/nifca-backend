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

    let { username, email, password, role_id, company_id } = req.body;
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

      if (!adminId && roleName !== "client") {
        return res.status(403).json({ error: "Only clients can self-register. Other roles must be created by an admin." });
      }

      if (roleName !== "client") {
        company_id = 1;
      } else {
        if (!company_id) {
          return res.status(400).json({ error: "Client users must provide a company_id" });
        }
        const company = await userModel.validateCompany(company_id);
        if (!company) {
          return res.status(400).json({ error: "Invalid company ID" });
        }
      }

      const newUser = await userModel.create({
        username,
        email,
        password,
        role_id,
        company_id,
        created_by: adminId,
      });

      await sendVerificationEmail(email, newUser.verificationToken);

      res.status(201).json({ message: "User registered successfully. Verification email sent." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during registration" });
    }
  },

  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Check if the user is soft-deleted
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

      const token = jwt.sign(
        { userId: user.id, role: user.role_id, companyId: user.company_id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      if (!user.enabled) {
        return res.status(200).json({
          token,
          message: "Please change your password before proceeding",
          forcePasswordChange: true,
        });
      }

      res.status(200).json({ token, message: "Login successful" });
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

      res.status(200).json({ message: "Password changed successfully. You can now proceed." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during password change" });
    }
  },
};

module.exports = authController;