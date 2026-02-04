// src/config/mailer.js
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

// ============ EMAIL CONFIGURATION LOGGING ============
console.log("========================================");
console.log("EMAIL SERVICE INITIALIZATION");
console.log("========================================");
console.log("Environment:", process.env.NODE_ENV || "development");
console.log("RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);
console.log("EMAIL_HOST:", process.env.EMAIL_HOST || "(not set)");
console.log("EMAIL_PORT:", process.env.EMAIL_PORT || "(not set)");
console.log("EMAIL_SECURE:", process.env.EMAIL_SECURE || "(not set)");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 5)}...` : "(not set)");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "(set - hidden)" : "(not set)");
console.log("========================================");

// Determine which email provider to use
const useResend = process.env.RESEND_API_KEY ? true : false;
console.log("Email provider selected:", useResend ? "RESEND API" : "SMTP (Nodemailer)");

// SMTP Transporter (for local development or SMTP-friendly hosts)
let transporter = null;
if (!useResend && process.env.EMAIL_HOST) {
  console.log("Initializing SMTP transporter...");
  console.log(`  Host: ${process.env.EMAIL_HOST}`);
  console.log(`  Port: ${process.env.EMAIL_PORT}`);
  console.log(`  Secure: ${process.env.EMAIL_SECURE === "true"}`);

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add connection timeout settings
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000,
    // Enable debug logging
    logger: process.env.NODE_ENV !== "production",
    debug: process.env.NODE_ENV !== "production",
  });

  console.log("Verifying SMTP connection...");
  transporter.verify((error, success) => {
    if (error) {
      console.error("========================================");
      console.error("SMTP CONNECTION FAILED");
      console.error("========================================");
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error command:", error.command);
      if (error.code === "ETIMEDOUT") {
        console.error("DIAGNOSIS: Connection timed out. Possible causes:");
        console.error("  1. Firewall blocking outbound SMTP (port 587/465)");
        console.error("  2. SMTP server not reachable from this network");
        console.error("  3. Incorrect host/port configuration");
        console.error("  4. Cloud provider blocking SMTP connections");
      } else if (error.code === "EAUTH") {
        console.error("DIAGNOSIS: Authentication failed. Check:");
        console.error("  1. EMAIL_USER and EMAIL_PASS are correct");
        console.error("  2. For Gmail: Use App Password, not regular password");
        console.error("  3. For Gmail: Enable 2FA and generate App Password");
      }
      console.error("========================================");
    } else {
      console.log("========================================");
      console.log("SMTP CONNECTION SUCCESSFUL");
      console.log("Server is ready to send emails");
      console.log("========================================");
    }
  });
} else if (useResend) {
  console.log("========================================");
  console.log("RESEND API CONFIGURED");
  console.log("From email:", process.env.RESEND_FROM_EMAIL || "NIFCA <noreply@nifca.go.ke>");
  console.log("========================================");
} else {
  console.warn("========================================");
  console.warn("WARNING: NO EMAIL CONFIGURATION FOUND");
  console.warn("Emails will NOT be sent!");
  console.warn("Set either RESEND_API_KEY or EMAIL_HOST");
  console.warn("========================================");
}

// Send email via Resend API
const sendViaResend = async (to, subject, html) => {
  console.log("[RESEND] Attempting to send email...");
  console.log(`[RESEND] To: ${to}`);
  console.log(`[RESEND] Subject: ${subject}`);

  const startTime = Date.now();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "NIFCA <noreply@nifca.go.ke>",
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const elapsed = Date.now() - startTime;
    console.log(`[RESEND] Response received in ${elapsed}ms`);
    console.log(`[RESEND] Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const error = await response.json();
      console.error("[RESEND] API Error:", JSON.stringify(error, null, 2));
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log("[RESEND] Success! Email ID:", result.id);
    return result;
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[RESEND] Failed after ${elapsed}ms:`, error.message);
    throw error;
  }
};

// Send email via SMTP (Nodemailer)
const sendViaSMTP = async (mailOptions) => {
  console.log("[SMTP] Attempting to send email...");
  console.log(`[SMTP] To: ${mailOptions.to}`);
  console.log(`[SMTP] From: ${mailOptions.from}`);
  console.log(`[SMTP] Subject: ${mailOptions.subject}`);

  if (!transporter) {
    console.error("[SMTP] ERROR: Transporter not configured!");
    throw new Error("SMTP transporter not configured");
  }

  const startTime = Date.now();

  try {
    console.log("[SMTP] Connecting to SMTP server...");
    const result = await transporter.sendMail(mailOptions);
    const elapsed = Date.now() - startTime;

    console.log(`[SMTP] Email sent successfully in ${elapsed}ms`);
    console.log(`[SMTP] Message ID: ${result.messageId}`);
    console.log(`[SMTP] Response: ${result.response}`);

    return result;
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[SMTP] Failed after ${elapsed}ms`);
    console.error(`[SMTP] Error code: ${error.code}`);
    console.error(`[SMTP] Error message: ${error.message}`);

    if (error.code === "ETIMEDOUT") {
      console.error("[SMTP] TIMEOUT - Server did not respond");
      console.error("[SMTP] This usually means:");
      console.error("  - Port 587/465 is blocked by firewall");
      console.error("  - Cloud provider blocks outbound SMTP");
      console.error("  - Network connectivity issue");
    } else if (error.code === "ECONNREFUSED") {
      console.error("[SMTP] CONNECTION REFUSED - Cannot reach server");
    } else if (error.code === "EAUTH") {
      console.error("[SMTP] AUTHENTICATION FAILED");
      console.error("  - Check username/password");
      console.error("  - For Gmail: Use App Password");
    }

    throw error;
  }
};

