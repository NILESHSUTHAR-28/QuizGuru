import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeadContent from './HeadContent'


export default function LinkJoin() {
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
      <HeadContent header={<h1 style={{fontSize:60, marginTop:50}}>Join Test <br/> through Link</h1>} Form={<><div class="row">
          <div data-mdb-input-init class="form-outline col mb-4">
            <input
              type="text"
              id="form4Example1"
              placeholder="paste link here "
              
            value={quizLink}
            onChange={(e) => setQuizLink(e.target.value)}
              class="form-control anim"

            />
          </div>
          
        </div>
        </>} Btn={<Link to='/SignUp'><button           onClick={handleGoToQuiz}
 type="button" class="btn btn-dark anim" style={{fontSize:25, marginTop:30}}> Join </button></Link>}/>
    </div>
  )
}