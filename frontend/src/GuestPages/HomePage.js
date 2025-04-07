import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeadContent from "./HeadContent";

export default function HomePage() {
  const [quizLink, setQuizLink] = useState("");
  const navigate = useNavigate();

  const handleGoToQuiz = () => {
    if (quizLink.trim() !== "") {
      const path = new URL(quizLink).pathname;
      localStorage.setItem("quizLink", path); // Store for after login
      navigate("/login");
        }
  };

  return (
    <div>
      <HeadContent
        header={<h1 style={{fontSize:85}}>Welcome<br />to QuizGuru</h1>}
        subheader={<h2 style={{fontSize:30}}>Your Journey to Becoming a <br/> Quiz Master Begins Here !</h2>}
        image={<img style={{ width: 350, height: 350, marginRight: 180, marginBottom: 100 }} src={"Assets/learning2.png"} alt="image" className='anim' />}
        Btn={<Link to='/SignUp'><button type="button" className="btn btn-dark anim">Get Started</button></Link>}
      />

      {/* Paste Link Section */}
     
    
    </div>
  );
}