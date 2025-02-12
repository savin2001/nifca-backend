// controllers/userController.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// Modify user details
const modifyUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const { username, email, role_id, company_id } = req.body;
    
    try {
        await db.query("UPDATE users SET username = ?, email = ?, role_id = ?, company_id = ? WHERE id = ?", 
            [username, email, role_id, company_id, userId]);
        res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while updating user." });
    }
};

// Delete user (soft delete by setting status to inactive)
const deleteUser = async (req, res) => {
    const { userId } = req.params;
    
    try {
        await db.query("UPDATE users SET status = 'inactive' WHERE id = ?", [userId]);
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while deleting user." });
    }
};

// Disable user
const disableUser = async (req, res) => {
    const { userId } = req.params;
    
    try {
        await db.query("UPDATE users SET enabled = FALSE WHERE id = ?", [userId]);
        res.status(200).json({ message: "User disabled successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while disabling user." });
    }
};

// Enable user
const enableUser = async (req, res) => {
    const { userId } = req.params;
    
    try {
        await db.query("UPDATE users SET enabled = TRUE WHERE id = ?", [userId]);
        res.status(200).json({ message: "User enabled successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while enabling user." });
    }
};

// Reset user password
const resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const { newPassword } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [hashedPassword, userId]);
        res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while resetting password." });
    }
};

// Fetch all users
const getUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, username, email, role_id, status, enabled FROM users");
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while fetching users." });
    }
};

// Fetch a single user by ID
const getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const [user] = await db.query("SELECT id, username, email, role_id, status, enabled FROM users WHERE id = ?", [userId]);
        if (user.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(user[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while fetching user." });
    }
};

// Update user role
const updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role_id } = req.body;
    
    try {
        await db.query("UPDATE users SET role_id = ? WHERE id = ?", [role_id, userId]);
        res.status(200).json({ message: "User role updated successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while updating user role." });
    }
};

// Force logout user (invalidate session or token)
const forceLogoutUser = async (req, res) => {
    const { userId } = req.params;
    
    try {
        await db.query("UPDATE users SET token = NULL WHERE id = ?", [userId]);
        res.status(200).json({ message: "User forcefully logged out." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while logging out user." });
    }
};

module.exports = {
    modifyUser,
    deleteUser,
    disableUser,
    enableUser,
    resetPassword,
    getUsers,
    getUserById,
    updateUserRole,
    forceLogoutUser
};
