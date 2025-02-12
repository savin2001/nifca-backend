const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../config/mailer");

const registerUser = async (req, res) => {
    let { username, email, password, role_id, company_id } = req.body;
    const adminId = req.user?.userId || null; // Extract admin ID if present (null for self-registration)
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if email already exists
        const [existingUser] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Validate role_id exists
        const [roleRows] = await db.query("SELECT name FROM roles WHERE id = ?", [role_id]);
        if (roleRows.length === 0) {
            return res.status(400).json({ error: "Invalid role ID" });
        }

        const roleName = roleRows[0].name;

        // ✅ Enforce that only "client" can self-register
        if (!adminId && roleName !== "client") {
            return res.status(403).json({ error: "Only clients can self-register. Other roles must be created by an admin." });
        }

        // If the role is NOT "client", default company_id to Nifca (company_id = 1)
        if (roleName !== "client") {
            company_id = 1;
        } else {
            // Ensure company_id exists for client users
            if (!company_id) {
                return res.status(400).json({ error: "Client users must provide a company_id" });
            }

            const [companyRows] = await db.query("SELECT id FROM companies WHERE id = ?", [company_id]);
            if (companyRows.length === 0) {
                return res.status(400).json({ error: "Invalid company ID" });
            }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Insert user into the database (store admin ID if applicable)
        await db.query(
            "INSERT INTO users (username, email, password_hash, role_id, company_id, verification_token, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [username, email, passwordHash, role_id, company_id, verificationToken, 'inactive', adminId]
        );

        // Send email verification
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: "User registered successfully. Verification email sent." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error during registration" });
    }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // Redirect unverified users to verify email
    if (!user.verified_at) {
      return res.status(403).json({
        error: "Please verify your email before logging in",
        redirect: "/verify-email",
      });
    }

    // Check password validity
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token before checking password change requirement
    const token = jwt.sign(
      { userId: user.id, role: user.role_id, companyId: user.company_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // If the user hasn't changed their password, force them to do so
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
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    // Find user by token
    const [users] = await db.query(
      "SELECT id FROM users WHERE verification_token = ?",
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const user = users[0];

    // Update user to mark email as verified
    await db.query(
      "UPDATE users SET verified_at = NOW(), verification_token = NULL WHERE id = ?",
      [user.id]
    );

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during verification" });
  }
};

// ✅ Change Password Function
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId; // Extracted from JWT token

  try {
    // Get user details
    const [users] = await db.query(
      "SELECT password_hash FROM users WHERE id = ?",
      [userId]
    );
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];

    // Validate old password
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      user.password_hash
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password and mark user as enabled (status = 'active')
    await db.query(
      "UPDATE users SET password_hash = ?, enabled = TRUE, status = 'active' WHERE id = ?",
      [newPasswordHash, userId]
    );

    res
      .status(200)
      .json({ message: "Password changed successfully. You can now proceed." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during password change" });
  }
};

module.exports = { registerUser, loginUser, verifyEmail, changePassword };
