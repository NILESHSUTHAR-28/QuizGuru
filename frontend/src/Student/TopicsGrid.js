"use client"

import { useMemo, useState } from "react"
import { topics } from "./topics"
import { TopicSection } from "./TopicSection"

export function TopicsGrid({ searchQuery = "", onPlay }) {
  const [showAllSections, setShowAllSections] = useState(false)

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics

    const query = searchQuery.toLowerCase()
    return topics
      .map((topic) => ({
        ...topic,
        subtopics: topic.subtopics.filter(
          (subtopic) => subtopic.name.toLowerCase().includes(query) || topic.name.toLowerCase().includes(query),
        ),
      }))
      .filter((topic) => topic.subtopics.length > 0)
  }, [searchQuery])

  const visibleTopics = showAllSections ? filteredTopics : filteredTopics.slice(0, 2)

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "black" }}>
      {visibleTopics.length > 0 ? (
        <>
          {visibleTopics.map((topic) => (
            <TopicSection key={topic.id} topic={topic} onPlay={onPlay} />
          ))}
          {!showAllSections && filteredTopics.length > 2 && (
            <div className="text-center mt-4 mb-5">
              <button
                className="btn btn-outline-warning btn-lg"
                onClick={() => setShowAllSections(true)}
                style={{
                  borderColor: "#ffc400",
                  color: "#ffc400",
                  backgroundColor: "transparent",
                  padding: "10px 20px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  transition: "all 0.3s",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#ffc400"
                  e.target.style.color = "black"
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent"
                  e.target.style.color = "#ffc400"
                }}
              >
                Explore More
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-white py-5">
          <h3>No topics found matching your search.</h3>
        </div>
      )}
    </div>
  )
}

