// src/tests/setup_test_users.js
// Script to set up test users with known passwords for testing

const db = require("../config/db.js");
const bcrypt = require("bcryptjs");

const TEST_PASSWORD = "password123";

async function setupTestUsers() {
  try {
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

    // Update or create test client
    console.log("Setting up test client...");
    const [existingClient] = await db.query(
      "SELECT id FROM clients WHERE email = ?",
      ["client@nifca.com"]
    );

    if (existingClient.length > 0) {
      await db.query(
        "UPDATE clients SET password_hash = ?, enabled = 1, status = 'active', verified_at = NOW() WHERE email = ?",
        [hashedPassword, "client@nifca.com"]
      );
      console.log("  ✓ Updated client@nifca.com with test password");
    } else {
      await db.query(
        `INSERT INTO clients (email, password_hash, username, enabled, status, verified_at)
         VALUES (?, ?, ?, 1, 'active', NOW())`,
        ["client@nifca.com", hashedPassword, "testclient"]
      );
      console.log("  ✓ Created client@nifca.com with test password");
    }

    // Update or create test admin (Application Admin = role_id 3)
    console.log("Setting up test application admin...");
    const [existingAdmin] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      ["appadmin@nifca.com"]
    );

    if (existingAdmin.length > 0) {
      await db.query(
        "UPDATE users SET password_hash = ?, enabled = 1, status = 'active', verified_at = NOW() WHERE email = ?",
        [hashedPassword, "appadmin@nifca.com"]
      );
      console.log("  ✓ Updated appadmin@nifca.com with test password");
    } else {
      await db.query(
        `INSERT INTO users (email, password_hash, username, role_id, enabled, status, verified_at)
         VALUES (?, ?, ?, 3, 1, 'active', NOW())`,
        ["appadmin@nifca.com", hashedPassword, "appadmin"]
      );
      console.log("  ✓ Created appadmin@nifca.com with test password (role_id=3)");
    }

    console.log("\n✅ Test users setup complete!");
    console.log("\nTest credentials:");
    console.log("  Client:   client@nifca.com / password123");
    console.log("  Admin:    appadmin@nifca.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Error setting up test users:", error);
    process.exit(1);
  }
}

setupTestUsers();
