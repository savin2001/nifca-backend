// src/tests/setup_content_admin.js
// Script to set up a content admin user for testing

const db = require("../config/db.js");
const bcrypt = require("bcryptjs");

const CONTENT_ADMIN_EMAIL = "contenteditor@nifca.com";
const CONTENT_ADMIN_PASSWORD = "ContentEditor2024";
const CONTENT_ADMIN_USERNAME = "contenteditor";

async function setupContentAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(CONTENT_ADMIN_PASSWORD, 10);

    console.log("Setting up content admin user...");

    // Check if user already exists
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [CONTENT_ADMIN_EMAIL]
    );

    if (existingUser.length > 0) {
      // Update existing user
      await db.query(
        `UPDATE users
         SET password_hash = ?,
             enabled = 1,
             status = 'active',
             verified_at = NOW()
         WHERE email = ?`,
        [hashedPassword, CONTENT_ADMIN_EMAIL]
      );
      console.log(`  ✓ Updated ${CONTENT_ADMIN_EMAIL} with password and verified`);
    } else {
      // Create new user
      await db.query(
        `INSERT INTO users (email, password_hash, username, role_id, company_id, enabled, status, verified_at)
         VALUES (?, ?, ?, 2, 1, 1, 'active', NOW())`,
        [CONTENT_ADMIN_EMAIL, hashedPassword, CONTENT_ADMIN_USERNAME]
      );
      console.log(`  ✓ Created ${CONTENT_ADMIN_EMAIL} as Content Admin (role_id=2)`);
    }

    console.log("\n✅ Content Admin setup complete!");
    console.log("\nContent Admin credentials:");
    console.log(`  Email:    ${CONTENT_ADMIN_EMAIL}`);
    console.log(`  Password: ${CONTENT_ADMIN_PASSWORD}`);

    process.exit(0);
  } catch (error) {
    console.error("Error setting up content admin:", error);
    process.exit(1);
  }
}

setupContentAdmin();
