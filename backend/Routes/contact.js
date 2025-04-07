const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, phone, country, message } = req.body;

        if (!name || !email || !phone || !country || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        console.log("Received Contact Form Data:", req.body);

        // ✅ Create Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // Use `true` for port 465, `false` for 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        

        // ✅ Email Message Details
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL,
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCountry: ${country}\nMessage: ${message}`,
        };

        // ✅ Send Email
        await transporter.sendMail(mailOptions);
        console.log("📨 Email Sent Successfully!");
        
        return res.status(200).json({ message: "Contact form submitted successfully!" });

    } catch (error) {
        console.error("❌ Error sending email:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

module.exports = router;
