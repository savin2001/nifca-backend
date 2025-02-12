const db = require("../config/db");

const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(403).json({ error: "Unauthorized. User not found in request." });
        }

        console.log("Admin Middleware Check:", req.user); // Debugging

        const userId = req.user.userId; // Ensure token payload contains 'userId'

        const [user] = await db.query("SELECT role_id FROM users WHERE id = ?", [userId]);

        if (user.length === 0) {
            return res.status(403).json({ error: "User not found." });
        }

        if (user[0].role_id !== 1) { // Assuming role_id 1 is admin
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while checking admin privileges." });
    }
};

module.exports = adminMiddleware;
