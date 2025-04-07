"use client"

import React, { useState, useEffect, Fragment } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Helmet } from "react-helmet"
import M from "materialize-css"
import classnames from "classnames"

export default function Play() {
  const navigate = useNavigate()
  const location = useLocation()
  const { topicName, subtopicName } = location.state || {}

  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        console.log(`../Questions/${topicName}/${subtopicName.toLowerCase()}.json`);
        const response = await import(`../Questions/${topicName}/${subtopicName.toLowerCase()}.json`);
        
        // Ensure questions are properly filtered to 20
        const selectedQuestions = getRandomQuestions(response.default, 20);
        setQuestions(selectedQuestions);
      } catch (error) {
        console.error("Error loading questions:", error);
      }
    };
  
    if (topicName && subtopicName) {
      loadQuestions();
    }
  }, [topicName, subtopicName]);

  useEffect(() => {
    const handleBackButton = () => {
      const confirmLeave = window.confirm(
        "Are you sure you want to leave the Quiz Test?"
      );
      if (confirmLeave) {
        navigate("/explore");
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

  const getRandomQuestions = (allQuestions, count) => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const [state, setState] = useState({
    questions: getRandomQuestions(questions, 20),
    currentQuestion: {},
    nextQuestion: {},
    previousQuestion: {},
    answer: "",
    numberOfQuestions: 0,
    numberOfAnsweredQuestions: 0,
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    hints: 5,
    fiftyFifty: 2,
    usedFiftyFifty: false,
    nextButtonDisabled: false,
    previousButtonDisabled: true,
    previousRandomNumbers: [],
    time: {},
    showPopup: false,
    popupMessage: "",
    attemptedQuestions: [], // Track which questions have been attempted
    questionAnswers: {} // Track the answers for each question
  })

  // Handle display questions side effect
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[state.currentQuestionIndex]
      const nextQuestion = questions[state.currentQuestionIndex + 1]
      const previousQuestion = questions[state.currentQuestionIndex - 1]
      const answer = currentQuestion?.answer || ""

      setState((prevState) => ({
        ...prevState,
        questions,
        currentQuestion: currentQuestion || {},
        nextQuestion: nextQuestion || {},
        previousQuestion: previousQuestion || {},
        numberOfQuestions: questions.length,
        answer,
        previousRandomNumbers: [],
      }))

      showOptions()
      handleDisableButton()
    }
  }, [questions, state.currentQuestionIndex])

  // Timer effect
  useEffect(() => {
    const countDownTime = Date.now() + 300000
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = countDownTime - now

      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      let seconds = Math.floor((distance % (1000 * 60)) / 1000)

      minutes = String(minutes).padStart(2, "0")
      seconds = String(seconds).padStart(2, "0")

      if (distance <= 0) {
        clearInterval(interval)
        setState((prev) => ({
          ...prev,
          time: { minutes: "00", seconds: "00" },
        }))
        endGame()
      } else {
        setState((prev) => ({
          ...prev,
          time: { minutes, seconds },
        }))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const correctSound = React.createRef()
  const wrongSound = React.createRef()
  const buttonSound = React.createRef()

  const showOptions = () => {
    const options = Array.from(document.querySelectorAll(".option"))
    options.forEach((option) => {
      option.style.visibility = "visible"
    })

    setState((prev) => ({
      ...prev,
      usedFiftyFifty: false,
    }))
  }

  const handleHints = () => {
    if (state.hints > 0) {
      const options = Array.from(document.querySelectorAll(".option"))
      let indexOfAnswer

      options.forEach((option, index) => {
        if (option.innerHTML.toLowerCase() === state.answer.toLowerCase()) {
          indexOfAnswer = index
        }
      })

      while (true) {
        const randomNumber = Math.round(Math.random() * 3)
        if (randomNumber !== indexOfAnswer && !state.previousRandomNumbers.includes(randomNumber)) {
          options.forEach((option, index) => {
            if (index === randomNumber) {
              option.style.visibility = "hidden"
              setState((prev) => ({
                ...prev,
                hints: prev.hints - 1,
                previousRandomNumbers: [...prev.previousRandomNumbers, randomNumber],
              }))
            }
          })
          break
        }
        if (state.previousRandomNumbers.length >= 3) break
      }
    }
  }

  const handleFiftyFifty = () => {
    if (state.fiftyFifty > 0 && !state.usedFiftyFifty) {
      const options = document.querySelectorAll(".option")
      const randomNumbers = []
      let indexOfAnswer

      options.forEach((option, index) => {
        if (option.innerHTML.toLowerCase() === state.answer.toLowerCase()) {
          indexOfAnswer = index
        }
      })

      let count = 0
      do {
        const randomNumber = Math.round(Math.random() * 3)
        if (randomNumber !== indexOfAnswer) {
          if (
            randomNumbers.length < 2 &&
            !randomNumbers.includes(randomNumber) &&
            !randomNumbers.includes(indexOfAnswer)
          ) {
            randomNumbers.push(randomNumber)
            count++
          } else {
            while (true) {
              const newRandomNumber = Math.round(Math.random() * 3)
              if (!randomNumbers.includes(newRandomNumber) && newRandomNumber !== indexOfAnswer) {
                randomNumbers.push(newRandomNumber)
                count++
                break
              }
            }
          }
        }
      } while (count < 2)

      options.forEach((option, index) => {
        if (randomNumbers.includes(index)) {
          option.style.visibility = "hidden"
        }
      })

      setState((prev) => ({
        ...prev,
        fiftyFifty: prev.fiftyFifty - 1,
        usedFiftyFifty: true,
      }))
    }
  }

  const handleOptionClick = (e) => {
    const isLastQuestion = state.currentQuestionIndex === 19
    const selectedAnswer = e.target.innerHTML.toLowerCase()
    const isCorrect = selectedAnswer === state.answer.toLowerCase()
    const isAlreadyAttempted = state.attemptedQuestions.includes(state.currentQuestionIndex)
    const previousAnswer = state.questionAnswers[state.currentQuestionIndex]
    const previouslyCorrect = previousAnswer === state.answer.toLowerCase()

    // Play sound based on answer correctness
    setTimeout(() => {
      const audio = new Audio(isCorrect ? "Assets/correct-answer.mp3" : "Assets/wrong-sound.mp3")
      audio.play()
    }, isCorrect ? 300 : 500)

    setState((prev) => {
      let newState = { ...prev }
      
      // If this question was already attempted
      if (isAlreadyAttempted) {
        // If previous answer was correct and new answer is wrong
        if (previouslyCorrect && !isCorrect) {
          newState.correctAnswers = prev.correctAnswers - 1
          newState.wrongAnswers = prev.wrongAnswers + 1
          newState.score = prev.score - 1
        } 
        // If previous answer was wrong and new answer is correct
        else if (!previouslyCorrect && isCorrect) {
          newState.correctAnswers = prev.correctAnswers + 1
          newState.wrongAnswers = prev.wrongAnswers - 1
          newState.score = prev.score + 1
        }
        // If both answers are correct or both wrong, no change in counters
      } else {
        // First attempt at this question
        newState.numberOfAnsweredQuestions = prev.numberOfAnsweredQuestions + 1
        newState.attemptedQuestions = [...prev.attemptedQuestions, prev.currentQuestionIndex]
        
        if (isCorrect) {
          newState.correctAnswers = prev.correctAnswers + 1
          newState.score = prev.score + 1
        } else {
          newState.wrongAnswers = prev.wrongAnswers + 1
        }
      }
      
      // Update the answer for this question
      newState.questionAnswers = {
        ...prev.questionAnswers,
        [prev.currentQuestionIndex]: selectedAnswer
      }
      
      newState.showPopup = true
      newState.popupMessage = isCorrect ? "Correct Answer!" : "Wrong Answer!"
      
      // If it's NOT the last question, move to the next question
      if (!isLastQuestion) {
        newState.currentQuestionIndex = prev.currentQuestionIndex + 1
      }
      
      return newState
    })

    M.toast({
      html: isCorrect ? "Correct Answer!" : "Wrong Answer!",
      classes: isCorrect ? "toast-valid" : "toast-invalid",
      displayLength: 1500,
    })
  }

  const handleButtonClick = (e) => {
    switch (e.target.id) {
      case "next-button":
        handleNextButtonClick()
        break
      case "previous-button":
        handlePreviousButtonClick()
        break
      case "quit-button":
        handleQuitButtonClick()
        break
      case "submit-button":
        handleSubmitClick()
        break
      default:
        break
    }
  }

  const handleNextButtonClick = () => {
    playButtonSound()
    if (state.nextQuestion !== undefined && state.currentQuestionIndex < 19) {
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }))
    }
  }

  const handleSubmitClick = () => {
    if (state.numberOfAnsweredQuestions < state.numberOfQuestions) {
      M.toast({
        html: "Please attempt all questions before submitting!",
        classes: "toast-warning",
        displayLength: 2000,
      })
      return
    }

    const playerStats = {
      score: state.score,
      numberOfQuestions: state.numberOfQuestions,
      numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
      correctAnswers: state.correctAnswers,
      wrongAnswers: state.wrongAnswers,
      fiftyFiftyUsed: 2 - state.fiftyFifty,
      hintsUsed: 5 - state.hints,
      topicName: topicName,
      subtopicName: subtopicName
    }

    navigate("/quizsummary", { state: playerStats })
  }

  const handlePreviousButtonClick = () => {
    playButtonSound()
    if (state.currentQuestionIndex > 0) {
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }))
    }
  }

  const handleQuitButtonClick = () => {
    playButtonSound()
    if (window.confirm("Are you sure you want to quit?")) {
      navigate("/explore")
    }
  }

  const playButtonSound = () => {
    const audio = new Audio("Assets/button-sound.mp3")
    audio.play()
  }

  const handleDisableButton = () => {
    setState((prev) => ({
      ...prev,
      previousButtonDisabled: prev.currentQuestionIndex === 0,
      nextButtonDisabled: prev.currentQuestionIndex === 19,
    }))
  }

  const endGame = () => {
    alert("Quiz has ended!")
    const playerStats = {
      score: state.score,
      numberOfQuestions: state.numberOfQuestions,
      numberOfAnsweredQuestions: state.correctAnswers + state.wrongAnswers,
      correctAnswers: state.correctAnswers,
      wrongAnswers: state.wrongAnswers,
      fiftyFiftyUsed: 2 - state.fiftyFifty,
      hintsUsed: 5 - state.hints,
      topicName: topicName,
      subtopicName: subtopicName
    }
    navigate("/quizsummary", { state: playerStats })
  }

  return (
    <Fragment>
      <Helmet>
        <title>Quiz Page</title>
      </Helmet>
      <Fragment>
        <audio ref={correctSound} src="Assets/correct-answer.mp3"></audio>
        <audio ref={wrongSound} src="Assets/wrong-sound.mp3"></audio>
        <audio ref={buttonSound} src="Assets/button-sound.mp3" preload="auto" />
      </Fragment>
      <div className="questions">
        <div className="quest-header">
          <h2> {subtopicName} Basics Test </h2>
        </div>

        <div className="lifeline-container">
          <p>
            <span onClick={handleFiftyFifty} className="bi bi-circle-half fs-5 mdi-24px lifeline-icon">
              <span className="lifeline">
                {"\t"}
                {state.fiftyFifty}
              </span>
            </span>
          </p>
          <p>
            <span onClick={handleHints} className="bi bi-heart-pulse fs-5 mdi-24px lifeline-icon ">
              <span className="lifeline">
                {"\t"}
                {state.hints}
              </span>
            </span>
          </p>
        </div>
        <div className="timer-container">
          <p>
            <span className="left" style={{ textAlign: "left" }}>
              {Math.min(state.currentQuestionIndex + 1, state.numberOfQuestions)} of {state.numberOfQuestions}
            </span>
            <span
              className={classnames("right valid", {
                warning: state.time.distance <= 120000,
                invalid: state.time.distance < 30000,
              })}
              style={{ float: "right" }}
            >
              {state.time.minutes}:{state.time.seconds} {"\t"}
              <span className="bi bi-stopwatch fs-5 mdi-24px"></span>
            </span>
          </p>
        </div>
        <h5>{state.currentQuestion?.question || "Loading..."}</h5>
        <div className="options-container">
          <p onClick={handleOptionClick} className="option">
            {state.currentQuestion?.optionA || ""}
          </p>
          <p onClick={handleOptionClick} className="option">
            {state.currentQuestion?.optionB || ""}
          </p>
        </div>
        <div className="options-container">
          <p onClick={handleOptionClick} className="option">
            {state.currentQuestion?.optionC || ""}
          </p>
          <p onClick={handleOptionClick} className="option">
            {state.currentQuestion?.optionD || ""}
          </p>
        </div>

        <div className="button-container">
          <button
            className={classnames("", {
              disable: state.currentQuestionIndex === 0,
            })}
            id="previous-button"
            onClick={handleButtonClick}
            disabled={state.currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            className={classnames("", {
              disable: state.currentQuestionIndex === 19,
            })}
            id="next-button"
            onClick={handleButtonClick}
            disabled={state.currentQuestionIndex === 19}
          >
            Next
          </button>
          <button id="quit-button" onClick={handleButtonClick}>
            Quit
          </button>

          {state.numberOfAnsweredQuestions >= state.numberOfQuestions && (
            <button style={{ marginLeft: 625 }} onClick={handleSubmitClick} className="submit-button">
              Submit
            </button>
          )}
        </div>
      </div>
    </Fragment>
  )
}