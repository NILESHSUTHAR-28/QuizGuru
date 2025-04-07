const express = require("express");
const router = express.Router();
const { saveQuizResult, getQuizResults } = require("../Controllers/quizResultController");
const { protect } = require("../Middlewares/auth");

// Save quiz result
router.post("/save", protect, saveQuizResult);

// Fetch quiz results for the authenticated user
router.get("/", protect, getQuizResults);

module.exports = router;