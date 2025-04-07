import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./AuthContext"; // Import AuthProvider

import LogIn from './GuestPages/LogIn.js';
import SignUp from './GuestPages/SignUp.js';
import HomePage from './GuestPages/HomePage.js';
import NavBar from './GuestPages/NavBar.js';
import AboutUs from './GuestPages/AboutUs.js';
import ContactUS from './GuestPages/ContactUS.js';
import LinkJoin from './GuestPages/LinkJoin.js';


import Explore from './Student/Explore.js';
import Sidebar from './Student/Sidebar.js';
import Profile from './Student/Profile.js';
import QuizInstructions from './quiz/QuizInstructions.js';
import Play from './quiz/Play.js';
import QuizSummary from './quiz/QuizSummary.js';
import QuizCreation from './Teacher/QuizCreation.js';

import { AssessmentGrid } from './Student/AssessmentGrid.js';
import TakeQuiz from './Student/TakeQuiz.js';  // Import TakeQuiz
import QuizResult from "./Student/QuizResult";

function App() {
  const location = useLocation();

  console.log("Current Path:", location.pathname); // Debugging line

  // Add '/takequiz/:quizId' and '/quiz/results' to hideNavBarRoutes
  const hideNavBarRoutes = [
    '/signup',
    '/login',
    '/explore',
    '/profile',
    '/play',
    '/quizinstructions',
    '/quizsummary',
    '/quizcreation',
    '/takequiz/:quizId', // Hide navbar on TakeQuiz page
    '/quiz/results', // Hide navbar on QuizResult page
  ];

  const showSideBarRoutes = ['/explore', '/profile'];

  return (
    <div>
      {/* Toast Container for Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Conditionally render the NavBar */}
      {!hideNavBarRoutes.some(route => {
        const routePattern = new RegExp(`^${route.replace(/:\w+/g, '\\w+')}$`);
        return routePattern.test(location.pathname.toLowerCase());
      }) && <NavBar />}

      {/* Conditionally render the Sidebar */}
      {showSideBarRoutes.includes(location.pathname.toLowerCase()) && <Sidebar />}
      <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/linkjoin" element={<LinkJoin/>}/>
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUS />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/quizinstructions" element={<QuizInstructions />} />
        <Route path="/play" element={<Play />} />
        <Route path="/quizsummary" element={<QuizSummary />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/quizcreation" element={<QuizCreation />} />

        {/* New Routes for Quiz Functionality */}
        <Route path="/assessment" element={<AssessmentGrid />} />  
        <Route path="/takequiz/:quizId" element={<TakeQuiz />} />
        <Route path="/quiz/results" element={<QuizResult />} />
      </Routes>
      </AuthProvider>
      <ToastContainer />
    </div>
  );
}

// Wrap the App component with Router
export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}