const express = require("express");
const quizController = require("../Controllers/quizController"); // Correct path
const router = express.Router();
const SharedQuiz = require("../Models/SharedQuiz");

router.post("/submit", quizController.submitQuiz);
router.get("/quizzes", quizController.fetchAllQuizzes);
router.get("/quizzes/:id", quizController.fetchQuizById);
router.post("/share", quizController.shareQuiz);
router.get("/shared-quizzes/:userId", quizController.getSharedQuizzesByUser);
router.post("/update-assessed-users", quizController.updateAssessedUsers);

// Ensure the route is properly defined
// router.get("/shared-quizzes/:userId", quizController.fetchSharedQuizzes);
router.post("/quiz/submit", quizController.submitQuiz);

router.post("/updateAssessedUsers", async (req, res) => {
    try {
        const { quizId, userId } = req.body;

        console.log("🔍 Received Request:", { quizId, userId });

        if (!quizId || !userId) {
            return res.status(400).json({ message: "Quiz ID and User ID are required" });
        }

        const sharedQuiz = await SharedQuiz.findOne({ quizId });
        console.log("📌 Found Shared Quiz:", sharedQuiz);

        if (!sharedQuiz) {
            return res.status(404).json({ message: "Shared quiz not found" });
        }

        const alreadyAssessed = sharedQuiz.assessedUsers.some(
            (user) => user.toString() === userId
        );

        if (!alreadyAssessed) {
            sharedQuiz.assessedUsers.push(userId);
            await sharedQuiz.save();
            console.log("✅ Updated assessedUsers:", sharedQuiz.assessedUsers);
        } else {
            console.log("⚠️ User already exists in assessedUsers.");
        }

        res.status(200).json({ message: "User added to assessedUsers", assessedUsers: sharedQuiz.assessedUsers });
    } catch (error) {
        console.error("❌ Error in assessedUsers update:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

  

module.exports = router;