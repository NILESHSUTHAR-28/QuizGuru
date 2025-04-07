"use client"

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UpperQuery from "./UpperQuery";
import { TopicsGrid } from "./TopicsGrid";
import { AssessmentGrid } from './AssessmentGrid.js';

export default function Explore() {
  const location = useLocation();
  const [activeContent, setActiveContent] = useState("forYou");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = () => {
      const confirmLeave = window.confirm("Are you sure you want to leave?");
      if (confirmLeave) {
        navigate("/");
      } else {
        // Prevent going back
        window.history.pushState(null, "", window.location.pathname);
      }
    };
    window.history.pushState(null, "", window.location.pathname);

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePlay = (topicName, subtopicName) => {
    navigate("/quizinstructions", { state: { topicName, subtopicName } });
  };

  const handleQuizPlay = (quizId) => {
    navigate("/quiz", { state: { quizId } }); // Navigate to the quiz page
  };

  const content = {
    forYou: <TopicsGrid searchQuery={searchQuery} onPlay={handlePlay} />,
    assessment: <AssessmentGrid onPlay={handleQuizPlay} />, // Use AssessmentGrid for the Assessment section
  };

  return (
    <div>
      <div
        className="Exploree"
        style={{
          backgroundColor: "black",
          minHeight: "100vh",
          width: "80.8%",
          position: "absolute",
          right: 0,
        }}
      >
        <UpperQuery />

        <div
          className="QuerySection fixed"
          style={{
            height: 266,
            borderWidth: "1.5px",
            borderStyle: "solid",
            borderColor: "#ffc400",
          }}
        >
          <h3
            style={{
              color: "white",
              fontSize: 23,
              textAlign: "center",
              marginTop: 30,
              marginBottom: 30,
            }}
          >
            Which topic will you Master today ?
          </h3>

          <div
            style={{
              border: "1px solid #dcd5f9",
              borderRadius: "50px",
              padding: "10px 20px",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              width: 450,
              height: 50,
              marginLeft: 385,
            }}
          >
            <i className="bi bi-search" style={{ color: "black", marginRight: "10px" }}></i>

            <input
              type="text"
              placeholder="Search for any topic"
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                border: "none",
                outline: "none",
                boxShadow: "none",
                flex: 1,
                color: "black",
                fontWeight: 400,
              }}
            />

            <i className="bi bi-arrow-right" style={{ color: "black", marginLeft: "10px" }}></i>
          </div>

          <div
            className="ex nav"
            style={{
              height: 40,
              backgroundColor: "black",
              borderBottom: "1.5px solid #ffc400",
              marginTop: 87,
            }}
          >
            <ul
              className="ex navbar-nav nav nav-underline flex-row"
              style={{
                margin: 0,
                padding: "10px 0",
                listStyle: "none",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <li className="ex nav-item">
                <a
                  className={`ex nav-link ${activeContent === "forYou" ? "active-bold-yellow" : ""}`}
                  style={{
                    color: "#ffc400",
                    textDecoration: "none",
                    padding: "0 15px",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveContent("forYou")}
                >
                  <i className="bi bi-heart-fill"></i> For You
                </a>
              </li>
              <li className="ex nav-item">
                <a
                  className={`nav-link ${activeContent === "assessment" ? "active-bold-yellow" : ""}`}
                  style={{
                    color: "#ffc400",
                    textDecoration: "none",
                    padding: "0 15px",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveContent("assessment")}
                >
                  <i className="bi bi-clipboard-heart-fill"></i> Assessment
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div style={{ border: "2px solid #ffc400", height: 800, fontSize: "16px" }}>
          {content[activeContent]}
        </div>
      </div>
    </div>
  );
}