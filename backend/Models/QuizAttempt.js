const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
