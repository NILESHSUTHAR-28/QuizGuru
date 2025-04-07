"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function AssessmentGrid() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  const loggedInUserId = localStorage.getItem("userId");
  console.log("Retrieved userId from localStorage:", loggedInUserId);

  useEffect(() => {
    if (loggedInUserId) {
      fetchQuizzes();
    } else {
      console.error("No logged-in user found in localStorage.");
    }
  }, [loggedInUserId]);

  const fetchQuizzes = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No logged-in user found");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/quiz/quizzes?userId=${userId}`);
      const data = await response.json();

      console.log("Fetched Quizzes from API:", JSON.stringify(data, null, 2));

      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
      setQuizzes([]);
    }
  };

  const handleDeleteQuiz = async (quizId, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        `http://localhost:8080/api/quiz/quizzes/${quizId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setQuizzes((prevQuizzes) =>
          prevQuizzes.filter((quiz) => quiz._id !== quizId)
        );
      } else {
        console.error("Failed to delete quiz:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    }
  };
  const handleShareQuiz = async (quizId, e) => {
    e.stopPropagation();

    const loggedInUserId = localStorage.getItem("userId");
    if (!loggedInUserId) {
        alert("User not logged in.");
        return;
    }

    const requestBody = {
        quizId: quizId,
        sharedBy: loggedInUserId, // Only tracking who shared
    };

    console.log("Sending request body:", requestBody);

    try {
        const response = await fetch("http://localhost:8080/api/quiz/share", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log("Shared Quiz Response:", data);

        if (response.ok) {
            const quizLink = `${window.location.origin}/takequiz/${quizId}`;
            navigator.clipboard.writeText(quizLink);
            alert("Quiz link copied to clipboard! You can share it anywhere.");
        } else {
            alert(`Failed to share quiz: ${data.message || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error sharing quiz:", error);
        alert("Error sharing quiz.");
    }
};
  
    
  const handleEditQuiz = (quizId, e) => {
    e.stopPropagation();
    navigate(`/QuizCreation/${quizId}`);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => (
          <div
            key={quiz._id}
            style={{
              border: "1px solid #ffc400",
              borderRadius: "10px",
              padding: "20px",
              width: "300px",
              backgroundColor: "#1a1a1a",
              color: "white",
              position: "relative",
            }}
          >
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px", justifyContent: "flex-end" }}>
              <button
                onClick={(e) => handleEditQuiz(quiz._id, e)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#007bff",
                  border: "none",
                  borderRadius: "5px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>

              <button
                onClick={(e) => handleDeleteQuiz(quiz._id, e)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#dc3545",
                  border: "none",
                  borderRadius: "5px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>

              <button
                onClick={(e) => handleShareQuiz(quiz._id, e)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#28a745",
                  border: "none",
                  borderRadius: "5px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Share
              </button>
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: "white" }}>No quizzes found for this user.</p>
      )}
    </div>
  );
}
