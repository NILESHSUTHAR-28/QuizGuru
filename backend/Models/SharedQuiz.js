const mongoose = require("mongoose");

const sharedQuizSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assessedUsers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: { type: Number },
      completedAt: { type: Date, default: Date.now }
    }
  ],
  sharedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SharedQuiz", sharedQuizSchema);