// src/tests/setup_nifca_client.js
// Script to set up a specific test client user

const db = require("../config/db.js");
const bcrypt = require("bcryptjs");

const CLIENT_EMAIL = "nifcauser2026@example.com";
const CLIENT_PASSWORD = "SecurePass123";
const CLIENT_USERNAME = "nifcauser2026";

async function setupNifcaClient() {
  try {
    const hashedPassword = await bcrypt.hash(CLIENT_PASSWORD, 10);

    console.log("Setting up NIFCA test client user...");

    // Check if client already exists
    const [existingClient] = await db.query(
      "SELECT id FROM clients WHERE email = ?",
      [CLIENT_EMAIL]
    );

    if (existingClient.length > 0) {
      // Update existing client
      await db.query(
        `UPDATE clients
         SET password_hash = ?,
             enabled = 1,
             status = 'active',
             verified_at = NOW()
         WHERE email = ?`,
        [hashedPassword, CLIENT_EMAIL]
      );
      console.log(`  ✓ Updated ${CLIENT_EMAIL} with password and verified`);
    } else {
      // Create new client
      await db.query(
        `INSERT INTO clients (email, password_hash, username, enabled, status, verified_at)
         VALUES (?, ?, ?, 1, 'active', NOW())`,
        [CLIENT_EMAIL, hashedPassword, CLIENT_USERNAME]
      );
      console.log(`  ✓ Created ${CLIENT_EMAIL} as Test Client`);
    }

    console.log("\n✅ NIFCA Test Client setup complete!");
    console.log("\nTest Client credentials:");
    console.log(`  Email:    ${CLIENT_EMAIL}`);
    console.log(`  Password: ${CLIENT_PASSWORD}`);

    process.exit(0);
  } catch (error) {
    console.error("Error setting up test client:", error);
    process.exit(1);
  }
}

setupNifcaClient();
