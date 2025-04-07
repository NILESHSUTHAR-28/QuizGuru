import { useEffect } from "react"
import { Helmet } from "react-helmet"
import { Link, useLocation, useNavigate } from "react-router-dom"

const QuizSummary = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = location

  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault()
      alert("You cannot go back from the summary page. You can choose to play again or go to the home page.")
      navigate("/quizsummary")
    }

    window.history.pushState(null, "", window.location.pathname)
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [navigate])

  const calculateScore = (score, totalQuestions) => {
    if (!score || !totalQuestions) return 0
    return (score / totalQuestions) * 100
  }

  const score = calculateScore(state?.score, state?.numberOfQuestions)

  const getRemark = (userScore) => {
    if (userScore <= 30) return "You need more practice!"
    if (userScore > 30 && userScore <= 50) return "Better luck next time!"
    if (userScore <= 70 && userScore > 50) return "You can do better!"
    if (userScore >= 71 && userScore <= 84) return "You did great!"
    return "You're an absolute genius!"
  }

  const remark = getRemark(score)

  if (!state) {
    return (
      <>
        <Helmet>
          <title>Quiz App - Summary</title>
        </Helmet>
        <div className="quiz-summary">
          <section>
            <h1 className="no-stats">No Statistics Available</h1>
            <ul>
              <li>
                <Link to="/Explore">Take a Quiz</Link>
              </li>
              <li>
                <Link to="/Explore">Back to Home</Link>
              </li>
            </ul>
          </section>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Quiz App - Summary</title>
      </Helmet>
      <div className="quiz-summary">
        <div style={{ textAlign: "center" }}>
          <span className="bi bi-hand-thumbs-up success-icon"></span>
        </div>
        <h1>Quiz has ended</h1>
        <div className="container stats">
          <h4>{remark}</h4>
          <h2>Your Score: {score.toFixed(0)}&#37;</h2>

          <h3 style={{ marginLeft: 220, marginTop: 60 }}>
            <span className="stat-left">Total number of questions:</span>
            <span className="stat-right">{state.numberOfQuestions}</span>
          </h3>

          <h3 style={{ marginLeft: 220 }}>
            <span className="stat-left">Number of attempted questions:</span>
            <span className="stat-right">{state.numberOfAnsweredQuestions}</span>
          </h3>

          <h3 style={{ marginLeft: 220 }}>
            <span className="stat-left">Number of Correct Answers:</span>
            <span className="stat-right">{state.correctAnswers}</span>
          </h3>

          <h3 style={{ marginLeft: 220 }}>
            <span className="stat-left">Number of Wrong Answers:</span>
            <span className="stat-right">{state.wrongAnswers}</span>
          </h3>

          <h3 style={{ marginLeft: 220 }}>
            <span className="stat-left">Hints Used:</span>
            <span className="stat-right">{state.hintsUsed}</span>
          </h3>

          <h3 style={{ marginLeft: 220 }}>
            <span className="stat-left">50-50 Used:</span>
            <span className="stat-right">{state.fiftyFiftyUsed}</span>
          </h3>
        </div>
        <section>
          <ul>
            <li>
              <Link to="/Explore">Back to Home</Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}

export default QuizSummary

