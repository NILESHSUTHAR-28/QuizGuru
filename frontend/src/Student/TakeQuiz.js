import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/quiz/quizzes/${quizId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch quiz: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setQuiz(data);

        // **Track Quiz Attempt when quiz is successfully fetched**
        trackQuizAttempt(quizId);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError(error.message);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const trackQuizAttempt = async (quizId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await fetch("http://localhost:8080/api/quiz/trackAttempt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ quizId, userId }),
      });

    } catch (error) {
      console.error("Error tracking quiz attempt:", error);
    }
  };

  const updateAssessedUsers = async (quizId, score) => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await fetch("http://localhost:8080/api/quiz/update-assessed-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ quizId, userId, score })
      });

      const data = await response.json();
      console.log("Updated assessed users:", data);
    } catch (error) {
      console.error("Error updating assessed users:", error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    let correctAnswers = 0;
    let wrongAnswers = 0;

    quiz.questions.forEach((question, index) => {
      const userAnswerIndex = userAnswers[index];
      if (userAnswerIndex !== undefined) {
        if (question.options[userAnswerIndex]?.isCorrect) {
          correctAnswers++;
        } else {
          wrongAnswers++;
        }
      }
    });

    console.log("Final Score:", correctAnswers);

    if (!quizId || quizId.trim() === "") {
      console.error("Quiz ID is missing or invalid!");
      toast.error("Quiz ID is missing or invalid!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found! User is not authenticated.");
        toast.error("You need to log in first!");
        navigate("/LogIn"); // Redirect to login page
        return;
      }

      // Ensure score is explicitly set to 0 if there are no correct answers
      const score = correctAnswers;

      const requestBody = {
        quizId: quizId,
        userId: localStorage.getItem("userId"),
        score: score, // Send 0 if all answers are wrong
      };

      console.log("Sending quiz result:", requestBody);

      const response = await fetch("http://localhost:8080/api/quiz-results/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      if (!response.ok) {
        throw new Error(`Failed to save quiz result: ${response.status} ${response.statusText}`);
      }

      navigate("/quiz/results", {
        state: {
          score: correctAnswers,
          numberOfQuestions: quiz.questions.length,
          correctAnswers,
          wrongAnswers,
        },
      });
    } catch (error) {
      console.error("Error saving quiz result:", error);
      toast.error("Failed to save quiz result. Please try again later.");
    }
  };



  const handleQuit = () => {
    const confirmQuit = window.confirm("Are you sure you want to quit the quiz? Your progress will be lost.");
    if (confirmQuit) {
      navigate("/Explore");
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!quiz) {
    return <div className="flex justify-center items-center min-h-screen text-xl">Loading...</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 m-5 mt-5 p-4" style={{ marginTop: "200px", border: "5px solid white" }}>
      <div className="w-full max-w-2xl bg-black text-light p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-10 text-center text-decoration-underline text-warning">{quiz.title}</h1>

        <div style={{ width: "100%", height: "4px", backgroundColor: "#ccc", margin: "20px 0" }}></div>

        <div className="space-y-6">
  <h3 className="text-xl font-semibold mt-4">
    Question {currentQuestionIndex + 1}: {currentQuestion.question}
  </h3>

  {/* Display Image, Video, and Audio */}
  {currentQuestion.media?.image && (
    <img src={currentQuestion.media.image} alt="Quiz Image" className="quiz-media" />
  )}

  {currentQuestion.media?.video && (
    <video controls className="quiz-media">
      <source src={currentQuestion.media.video} type="video/mp4" />
    </video>
  )}

  {currentQuestion.media?.audio && (
    <audio controls className="quiz-media">
      <source src={currentQuestion.media.audio} type="audio/mp3" />
    </audio>
  )}

  {/* Display options in two columns with border */}
  <div className="quiz-options">
    {currentQuestion.options.map((option, i) => (
      <div
        key={i}
        className={`quiz-option ${userAnswers[currentQuestionIndex] === i ? "selected" : ""}`}
        onClick={() => handleAnswerSelect(i)}
      >
        <input type="radio" checked={userAnswers[currentQuestionIndex] === i} readOnly className="radio-button" />
        <span className="option-label">{String.fromCharCode(65 + i)}.</span>
        <span>{option.text}</span>
      </div>
    ))}
  </div>
</div>

        <div className="flex justify-center mt-6 space-x-4 text-center mb-4 mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="custom-button"
          >
            Previous
          </button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button onClick={handleSubmit} className="custom-button">Submit</button>
          ) : (
            <button onClick={handleNext} className="custom-button">Next</button>
          )}

          <button onClick={handleQuit} className="custom-button">Quit Quiz</button>
        </div>

      </div>
      <ToastContainer />
    </div>
  );
}
