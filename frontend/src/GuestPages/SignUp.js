import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

export default function SignUp() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, password2 } = signupInfo;

    console.log("Sending signup request..."); // Debugging: Log when the function starts

    if (!name || !email || !password || !password2) {
      console.log("Validation failed: All fields are required!"); // Debugging
      return handleError("All fields are required!");
    }

    if (password !== password2) {
      console.log("Validation failed: Passwords do not match!"); // Debugging
      return handleError("Passwords do not match!");
    }

    try {
      console.log("Sending fetch request..."); // Debugging
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("Response received:", response); // Debugging

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup failed:", errorData); // Debugging
        handleError(errorData.message || "Signup failed. Please try again.");
        return;
      }

      const result = await response.json();
      console.log("Signup successful:", result); // Debugging

      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        handleError(result.message || result.error?.details[0]?.message);
      }
    } catch (error) {
      console.error("Signup error:", error); // Debugging
      handleError("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div>
      <div className="Background">
        <div className="YellowDiv">
          <form onSubmit={handleSignup}>
            <h2 style={{ marginTop: 30, marginBottom: 50, fontWeight: 800 }}>Sign Up</h2>

            <div class="row" style={{ marginLeft: 10 }}>
              <div data-mdb-input-init class="form-outline col mb-4">
                <input
                  onChange={handleChange}
                  type="text"
                  name="name"
                  placeholder="UserName"
                  value={signupInfo.name}
                  className="form-control "
                  style={{
                    fontFamily: "Orbitron",
                    marginBottom: 10,
                    color: "black",
                    width: 350,
                    height: 40,
                    marginLeft: 100,
                    marginBottom: 20,
                    borderRadius: 15
                  }}
                />
              </div>

              <div data-mdb-input-init class="form-outline col mb-4">
                <input
                  onChange={handleChange}
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={signupInfo.email}
                  className="form-control"
                  style={{
                    fontFamily: "Orbitron",
                    marginBottom: 10,
                    color: "white",
                    width: 350,
                    height: 40,
                    marginLeft: 100,
                    marginBottom: 20,
                    borderRadius: 15
                  }}
                />
              </div>
            </div>
            <div class="row" style={{ marginLeft: 10 }}>
              <div data-mdb-input-init class="form-outline col mb-4">
                <input
                  onChange={handleChange}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={signupInfo.password}
                  className="form-control"
                  style={{
                    fontFamily: "Orbitron",
                    marginBottom: 10,
                    color: "white",
                    width: 350,
                    height: 40,
                    marginLeft: 100,
                    marginBottom: 20,
                    borderRadius: 15
                  }}
                />
              </div>
              <div data-mdb-input-init class="form-outline col mb-4">
                <input
                  onChange={handleChange}
                  type="password"
                  name="password2"
                  placeholder="Confirm Password"
                  value={signupInfo.password2}
                  className="form-control"
                  style={{
                    fontFamily: "Orbitron",
                    marginBottom: 10,
                    color: "white",
                    width: 350,
                    height: 40,
                    marginLeft: 100,
                    marginBottom: 20,
                    borderRadius: 15
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              name="signup"
              class="btn btn-dark-center"
              style={{
                fontFamily: "Orbitron",
                backgroundColor: "black",
                color: "white",
                width: 150,
                height: 35,
                marginTop: 25,
                marginLeft: 220,
              }}
            >
              Sign Up
            </button>

            <div
              style={{
                width: 580,
                height: 3,
                backgroundColor: "black",
                marginTop: 20,
                marginLeft: 10,
              }}
            ></div>

            <h6 style={{ color: "black", marginTop: 40, marginLeft: 160 }}>
              {" "}
              Already Signed in ?{" "}
              <Link to="/LogIn" style={{ color: "white", fontWeight: 'bolder' }}>
                LogIn Now
              </Link>
            </h6>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}