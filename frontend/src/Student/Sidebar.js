import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Sidebar({ setIsAuthenticated }) {
  const userId = localStorage.getItem("userId"); // Get userId from local storage

  const [activeItem, setActiveItem] = useState("Explore");
  
  const location = useLocation();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return; // If user cancels, do nothing

    console.log("🔹 Sending logout request to backend...");

    try {
        const response = await fetch("http://localhost:8080/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        console.log("🔹 Received response:", response);

        const data = await response.json();
        console.log("🔹 Logout response JSON:", data);

        if (data.success) {
            toast.success(data.message, { position: "top-right", autoClose: 3000 });

            // Remove token & user data
            localStorage.removeItem("token");
            localStorage.removeItem("loggedInUser");

            if (setIsAuthenticated) {
                setIsAuthenticated(false);
            }

            // Redirect after a delay
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } else {
            toast.error("Logout failed! Please try again.", { position: "top-right", autoClose: 3000 });
        }
    } catch (error) {
        console.error("❌ Logout error:", error);
        toast.error("Something went wrong. Please try again.", { position: "top-right", autoClose: 3000 });
    }
};


  return (
    <div className="sidebar d-flex flex-column">
      <div className="p-3">
        <h5 className="d-flex align-items-center">
          <img
            src="Assets/Main2.png"
            alt="QuizGuru"
            height="60"
            width="180"
            className="d-inline-block align-text-top"
            style={{marginLeft:30}}
          />
        </h5>
        <div
          style={{
            width: 250,
            height: 3,
            backgroundColor: "#ffc400",
            marginTop: 20,
            marginBottom: 10,
          }}
        ></div>

        <ul className="navbar-nav nav flex-column">
          <li className="nav-item">
            <Link
              className={`nav-link hover${
                location.pathname === "/Profile" ? "active-bold" : ""
              }`}
              to="/QuizCreation"
              style={{
                backgroundColor: "black",
                border: "2px solid white",
                color: "#ffc400",
                textAlign: "center",
                borderRadius: 15,
                marginBottom: 20,
              }}
            >
              <i className="bi bi-plus-circle fs-5"></i> Create
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link ${
                location.pathname === "/Explore" ? "active-bold" : ""
              }`}
              to="/Explore"
            >
              <i className="bi bi-house"></i> Explore
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link ${
                location.pathname === "/Profile" ? "active-bold" : ""
              }`}
              to="/profile"
            >
              <i className="bi bi-grid"></i> Profile
            </Link>
          </li>

          {/* Logout Button */}
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </li>
        </ul>
      </div>
      <ToastContainer/>
    </div>
  );
}
