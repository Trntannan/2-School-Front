import React, { useState } from "react";
import styles from "../styles/home.module.css";
import Login from "../components/Login";
import Signup from "../components/Signup";

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
        {isSignup
          ? "Already registered? Login"
          : "Not registered yet? Sign up"}
      </button>
     
    </div>
  );
};

export default Home;
