"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: localStorage.getItem("loggedInUser") || "",
    email: localStorage.getItem("loggedInEmail") || "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [quizResults, setQuizResults] = useState([]);
  const [quizAccessDetails, setQuizAccessDetails] = useState([]); // New State for shared quiz access

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Authentication token is missing!");
          toast.error("Please log in to view quiz results.");
          return;
        }

        const response = await fetch("http://localhost:8080/api/quiz-results", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch quiz results: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched quiz results:", JSON.stringify(data, null, 2)); // ✅ Debugging Log

        // Ensure only results for the logged-in user are shown
        const userId = localStorage.getItem("userId");
        const filteredResults = data.filter((result) => result.userId === userId);

        setQuizResults(filteredResults); // ✅ Set filtered results for the user

      } catch (error) {
        console.error("Error fetching quiz results:", error);
        toast.error("Failed to fetch quiz results. Please try again later.");
      }
    };

    const submitQuiz = async () => {
      try {
        if (!quizResults || quizResults.length === 0) {
          console.error("No quiz results found!");
          return;
        }

        const selectedQuiz = quizResults[0];
        const userId = localStorage.getItem("userId");

        console.log("Selected Quiz:", selectedQuiz);
        console.log("Retrieved userId from localStorage:", userId);

        if (!selectedQuiz || !userId) {
          console.error("Selected quiz or logged-in user is missing!", { selectedQuiz, userId });
          return;
        }

        // ✅ Fetch the actual score from the quiz result
        const userScore = selectedQuiz.score || 0;

        const response = await fetch("http://localhost:8080/api/submit-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizId: selectedQuiz._id,
            userId: userId,
            score: userScore, // ✅ Now sending the correct score
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to submit quiz: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Quiz Submission Response:", data);
      } catch (error) {
        console.error("Error submitting quiz:", error);
      }
    };



    const fetchSharedQuizzes = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Logged-in user's ID

        if (!userId) {
          console.error("No userId found in localStorage");
          return;
        }

        console.log("Fetching shared quizzes for userId:", userId);

        const response = await fetch(`http://localhost:8080/api/quiz/shared-quizzes/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("API Response Status:", response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`Failed to fetch shared quizzes: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Shared Quizzes Data:", JSON.stringify(data, null, 2));

        // Process the data to ensure assessed users have names and emails
        const processedData = data.sharedQuizzes.map((quiz) => ({
          ...quiz,
          quizTitle: quiz.quizId?.title || "Unknown Quiz", // Add quiz title
          assessedUsers: Array.isArray(quiz.assessedUsers)
            ? quiz.assessedUsers.map((user) => ({
              userId: user.userId?._id || "Unknown ID",
              name: user.userId?.name || "Unknown User",
              email: user.userId?.email || "Unknown Email",
              score: user.score || 0,
              completedAt: user.completedAt || "N/A",
            }))
            : [],
        }));

        setQuizAccessDetails(processedData);
      } catch (error) {
        console.error("Error fetching shared quizzes:", error);
        toast.error("Failed to fetch shared quizzes. Please try again later.");
      }
    };

    // ✅ Function to update assessedUsers when user accesses a quiz
    const updateAssessedUsers = async (quizId, userId) => {
      try {
        const response = await fetch("http://localhost:8080/api/quiz/update-assessed-users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            quizId,
            userId,
            score: 0,  // ✅ Ensure score is sent (adjust if necessary)
          }),
        });

        const data = await response.json();
        console.log("Updated assessedUsers response:", data);
      } catch (error) {
        console.error("Error updating assessedUsers:", error);
      }
    };



    const fetchProfilePage = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.error("No userId found in localStorage");
          toast.error("User ID not found. Please log in again.");
          return;
        }

        console.log("Fetching profile data for userId:", userId);

        const response = await fetch(`http://localhost:8080/api/user/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Profile API Response Status:", response.status, response.statusText);

        if (!response.ok) {
          if (response.status === 404) {
            toast.error("User profile not found. Please check your account.");
          } else {
            toast.error(`Failed to fetch profile: ${response.statusText}`);
          }
          return;
        }

        const data = await response.json();
        console.log("Fetched Profile Data:", JSON.stringify(data, null, 2));

        setUser({
          name: data.name || "Unknown",
          email: data.email || "Unknown",
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to fetch profile data. Please try again later.");
      }
    };


    fetchQuizResults();
    fetchSharedQuizzes();
    fetchProfilePage();
    submitQuiz();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
    }

    try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            toast.error("User ID not found. Please log in again.");
            return;
        }

        const response = await fetch("http://localhost:8080/api/auth/change-password", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId, newPassword: newPassword }),
        });

        // ✅ Log the full response before parsing
        const textResponse = await response.text();  
        console.log("🔹 Raw Response:", textResponse);

        // ✅ Check if the response is actually JSON
        let responseData;
        try {
            responseData = JSON.parse(textResponse);
        } catch (jsonError) {
            console.error("❌ The server response is not valid JSON. Full response:", textResponse);
            throw new Error("Invalid JSON response from server.");
        }

        console.log("✅ Parsed Response:", responseData);

        if (!response.ok) {
            throw new Error(`Failed to update password: ${responseData.message || response.statusText}`);
        }

        toast.success("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
    } catch (error) {
        console.error("❌ Error updating password:", error);
        toast.error("Failed to update password. Please try again.");
    }
};

  


  const profileLetter = user.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <div className="profile-container" style={{
      backgroundColor: "black"
    }}>
      <h1 className="text-center" style={{ marginTop: 50, marginBottom: 50 }}>User Profile</h1>
      <div className="profile-card p-4 shadow-sm">
        <h4>Profile Information</h4>
        <div className="mb-3">
          <label className="form-label">Full Name:</label>
          <input
            type="text"
            className="form-control"
            value={user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email" // Use type="email" for proper validation
            className="form-control"
            value={user.email} // Display the email correctly
            onChange={(e) => setUser({ ...user, email: e.target.value })} // Update email, not username
          />
        </div>
      </div>

      <div className="profile-card p-4 mt-4 shadow-sm">
        <h4>Account Settings</h4>
        <form onSubmit={handleChangePassword}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Change Password</button>
        </form>
      </div>

{/*  */}
      <div
        style={{
          width: "1190px",
          height: 3,
          backgroundColor: "#ffc300",
          marginTop: 20,
          marginBottom: 10,
        }}
      ></div>

      <h2 className="text-2xl font-bold mt-6 text-warning" style={{ marginLeft: "30px", marginTop: 50 }}>Quiz History</h2>

      <div
        className="flex overflow-x-auto gap-4"
        style={{
          marginLeft: "20px",
          padding: "10px 0",
          width: "calc(100% - 250px)",
          whiteSpace: "nowrap",
        }}
      >
        {quizResults.length === 0 ? (
          <p className="text-gray-500">No quizzes attempted yet.</p>
        ) : (
          quizResults.map((result, index) => (
            <div
              key={index}
              className="transform transition-transform hover:scale-105 flex-shrink-0"
              style={{
                border: "1px solid #ffc400",
                borderRadius: "10px",
                padding: "20px",
                width: "300px",
                backgroundColor: "#1a1a1a",
                color: "white",
                cursor: "pointer",
                position: "relative",
                margin: "10px",
                display: "inline-block",
              }}
            >
              <h3 className="font-bold text-xl mb-2">{result?.quizId?.title || "Unknown Quiz"}</h3>
              <p className="mb-2">
                <span className="font-semibold">Score:</span> {result?.score}/{result?.quizId?.questions?.length || 0}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Attempted on:</span> {result?.createdAt ? new Date(result.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          ))
        )}
      </div>

      <h2 className="text-2xl font-bold mt-6 text-warning" style={{ marginLeft: "30px", marginTop: 50 }}>
        Shared Quiz Access
      </h2>

      <div className="overflow-x-auto" style={{ marginLeft: "30px", padding: "10px 0", width: "calc(100% - 250px)" }}>
        {quizAccessDetails.length === 0 ? (
          <p className="text-gray-500">No one has accessed your shared quizzes yet.</p>
        ) : (
          <table className="table-auto border-collapse border border-gray-400 w-full text-white">
            <thead>
              <tr className="bg-gray-800 text-warning">
                <th className="border border-gray-400 px-4 py-2 text-left">Quiz Title</th>
                <th className="border border-gray-400 px-4 py-2 text-left">Assessed User Name</th>
                <th className="border border-gray-400 px-4 py-2 text-left">Assessed User Email</th>
                <th className="border border-gray-400 px-4 py-2 text-left">Score</th>
                <th className="border border-gray-400 px-4 py-2 text-left">Completed At</th>
              </tr>
            </thead>
            <tbody>
              {quizAccessDetails.map((quiz, index) =>
                quiz.assessedUsers.length === 0 ? (
                  <tr key={index}>
                    <td className="border border-gray-400 px-4 py-2">{quiz.quizId?.title || "Unknown Quiz"}</td>
                    <td className="border border-gray-400 px-4 py-2 text-gray-400" colSpan="4">No users have attempted this quiz yet.</td>
                  </tr>
                ) : (
                  quiz.assessedUsers.map((user, idx) => (
                    <tr key={`${index}-${idx}`} className="bg-gray-700">
                      <td className="border border-gray-400 px-4 py-2">{quiz.quizId?.title || "Unknown Quiz"}</td>
                      <td className="border border-gray-400 px-4 py-2">{user.name || "Unknown"}</td>
                      <td className="border border-gray-400 px-4 py-2">{user.email || "Unknown"}</td>
                      <td className="border border-gray-400 px-4 py-2">{user.score}</td>
                      <td className="border border-gray-400 px-4 py-2">
                        {user.completedAt ? new Date(user.completedAt).toLocaleString() : "N/A"}
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        )}
      </div>


    </div>
  );
}
