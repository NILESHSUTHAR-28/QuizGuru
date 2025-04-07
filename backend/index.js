require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer"); // For handling file uploads
const path = require("path");
const bcrypt = require("bcrypt"); // Hash passwords
const mongoose = require("mongoose"); // For MongoDB interactions
const quizResultRoutes = require('./Routes/quizResultRoutes');
const { errorHandler, protect } = require("./Middlewares/auth");


// Import routes
const AuthRouter = require("./Routes/AuthRouter");
const contactRoutes = require("./Routes/contact");
const quizRoutes = require("./Routes/quizRoutes");

require('./Models/db'); // ✅ Use the existing db.js file for MongoDB connection

// Import models
const UserModel = require("./Models/Users");
const QuizModel = require("./Models/Quiz");
const QuizAttempt = require("./Models/QuizAttempt");
// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Connect to MongoDB using the .env variable
mongoose.connect(process.env.MONGO_CONN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allow frontend to access backend
app.use(bodyParser.json()); // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded requests

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Create the "uploads" folder if it doesn't exist
const fs = require("fs");
const dir = "./uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes for file uploads
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Test endpoint
app.get("/ping", (req, res) => {
  res.send("PONG");
});

// Use routes
app.use("/auth", AuthRouter); // Authentication routes
app.use("/contact", contactRoutes); // Contact routes
app.use("/api/quiz", quizRoutes); // Quiz routes
app.use("/api/quiz-results", quizResultRoutes); // ✅ Ensure correct mounting

// Fetch user data
app.get("/api/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/user/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch quizzes for a specific user
app.get("/api/quiz/quizzes", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const quizzes = await QuizModel.find({ userId });
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a quiz
app.delete("/api/quiz/quizzes/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!mongoose.isValidObjectId(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const deletedQuiz = await QuizModel.findByIdAndDelete(quizId);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a quiz
app.put("/api/quiz/quizzes/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const updateData = req.body;

    if (!mongoose.isValidObjectId(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const updatedQuiz = await QuizModel.findByIdAndUpdate(quizId, updateData, { new: true });

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// ✅ Share a quiz by generating a unique link
app.post("/api/quiz/share", async (req, res) => {
  try {
    const { quizId, sharedBy } = req.body;
    if (!quizId || !sharedBy) {
      return res.status(400).json({ message: "Quiz ID and Shared By fields are required" });
    }

    const sharedQuiz = new SharedQuizModel({
      quizId,
      sharedBy,
      sharedAt: new Date(),
    });

    await sharedQuiz.save();
    res.status(201).json({ message: "Quiz shared successfully", sharedQuiz });
  } catch (error) {
    console.error("Error sharing quiz:", error); // Log full error
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/quiz/shared-quizzes/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log("Received request for shared quizzes of userId:", userId);

  try {
    const sharedQuizzes = await QuizModel.find({ sharedWith: userId });

    if (!sharedQuizzes.length) {
      return res.status(404).json({ message: "No shared quizzes found for this user." });
    }

    res.json(sharedQuizzes);
  } catch (error) {
    console.error("Error fetching shared quizzes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Update quiz access endpoint to track accesses
app.get("/api/quiz/access/:quizId", protect, async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    if (!mongoose.isValidObjectId(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Record the access
    await new QuizAccessModel({
      quizId: quiz._id,
      accessedBy: userId,
      ownerId: quiz.userId
    }).save();

    res.json(quiz);
  } catch (error) {
    console.error("Error accessing shared quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/quiz/update-assessed-users", async (req, res) => {
  const { quizId, userId, score } = req.body;

  if (!quizId || !userId) {
      return res.status(400).json({ success: false, message: "quizId and userId are required." });
  }

  try {
      const updatedQuiz = await SharedQuiz.findOneAndUpdate(
          { quizId: quizId },
          { $addToSet: { assessedUsers: { userId, score: score || 0 } } }, // ✅ Default score = 0
          { new: true }
      );

      if (!updatedQuiz) {
          return res.status(404).json({ success: false, message: "Quiz not found." });
      }

      res.json({ success: true, quiz: updatedQuiz });
  } catch (error) {
      console.error("❌ Error updating assessedUsers:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.post('/submit-quiz', async (req, res) => {
  try {
      console.log("Received request body:", req.body);  // Log incoming request data

      const { quizId, score, answers } = req.body; // Extract data from request

      console.log("Received Score:", score);  // Check received score
      console.log("Received Answers:", answers);  // Check received answers

      const updatedQuiz = await QuizModel.findByIdAndUpdate(
          quizId,
          { $set: { score, answers } }, // Ensure correct fields are updated
          { new: true }
      );

      console.log("Updated Quiz Data:", updatedQuiz); // Verify saved data

      res.json({ success: true, updatedQuiz });
  } catch (error) {
      console.error("Error updating quiz:", error);
      res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/quiz/trackAttempt", async (req, res) => {
  try {
    const { quizId, userId } = req.body;

    if (!quizId || !userId) {
      return res.status(400).json({ error: "quizId and userId are required" });
    }

    const attempt = new QuizAttempt({
      quizId,
      userId,
      timestamp: new Date(),
    });

    await attempt.save();
    res.status(201).json({ message: "Quiz attempt recorded successfully" });
  } catch (error) {
    console.error("Error tracking quiz attempt:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/auth/change-password", async (req, res) => {
  try {
    console.log("🔹 Request received for password change:", req.body); // Debug log

    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({ message: "User ID and new password are required." });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    console.log("✅ Password updated successfully for user:", userId);
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("❌ Error updating password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
