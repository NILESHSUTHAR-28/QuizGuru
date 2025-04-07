const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: String,
  image: String,
  isCorrect: Boolean,
});

const questionSchema = new mongoose.Schema({
  question: String,
  options: [optionSchema],
  media: {
    image: String,
    audio: String,
    video: String,
  },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [questionSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Added userId
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Add this field
  createdAt: { type: Date, default: Date.now }, // ✅ Optional: Track quiz creation date
});

module.exports = mongoose.model("Quiz", quizSchema);
