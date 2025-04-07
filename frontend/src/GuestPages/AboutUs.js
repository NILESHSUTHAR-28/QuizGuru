import React from 'react'
import HeadContent from './HeadContent'

export default function AboutUs() {
  return (
    <div>
      <HeadContent header={<h1 style={{ fontSize:70, marginTop:-70}}>About QuizGURU</h1>}
      Paragraph={<p style={{textAlign:'justify'}}>🚀 QuizGuru is your go-to platform to play 🎯, create ✍, and share 🔗 quizzes with ease! Whether you're testing your knowledge, challenging friends, or crafting engaging quizzes for others, QuizGuru makes learning fun and interactive.<br/><br/>
  We’re building a community of quiz lovers where knowledge meets competition. With a variety of topics and seamless sharing, QuizGuru is the perfect place to learn, compete, and grow. Ready to take on the challenge? Join us and become a Quiz Guru! 🏆</p>}
      image={<img src={"Assets/enhancement.png"} alt="image" style={{height:450,width:450,marginRight:150,marginBottom:100}} className='anim'/>}/>
    </div>
  )
}