const sendVerificationEmail = async (email, token, userType = "client", password) => {
  // Determine URLs based on environment
  const isProduction = process.env.NODE_ENV === "production";

  // Remove trailing slash from URLs to prevent double slashes
  let baseUrl, backendUrl;

  if (isProduction) {
    // In production, these MUST be set in environment variables
    baseUrl = (process.env.FRONTEND_URL || "").replace(/\/+$/, "");
    backendUrl = (process.env.BACKEND_URL || "").replace(/\/+$/, "");

    if (!baseUrl) {
      console.error("WARNING: FRONTEND_URL not set in production!");
    }
    if (!backendUrl) {
      console.error("WARNING: BACKEND_URL not set in production!");
    }
  } else {
    // Local development defaults
    baseUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
    backendUrl = (process.env.BACKEND_URL || "http://localhost:3000").replace(/\/+$/, "");
  }

  console.log(`[EMAIL] Environment: ${isProduction ? "production" : "development"}`);
  console.log(`[EMAIL] Frontend URL: ${baseUrl}`);
  console.log(`[EMAIL] Backend URL: ${backendUrl}`);

  // Validate URLs are set in production
  if (isProduction) {
    if (!baseUrl) {
      throw new Error("FRONTEND_URL environment variable is required in production");
    }
    if (!backendUrl && userType === "admin") {
      throw new Error("BACKEND_URL environment variable is required in production for admin emails");
    }
  }

  // For admin users, use backend API directly. For clients, use frontend page.
  const verificationLink = userType === "admin"
    ? `${backendUrl}/api/auth/verify?token=${token}`
    : `${baseUrl}/client/verify-email?token=${token}`;

  // Only show password section for admin users who have a temporary password
  const passwordSection = password
    ? `<p style="color: #205473; font-size: 16px; text-align: center;">
          Your temporary password: <strong>${password}</strong>
        </p>
        <p style="color: #205473; font-size: 14px; text-align: center;">
          Please change your password after logging in.
        </p>`
    : `<p style="color: #205473; font-size: 16px; text-align: center;">
          After verification, you will need to activate your account using the password you chose during registration.
        </p>`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #FFFFFF; border-radius: 10px; border: 1px solid #ddd;">
      <div style="text-align: center; padding-bottom: 10px;">
        <h1 style="color: #A62D5C; margin: 0;">NIFCA</h1>
      </div>
      <h2 style="color: #A62D5C; text-align: center;">Welcome to NIFCA!</h2>
      <p style="color: #205473; font-size: 16px; text-align: center;">
        We're excited to have you on board. Before you get started, please verify your email address by clicking the button below:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${verificationLink}"
          style="background-color: #A62D5C; color: #FFFFFF; padding: 12px 18px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
      </div>
      ${passwordSection}
      <p style="color: #205473; font-size: 14px; text-align: center;">
        If you did not sign up for a NIFCA account, please ignore this email.
      </p>
      <p style="color: #000000; font-size: 14px; text-align: center;">
        Thanks,<br><strong>The NIFCA Team</strong>
      </p>
    </div>
  `;

  console.log("========================================");
  console.log("SENDING VERIFICATION EMAIL");
  console.log("========================================");
  console.log(`Recipient: ${email}`);
  console.log(`User type: ${userType}`);
  console.log(`Provider: ${useResend ? "Resend" : "SMTP"}`);
  console.log(`Verification link: ${verificationLink}`);
  console.log("========================================");

  try {
    if (useResend) {
      await sendViaResend(email, "Verify Your Email - NIFCA", htmlContent);
    } else {
      const logoPath = path.join(__dirname, "../assets/nifca.png");
      console.log(`[SMTP] Logo path: ${logoPath}`);
      console.log(`[SMTP] Logo exists: ${fs.existsSync(logoPath)}`);

      await sendViaSMTP({
        from: `"NIFCA Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email - NIFCA",
        html: htmlContent.replace(
          '<h1 style="color: #A62D5C; margin: 0;">NIFCA</h1>',
          '<img src="cid:logo" alt="NIFCA Logo" style="width: 150px;">'
        ),
        attachments: [
          {
            filename: "logo.png",
            path: logoPath,
            cid: "logo",
          },
        ],
      });
    }
    console.log("========================================");
    console.log(`SUCCESS: Verification email sent to ${email}`);
    console.log("========================================");
  } catch (error) {
    console.error("========================================");
    console.error(`FAILED: Could not send verification email to ${email}`);
    console.error("Error:", error.message);
    console.error("========================================");
    throw error;
  }
};

