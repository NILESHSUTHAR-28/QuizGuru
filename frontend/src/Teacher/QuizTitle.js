"use client"

export function QuizTitle({ title, setTitle }) {
  return (
    <div className="titlehover mb-4" style={{border:'2px solid #ffc400', width:805, marginLeft:250}}>
      <input
        type="text"
        className="form-control form-control-lg bg-dark text-center"
        placeholder="Enter quiz title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          fontSize: "1.5rem",
          padding: "1rem",// Dark background color
          color: "white", // White text color
        }}
      />
    </div>
  );
}