// src/tests/setup_test_client.js
// Test script to set up a test client for manual API testing
const db = require('../config/db.js');

(async () => {
  try {
    // Find the test client
    const [clients] = await db.query(
      "SELECT id, email, verification_token, verified_at, enabled, status FROM clients WHERE email = ?",
      ['testclient1@example.com']
    );

    if (clients.length === 0) {
      console.log("Test client not found. Please register first via API.");
      process.exit(1);
    }

    const client = clients[0];
    console.log("Found client:", client);

    // Verify and activate the client
    await db.query(
      `UPDATE clients
       SET verified_at = NOW(), verification_token = NULL, enabled = TRUE, status = 'active'
       WHERE id = ?`,
      [client.id]
    );

    console.log("Client verified and activated successfully!");
    console.log("You can now login with:");
    console.log("  Email: testclient1@example.com");
    console.log("  Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();