const sendPasswordResetEmail = async (email, token) => {
  // Determine URL based on environment
  const isProduction = process.env.NODE_ENV === "production";

  let baseUrl;
  if (isProduction) {
    baseUrl = (process.env.FRONTEND_URL || "").replace(/\/+$/, "");
    if (!baseUrl) {
      console.error("WARNING: FRONTEND_URL not set in production!");
    }
  } else {
    baseUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
  }

  const resetUrl = `${baseUrl}/client/reset-password?token=${token}`;
  console.log(`[EMAIL] Environment: ${isProduction ? "production" : "development"}`);
  console.log(`[EMAIL] Frontend URL: ${baseUrl}`);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #FFFFFF; border-radius: 10px; border: 1px solid #ddd;">
      <div style="text-align: center; padding-bottom: 10px;">
        <h1 style="color: #A62D5C; margin: 0;">NIFCA</h1>
      </div>
      <h2 style="color: #A62D5C; text-align: center;">Password Reset Request</h2>
      <p style="color: #205473; font-size: 16px; text-align: center;">
        You requested a password reset. Click the button below to reset your password:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetUrl}"
          style="background-color: #A62D5C; color: #FFFFFF; padding: 12px 18px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #205473; font-size: 14px; text-align: center;">
        This link will expire in 1 hour. If you did not request this, please ignore this email.
      </p>
      <p style="color: #000000; font-size: 14px; text-align: center;">
        Thanks,<br><strong>The NIFCA Team</strong>
      </p>
    </div>
  `;

  console.log("========================================");
  console.log("SENDING PASSWORD RESET EMAIL");
  console.log("========================================");
  console.log(`Recipient: ${email}`);
  console.log(`Provider: ${useResend ? "Resend" : "SMTP"}`);
  console.log(`Reset link: ${resetUrl}`);
  console.log("========================================");

  try {
    if (useResend) {
      await sendViaResend(email, "Password Reset Request - NIFCA", htmlContent);
    } else {
      const logoPath = path.join(__dirname, "../assets/nifca.png");
      await sendViaSMTP({
        from: `"NIFCA Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset Request - NIFCA",
        html: htmlContent.replace(
          '<h1 style="color: #A62D5C; margin: 0;">NIFCA</h1>',
          '<img src="cid:logo" alt="NIFCA Logo" style="width: 150px;">'
        ),
        attachments: [
          {
            filename: "logo.png",
            path: logoPath,
            cid: "logo",
          },
        ],
      });
    }
    console.log("========================================");
    console.log(`SUCCESS: Password reset email sent to ${email}`);
    console.log("========================================");
  } catch (error) {
    console.error("========================================");
    console.error(`FAILED: Could not send password reset email to ${email}`);
    console.error("Error:", error.message);
    console.error("========================================");
    throw error;
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
