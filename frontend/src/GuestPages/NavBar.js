import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation(); // Get the current location

  return (
    <nav
      className="navbar fixed-top navbar-expand-lg "
      style={{ backgroundColor: "black", color:"#ffc400"}}
    >
      <div className="container-fluid">
        <a className="navbar-brand ms-5" href="#">
          <img
            src="Assets/Main2.png"
            alt="QuizGuru"
            height="60"
            width="180"
            className="d-inline-block align-text-top"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav nav nav-underline">
            <li className="nav-item ms-5 me-4">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active-bold" : ""
                }`}
                to="/"
                style={{color:"#ffc400"}}
              >
                DashBoard
              </Link>
            </li>
            <li className="nav-item me-4">
              <Link
                className={`nav-link ${
                  location.pathname === "/AboutUs" ? "active-bold" : ""
                }`}
                to="/AboutUs"
                style={{color:"#ffc400"}}
              >
                About Us
              </Link>
            </li>
            <li className="nav-item me-4">
              <Link
                className={`nav-link ${
                  location.pathname === "/ContactUS" ? "active-bold" : ""
                }`}
                to="/ContactUS"
                style={{color:"#ffc400"}}
              >
                Contact Us
              </Link>
            </li>
            

            <li className="nav-item me-4">
            <Link
                className={`nav-link ${
                  location.pathname === "/Explore" ? "active-bold" : ""
                }`}
                to="/LinkJoin"
                style={{color:"#ffc400"}}
              >
                Link Join
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <Link to="/SignUp">
            <button type="button"  style={{fontWeight:"bolder"}} className="btn btn-warning me-4">
              Sign in
            </button>
          </Link>
          <Link to="/LogIn">
            <button type="button" style={{fontWeight:"bolder"}} className="btn btn-warning me-4">
              Log in
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
