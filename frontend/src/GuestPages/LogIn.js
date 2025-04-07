import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import "react-toastify/dist/ReactToastify.css";

export default function LogIn({ setIsAuthenticated }) {
    const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
    
        if (!email || !password) {
            handleError("Email and password are required!");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
    
            const result = await response.json();
            console.log("🔹 Login Response:", result);
    
            if (result.success) {
                localStorage.setItem("token", result.jwtToken);
                localStorage.setItem("loggedInUser", result.name);
                localStorage.setItem("loggedInEmail", result.email);
                localStorage.setItem("userId", result.userId);
    
                console.log("✅ Stored User ID:", result.userId);
                setLoginInfo({ email: "", password: "" });
                handleSuccess("Login successful!");
    
                setTimeout(async () => {
                    const quizLink = localStorage.getItem("quizLink");
                    const userId = localStorage.getItem("userId");
    
                    console.log("🔹 Checking quizLink & userId:", { quizLink, userId });
    
                    if (quizLink && userId) {
                        try {
                            const updateResponse = await fetch("http://localhost:8080/api/quiz/updateAssessedUsers", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Secure API call
                                },
                                body: JSON.stringify({ quizId: quizLink, userId }),
                            });
    
                            const updateResult = await updateResponse.json();
                            console.log("✅ API Response:", updateResult);
    
                            if (updateResult.success) {
                                console.log("🎉 Assessed Users Updated Successfully");
                            } else {
                                console.error("❌ API Error:", updateResult.message);
                            }
                        } catch (error) {
                            console.error("❌ API Fetch Error:", error);
                        }
                    } else {
                        console.warn("⚠ quizLink or userId missing, skipping API call.");
                    }
    
                    localStorage.removeItem("quizLink");
                    navigate(quizLink || "/Explore");
                }, 2000);
            } else {
                handleError(result.message);
            }
        } catch (error) {
            console.error("❌ Login Error:", error);
            handleError("An error occurred during login.");
        }
    };
    

    return (
        <div>
            <div className="Background">
                <div className="YellowDivL">
                    <form onSubmit={handleLogin}>
                        <h2 style={{ marginTop: 35, fontWeight: 800 }}>Log In</h2>

                        <input
                            type="email"
                            name="email"
                            value={loginInfo.email}
                            onChange={handleChange}
                            className="form-control"
                            style={{
                                fontFamily: "Orbitron",
                                marginLeft: 65,
                                marginTop: 50,
                                color: "white",
                                width: 320,
                                height: 40,
                            }}
                            placeholder="Email"
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            value={loginInfo.password}
                            onChange={handleChange}
                            className="form-control"
                            style={{
                                fontFamily: "Orbitron",
                                marginLeft: 65,
                                marginTop: 50,
                                color: "white",
                                width: 320,
                                height: 40,
                            }}
                            placeholder="Password"
                            required
                        />
                        <br />

                        <button
                            type="submit"
                            style={{
                                fontFamily: "Orbitron",
                                backgroundColor: "black",
                                color: "white",
                                width: 150,
                                height: 40,
                                marginTop: 30,
                                marginLeft: 150,
                                border: "none",
                                outline: "none",
                            }}
                        >
                            Log In
                        </button>
                    </form>

                    <div
                        style={{
                            width: 430,
                            height: 3,
                            backgroundColor: "black",
                            marginTop: 30,
                            marginLeft: 10,
                        }}
                    ></div>

                    <h3 style={{ fontSize: 18, marginTop: 40, marginLeft: 110, fontWeight: 500 }}>
                        Haven't Signed up Yet?{" "}
                    </h3>

                    <Link to="/SignUp">
                        <h4 style={{ marginLeft: 160, color: "white", fontSize: 18 }}>Sign Up Now</h4>
                    </Link>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
