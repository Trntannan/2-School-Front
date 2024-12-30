import React, { useState, useEffect } from "react";
import styles from "../styles/home.module.css";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Home = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleToggle = () => {
    setIsSignup(!isSignup);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 25000);

    return () => clearTimeout(timer);
  }, []);

  if (showWelcome) {
    return (
      <div className={styles.container}>
        <div className={styles.explanationContainer}>
          <h2 className={styles.welcomeHeading}>Welcome to 2-School</h2>
          <div className={styles.explanationContent}>
            <p className={styles.welcomeParagraph}>
              2-School is your neighborhood's walking school bus solution!
              Bringing local families together to create safe, monitored walking
              groups for children heading to and from school.
            </p>
            <p className={styles.welcomeParagraph}>
              All you need to do is signup, complete your profile and from there
              you navigate to the Groups page where you will be able to create
              your own walking groups and request to join existing groups in
              your area.
            </p>
            <div className={styles.benefitsList}>
              By joining our community, you will:
              <ul>
                <li>Save time on school runs</li>
                <li>Help children build new and lasting friendships</li>
                <li>Create a safer community presence</li>
                <li>Reduce traffic around schools</li>
                <li>Free up time for parents</li>
              </ul>
            </div>
            <div className={styles.betaNotice}>
              <p>
                🚀 Currently in active development - Join us in shaping the
                future of school commutes!
              </p>
            </div>
          </div>
          <button
            className={styles.getStartedBtn}
            onClick={() => setShowWelcome(false)}
          >
            Get Started!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>2 School</h1>
        </div>

        {isSignup ? <Signup /> : <Login />}
        <button className={styles.toggleBtn} onClick={handleToggle}>
          {isSignup
            ? "Already registered? Login"
            : "Not registered yet? Sign up"}
        </button>
      </main>
    </div>
  );
};

export default Home;
