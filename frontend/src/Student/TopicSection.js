import { SubTopicCard } from "./SubTopicCard"

export function TopicSection({ topic, onPlay }) {
  return (
    <section className="mb-5" style={{ borderBottom: "2px solid #ffc400",marginLeft:50 }}>
      <h2 className="text-white fs-2 mb-4">{topic.name}</h2>
      <div className="position-relative">
        <div className="d-flex overflow-auto pb-3 scrollbar-hide">
          {topic.subtopics.map((subtopic) => (
            <div key={subtopic.id} className="me-4">
              <SubTopicCard subtopic={subtopic} onPlay={() => onPlay(topic.name, subtopic.name)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

