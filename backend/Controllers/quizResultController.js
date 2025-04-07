const QuizResult = require("../Models/QuizResultModel");

// Save quiz result
const saveQuizResult = async (req, res) => {
  try {
    const { quizId, score } = req.body;

    // Ensure `score: 0` is NOT rejected
    if (!quizId || score === undefined || score === null) {
      return res.status(400).json({ message: "quizId and score are required" });
    }

    const newResult = new QuizResult({
      userId: req.user._id,
      quizId: quizId,
      score: score, // `0` will be accepted
    });

    await newResult.save();
    res.status(201).json(newResult);
  } catch (error) {
    console.error("Error saving quiz result:", error);
    res.status(500).json({ message: "Failed to save quiz result" });
  }
};


// Fetch quiz results for the authenticated user
const getQuizResults = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch quiz results and populate the quizId field to get quiz details
    const results = await QuizResult.find({ userId })
      .populate("quizId", "title questions") // Populate quiz details
      .sort({ createdAt: -1 }); // Sort by most recent

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ message: "Failed to fetch quiz results" });
  }
};

module.exports = { saveQuizResult, getQuizResults };