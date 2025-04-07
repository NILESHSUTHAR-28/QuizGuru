const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/Users");

// Store blacklisted tokens (use Redis or database for production)
let blacklistedTokens = new Set();

// Signup functionconst bcrypt = require("bcrypt"); // Ensure correct path

const signup = async (req, res) => {
    try {
        console.log("🔹 Signup API Hit"); // Debugging

        const { name, email, password } = req.body;
        console.log("🔹 Received Data:", { name, email, password });

        // Validate input fields
        if (!name || !email || !password) {
            console.log("🔴 Validation Failed: All fields are required");
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        // Validate password length
        if (password.length < 4) {
            console.log("🔴 Validation Failed: Password too short");
            return res.status(400).json({ message: "Password must be at least 4 characters long", success: false });
        }

        // Check if user already exists
        const user = await UserModel.findOne({ email });
        if (user) {
            console.log("🔴 User Exists: Cannot Signup");
            return res.status(409).json({ message: "User already exists, you can log in", success: false });
        }

        // Hash password before saving
        console.log("🔹 Hashing Password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔹 Password Hashed");

        // Create a new user
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();
        console.log("✅ User Created Successfully");

        res.status(201).json({ message: "Signup successful! Welcome aboard.", success: true });

    } catch (err) {
        console.error("❌ Signup error:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};



const login = async (req, res) => {
    try {
        console.log("🔹 Login API Hit");
        const { email, password } = req.body;

        console.log("🔹 Received Data:", { email, password });

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required!", success: false });
        }

        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password", success: false });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password", success: false });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful!",
            success: true,
            jwtToken: token,
            name: user.name,
            email: user.email,
            userId: user._id,
        });
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const changePassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        if (!newPassword || newPassword.trim().length < 4) {
            return res.status(400).json({ message: "New password must be at least 4 characters long", success: false });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // 🔹 Trim password before hashing
        const trimmedPassword = newPassword.trim();
        const hashedNewPassword = await bcrypt.hash(trimmedPassword, 10);
        
        console.log("🔹 Hashed New Password:", hashedNewPassword);

        // 🔹 Update the password and explicitly save the user
        user.Password = hashedNewPassword;
        await user.markModified("Password"); // Force update
        await user.save(); // Ensure it's saved in the database

        console.log("✅ Password Updated in Database:", user.Password);

        res.status(200).json({ message: "Password updated successfully", success: true });

    } catch (error) {
        console.error("❌ Error updating password:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
const logout = async (req, res) => {
    try {
        console.log("🔹 Logout request received");

        // Blacklist the token
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            blacklistedTokens.add(token);
        }

        res.status(200).json({
            success: true,
            message: "Logout successful!",
        });

    } catch (err) {
        console.error("❌ Logout error:", err);
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
};


module.exports = { signup, login, logout, changePassword };
