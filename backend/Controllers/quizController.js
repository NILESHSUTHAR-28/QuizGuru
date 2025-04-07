const Quiz = require("../Models/Quiz");
const SharedQuiz = require("../Models/SharedQuiz");
const QuizAttempt = require("../Models/QuizAttempt");

// ✅ Create a new quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { title, questions, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newQuiz = new Quiz({ title, questions, userId });
    await newQuiz.save();

    res.status(201).json({ message: "Quiz saved successfully!", quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ message: "Error saving quiz", error: error.message });
  }
};

exports.getSharedQuizzesByUser = async (req, res) => {
  try {
      const { userId } = req.params;

      if (!userId) {
          return res.status(400).json({ message: "User ID is required." });
      }

      // Find all quizzes shared by this user and populate assessed users
      const sharedQuizzes = await SharedQuiz.find({ sharedBy: userId }).populate("assessedUsers", "email");

      res.status(200).json({ sharedQuizzes });
  } catch (error) {
      res.status(500).json({ message: "Error fetching shared quizzes", error: error.message });
  }
};


// ✅ Fetch all quizzes (filter by userId if provided)
exports.fetchAllQuizzes = async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {};
    if (userId) {
      query.userId = userId;
    }

    const quizzes = await Quiz.find(query);
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error: error.message });
  }
};

// ✅ Fetch a single quiz by ID
exports.fetchQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error: error.message });
  }
};

// ✅ Fetch shared quizzes for a user (Fixed)
exports.fetchSharedQuizzes = async (req, res) => {
  try {
    const { userId } = req.params;

    const sharedQuizzes = await SharedQuiz.find({ sharedWith: userId })
      .populate("quizId", "title questions")
      .populate("sharedBy", "name email")
      .populate("sharedWith", "name email");

    res.status(200).json(sharedQuizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shared quizzes", error: error.message });
  }
};


exports.shareQuiz = async (req, res) => {
    try {
        const { quizId, sharedBy } = req.body;

        if (!quizId || !sharedBy) {
            return res.status(400).json({ message: "Missing or invalid data provided." });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Check if quiz is already shared by this user
        let sharedQuiz = await SharedQuiz.findOne({ quizId, sharedBy });

        if (!sharedQuiz) {
            // Create new shared quiz entry
            sharedQuiz = new SharedQuiz({
                quizId,
                sharedBy,
                sharedWith: [],
                assessedUsers: [],
            });
            await sharedQuiz.save();
        }

        res.status(200).json({
          message: "Quiz shared successfully!",
          // Include sharedBy in the quiz link
          quizLink: `${process.env.CLIENT_URL}/takequiz/${quizId}/${sharedBy}`,
        });
      } catch (error) {
        res.status(500).json({ message: "Error sharing quiz", error: error.message });
      }
    
};


// ✅ Submit an assessed quiz (Fixed)

exports.submitQuizAssessment = async (req, res) => {
  try {
    const { quizId, sharedBy, userId, score } = req.body;

    if (!quizId || !sharedBy || !userId) {
      return res.status(400).json({ message: "Quiz ID, Shared By, and User ID are required" });
    }

    const sharedQuiz = await SharedQuiz.findOne({
      quizId: mongoose.Types.ObjectId(quizId),
      sharedBy: mongoose.Types.ObjectId(sharedBy),
    });

    if (!sharedQuiz) {
      return res.status(404).json({ message: "Shared quiz not found" });
    }

    // Ensure `userId` is treated as an ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId);

    // Check if this user already exists in `assessedUsers`
    const existingUserIndex = sharedQuiz.assessedUsers.findIndex(
      (entry) => entry.userId.toString() === userId
    );

    if (existingUserIndex !== -1) {
      // Update existing user's score
      sharedQuiz.assessedUsers[existingUserIndex].score = score;
      sharedQuiz.assessedUsers[existingUserIndex].completedAt = new Date();
    } else {
      // Add new user
      sharedQuiz.assessedUsers.push({
        userId: userObjectId,
        score,
        completedAt: new Date(),
      });
    }

    await sharedQuiz.save();

    res.status(200).json({ message: "Quiz assessment submitted successfully!", assessedUsers: sharedQuiz.assessedUsers });
  } catch (error) {
    console.error("❌ Error submitting quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.trackQuizAttempt = async (req, res) => {
  try {
    const { quizId, userId } = req.body;

    console.log("📌 Received request:", { quizId, userId });

    if (!quizId || !userId) {
      console.error("❌ Missing quizId or userId");
      return res.status(400).json({ message: "Missing quizId or userId" });
    }

    const sharedQuiz = await SharedQuiz.findOne({ quizId });
    
    if (!sharedQuiz) {
      console.error("❌ Shared quiz not found for quizId:", quizId);
      return res.status(404).json({ message: "Shared quiz not found" });
    }

    console.log("✅ Found shared quiz:", sharedQuiz);

    if (!sharedQuiz.assessedUsers) {
      console.error("❌ assessedUsers array is missing in the database!");
      return res.status(500).json({ message: "assessedUsers array is missing in the database!" });
    }

    const userExists = sharedQuiz.assessedUsers.some(user => user.userId.toString() === userId);
    console.log("🔍 User exists in assessedUsers:", userExists);

    if (!userExists) {
      sharedQuiz.assessedUsers.push({ userId });
      await sharedQuiz.save();
      console.log("✅ User added to assessedUsers:", sharedQuiz.assessedUsers);
    } else {
      console.log("ℹ️ User already in assessedUsers.");
    }

    res.status(200).json({ message: "Quiz attempt recorded successfully!" });

  } catch (error) {
    console.error("❌ Error tracking quiz attempt:", error);
    res.status(500).json({ message: "Error tracking quiz attempt", error: error.message });
  }
};


exports.fetchSharedQuizzes = async (req, res) => {
  try {
    const { userId } = req.params;

    const sharedQuizzes = await SharedQuiz.find({ sharedWith: userId })
      .populate("quizId", "title questions")
      .populate("sharedBy", "name email")
      .populate("assessedUsers.userId", "name email"); // ✅ Ensure correct population

    res.status(200).json(sharedQuizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shared quizzes", error: error.message });
  }
};

exports.updateAssessedUsers = async (req, res) => {
  try {
    const { quizId, userId, score } = req.body;

    if (!quizId || !userId || score === undefined) {
      return res.status(400).json({ message: "quizId, userId, and score are required" });
    }

    let sharedQuiz = await SharedQuiz.findOne({ quizId });

    if (!sharedQuiz) {
      return res.status(404).json({ message: "Shared quiz not found" });
    }

    // Check if the user is already assessed
    const existingEntry = sharedQuiz.assessedUsers.find(user => user.userId.toString() === userId);

    if (existingEntry) {
      existingEntry.score = score; // Update score if already exists
      existingEntry.completedAt = new Date();
    } else {
      // Add new assessed user with score
      sharedQuiz.assessedUsers.push({ userId, score, completedAt: new Date() });
    }

    await sharedQuiz.save();

    res.status(200).json({ message: "Assessed user updated successfully", sharedQuiz });
  } catch (error) {
    console.error("Error updating assessed users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
