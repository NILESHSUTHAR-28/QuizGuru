"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

export default function QuizResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, numberOfQuestions, numberOfAnsweredQuestions, correctAnswers, wrongAnswers } = location.state;

  const pieChartData = [
    { name: "Correct Answers", value: correctAnswers },
    { name: "Wrong Answers", value: wrongAnswers },
  ];

  const COLORS = ["green", "red"];

  const handleBackToHome = () => {
    navigate("/Explore");
  };

  return (
    <div className="quiz-results-container">
  <h1 className="quiz-results-title">Quiz Results</h1>
  <div className="divider"></div>

  <div className="quiz-results-box">
    {/* Left Side - Score Details */}
    <div className="quiz-score-section">
      <h2>Score: {score} / {numberOfQuestions}</h2>
      <div className="quiz-score-details">
        <p><span className="label">Total Questions:</span> {numberOfQuestions}</p>
        <p><span className="label">Answered Questions:</span> {numberOfAnsweredQuestions}</p>
        <p><span className="label">Correct Answers:</span> {correctAnswers}</p>
        <p><span className="label">Wrong Answers:</span> {wrongAnswers}</p>
      </div>
    </div>

    {/* Right Side - Result Analysis */}
    <div className="quiz-analysis-section">
      <h2 className="quiz-analysis-title">Result Analysis</h2>
      <PieChart width={300} height={300}>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  </div>

  {/* Back to Home Button */}
  <div className="quiz-results-footer">
    <button onClick={handleBackToHome} className="back-to-home-btn">
      Back to Home
    </button>
  </div>
</div>

  );
}