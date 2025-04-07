"use client"

import { useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

export default function QuizInstructions() {
  const navigate = useNavigate()
  const location = useLocation()
  const { topicName, subtopicName } = location.state || {}

  // Prevent closing the tab or refreshing the page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  // Handle Back Button Press
  useEffect(() => {
    const handleBackButton = () => {
      const confirmLeave = window.confirm("Are you sure you want to leave the Quiz Test?")
      if (confirmLeave) {
        navigate("/Explore")
      } else {
        // Prevent going back
        window.history.pushState(null, "", window.location.pathname)
      }
    }

    // Push a new state to manipulate back button behavior
    window.history.pushState(null, "", window.location.pathname)

    // Listen for back button clicks
    window.addEventListener("popstate", handleBackButton)

    return () => {
      window.removeEventListener("popstate", handleBackButton)
    }
  }, [navigate])

  return (
    <div className="instructions-modal">
      <div className="instructions-content">
        <div className="instructions-header">
          <h1>How to Play the Game</h1>
          <button className="close-button">&times;</button>
        </div>
        <div className="instructions-body">
          <p>Ensure you read this guide from start to finish.</p>
          <ul className="main-list">
            <li>The game has a duration of 15 minutes and ends as soon as your time elapses.</li>
            <li>Each game consists of 15 questions.</li>
            <li>
              Every question contains 4 options.
              <img src="Assets/options.png" className="img-instructions" alt="Quiz App options example" />
            </li>
            <li>
              Select the option which best answers the question by clicking (or selecting) it.
              <img src="Assets/options2.png" className="img-instructions" alt="Quiz App answer example" />
            </li>
            <li>
              Each game has 2 lifelines namely:
              <ul className="sub-list" style={{ color: "#ffc400" }}>
                <li>
                  {" "}
                  2 <i className="bi bi-arrow-right fs-5"> </i> 50-50 chances
                </li>
                <li>
                  5 <i className="bi bi-arrow-right fs-5"> </i> Hints
                </li>
              </ul>
            </li>
            <li>
              Selecting a 50-50 lifeline by clicking the icon
              <span className="lifeline-icon">◐</span>
              will remove 2 wrong answers, leaving the correct answer and one wrong answer.
            </li>
            <li>
              Using a hint by clicking the icon
              <span className="lifeline-icon">♥</span>
              will remove one wrong answer leaving two wrong answers and one correct answer.
            </li>
            <li>
              Feel free to quit (or retire from) the game at any time. In that case, your score will be revealed
              afterward.
            </li>
            <li>The timer starts as soon as the game loads.</li>
            <li style={{ fontWeight: "1000", color: "#ffc400" }}>
              Make Sure to Click the Submit Button which will be visible only when you have attempted all the questions
              sucessfully.{" "}
            </li>
            <li>Let's do this if you think you've got what it takes?</li>
          </ul>
        </div>
        <div className="instructions-footer">
          <Link to="/Explore" className="btn btn-secondary">
            No, take me back
          </Link>
          <Link to="/play" state={{ topicName, subtopicName }} className="btn btn-primary">
            Okay, Let's do this!
          </Link>
        </div>
      </div>
    </div>
  )
}

