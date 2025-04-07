"use client"

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Quiz() {
  const location = useLocation();
  const { quizId } = location.state || {};
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/quiz/quizzes/${quizId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const data = await response.json();
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <div className="space-y-4">
        {quiz.questions.map((question, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{question.question}</h3>
            <div className="mt-2 space-y-2">
              {question.options.map((option, i) => (
                <div key={i} className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option.text}
                    className="mr-2"
                  />
                  <span>{option.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}