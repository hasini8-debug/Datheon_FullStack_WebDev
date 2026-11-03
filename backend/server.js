
require("dotenv").config();

const db = require("./db");
const cors = require("cors");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5500"
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: "10kb" }));

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to Hasini's Portfolio Backend!");
});

// API status
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        message: "Portfolio API is working!"
    });
});

// Test POST route
app.post("/api/test", (req, res) => {
    const receivedData = req.body;

    res.json({
        success: true,
        message: "Data received successfully!",
        data: receivedData
    });
});

// Contact form API
app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body || {};

    // Check input types
    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof message !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid input format."
        });
    }

    // Clean input values
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    // Check required fields
    if (!cleanName || !cleanEmail || !cleanMessage) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    // Validate name
    if (cleanName.length > 100) {
        return res.status(400).json({
            success: false,
            message: "Name must be under 100 characters."
        });
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        cleanEmail.length > 150 ||
        !emailPattern.test(cleanEmail)
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }

    // Validate message
    if (cleanMessage.length > 5000) {
        return res.status(400).json({
            success: false,
            message: "Message must be under 5000 characters."
        });
    }

    // Save validated data to MySQL
    const sql = `
        INSERT INTO contact_messages (name, email, message)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [cleanName, cleanEmail, cleanMessage],
        (error, result) => {
            if (error) {
                console.error("Database error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Could not save your message."
                });
            }

            res.status(201).json({
                success: true,
                message: "Your message has been saved successfully!",
                id: result.insertId
            });
        }
    );
});

// Database connection test
app.get("/api/db-test", (req, res) => {
    db.query(
        "SELECT DATABASE() AS database_name",
        (error, results) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }

            res.json({
                success: true,
                message: "MySQL connection is working!",
                database: results[0].database_name
            });
        }
    );
});

// Start server LAST
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
