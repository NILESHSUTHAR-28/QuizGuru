import React, { createContext, useState, useContext, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Simulate user login (replace with actual login logic)
  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user data in localStorage
  };

  // Simulate user logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user"); // Remove user data from localStorage
  };

  // Check if a user is already logged in (e.g., on page refresh)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};