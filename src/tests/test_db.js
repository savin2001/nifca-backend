const db = require('../config/db.js');

(async () => {
    try {
        const [rows] = await db.query("SELECT 1 AS test");
        console.log("Database connected successfully:", rows);
    } catch (error) {
        console.error("Database connection failed:", error);
    }
})();
