import React, { useState, useEffect, useCallback } from "react"

const useTypingEffect = (text, typingSpeed = 100, deletingSpeed = 50) => {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    let timer
    if (isTyping) {
      if (displayedText !== text) {
        timer = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length + 1))
        }, typingSpeed)
      } else {
        setIsDone(true)
      }
    } else {
      if (displayedText !== "") {
        timer = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, deletingSpeed)
      } else {
        setIsTyping(true)
        setIsDone(false)
      }
    }
    return () => clearTimeout(timer)
  }, [displayedText, isTyping, text, typingSpeed, deletingSpeed])

  const startDeleting = useCallback(() => {
    setIsTyping(false)
  }, [])

  return { displayedText, isDone, startDeleting }
}

const UpperQuery = () => {
  const topics = [
    "Programming Languages",
    "Web Development",
    "Data Science and Machine Learning",
    "Databases",
    "Cybersecurity",
    "Cloud Computing",
    "Operating Systems",
    "Networking",
    "Software Development",
    "Artificial Intelligence",
    "IoT (Internet of Things)",
    "Blockchain",
    "Mobile Development",
    "Hardware and Embedded Systems",
    "Tech Innovations",
  ]

  const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const currentTopic = topics[currentTopicIndex]
  const { displayedText, isDone, startDeleting } = useTypingEffect(currentTopic, 100, 50)

  const moveToNextTopic = useCallback(() => {
    setCurrentTopicIndex((prevIndex) => (prevIndex + 1) % topics.length)
  }, [topics.length])

  useEffect(() => {
    let timer
    if (isDone) {
      timer = setTimeout(() => {
        startDeleting()
      }, 1000) // Wait for 1 second before starting to delete
    }
    return () => clearTimeout(timer)
  }, [isDone, startDeleting])

  useEffect(() => {
    if (displayedText === "" && !isDone) {
      moveToNextTopic()
    }
  }, [displayedText, isDone, moveToNextTopic])

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <div
      className="UpperQuery"
      style={{
        height: 60,
        borderWidth: "1.5px",
        borderStyle: "solid",
        borderColor: "#ffc400",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        fontWeight: "bold",
        backgroundColor: "#000",
        color: "#ffc400",
      }}
    >
      {displayedText}
      <span
        style={{
          opacity: showCursor ? 1 : 0,
          transition: "opacity 0.3s",
          marginLeft: "2px",
        }}
      >
        |
      </span>
    </div>
  )
}

export default UpperQuery

