import { PlayCircle } from "lucide-react";

export function SubTopicCard({ subtopic, onPlay }) {
  return (
    <div 
      className="card bg-dark text-white d-flex flex-column justify-content-between"
      style={{ width: "200px", height: "250px", marginBottom: 50, marginTop: 25 }}
    >
      {/* Image Section */}
      <div 
        className="position-relative flex-grow-1 d-flex align-items-center justify-content-center"
        style={{ border: "2px solid #ffc400", padding: "10px", minHeight: "150px" }}
      >
        <img
          src={subtopic.image || "/learning2.png"}
          className="card-img-top"
          alt={subtopic.name}
          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-50 d-flex align-items-center justify-content-center opacity-0 transition-opacity">
          <PlayCircle size={48} color="#ffc107" onClick={onPlay} style={{ cursor: "pointer" }} />
        </div>
      </div>

      {/* Title Section */}
      <div 
        className="card-body text-center d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#ffc400", color: "black", minHeight: "60px", padding: "10px" }}
      >
        <h5 
          className="card-title"
          style={{ 
            fontWeight: "bolder", 
            textAlign: "center",
            fontSize: subtopic.name.length > 25 ? "14px" : "16px", // Adjust based on text length
            lineHeight: "1.2"
          }}
        >
          {subtopic.name}
        </h5>
      </div>
    </div>
  );
}
