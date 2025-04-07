import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendContactEmail = async (req, res) => {
  console.log("Received request:", req.body); 

  const { name, email, phone, country, message } = req.body;
  if (!name || !email || !phone || !country || !message) {
    console.log("Error: Missing fields");
    return res.status(400).json({ message: "All fields are required!" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD, // Google App Password
    },
  });

  const mailOptions = {
    from: `"${name} via Contact Form" <${process.env.EMAIL}>`,  // ✅ This is required by Gmail
    to: process.env.RECEIVER_EMAIL,
    replyTo: email,  // ✅ Ensures replies go to user's email
    subject: `New Contact Form Submission from ${name}`,
    text: `You received a new message:
    
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Country: ${country}
    Message: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    res.json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Error sending message.", error: error.message });
  }
};
