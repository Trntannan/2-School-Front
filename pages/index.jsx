import React, { useState } from "react";
import styles from "../styles/home.module.css";
import Login from "../components/Login";
import Signup from "../components/Signup";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

// initialize server and database as soon as the page loads
const initializeServer = async () => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/user/initialize-server`
    );
    if (!response.ok) {
      throw new Error("Failed to initialize server");
    } else {
      console.log("Server initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing server:", error);
  }
};

initializeServer();

const Home = () => {
  const [isSignup, setIsSignup] = useState(false);

  const handleToggle = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div className={styles.landingPage}>
      <div className="page-header">
        <h1>2 School</h1>
      </div>
      {isSignup ? <Signup /> : <Login />}
      <button className={styles.toggleBtn} onClick={handleToggle}>
        {isSignup ? "Already registered? Login" : "Not registered yet? Sign up"}
      </button>
    </div>
  );
};

export default Home;
