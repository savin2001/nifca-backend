// src/config/mailer.js
const nodemailer = require("nodemailer");
const path = require("path"); // Import the path module

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify the transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:3000/api/client/auth/verify?token=${token}`; // Updated to use client auth route
  const logoPath = path.join(__dirname, "../assets/nifca.png"); // Path to the logo

  const mailOptions = {
    from: `"NIFCA Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - NIFCA",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #FFFFFF; border-radius: 10px; border: 1px solid #ddd;">
        <div style="text-align: center; padding-bottom: 10px;">
          <img src="cid:logo" alt="NIFCA Logo" style="width: 150px;">
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
        <p style="color: #205473; font-size: 14px; text-align: center;">
          If you did not sign up for a NIFCA account, please ignore this email.
        </p>
        <p style="color: #000000; font-size: 14px; text-align: center;">
          Thanks,<br><strong>The NIFCA Team</strong>
        </p>
      </div>
    `,
    attachments: [
      {
        filename: "logo.png",
        path: logoPath,
        cid: "logo", // Same CID as used in the <img> tag
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send verification email to ${email}:`, error);
    throw error;
  }
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const mailOptions = {
    from: `"NIFCA Support" <${process.env.EMAIL_USER}>`, // Use the same format as sendVerificationEmail
    to: email,
    subject: "Password Reset Request - NIFCA",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #FFFFFF; border-radius: 10px; border: 1px solid #ddd;">
        <div style="text-align: center; padding-bottom: 10px;">
          <img src="cid:logo" alt="NIFCA Logo" style="width: 150px;">
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
    `,
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../assets/nifca.png"),
        cid: "logo",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send password reset email to ${email}:`, error);
    throw error;
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };