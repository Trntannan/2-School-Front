import React, { useState } from "react";
import styles from "../styles/home.module.css";
import Login from "../components/Login";
import Signup from "../components/Signup";

//initialize server whn page loads
// export const getServerSideProps = async () => {
//   return { props: { server: true } };
// };

const Home = () => {
  const [isSignup, setIsSignup] = useState(false);

  const handleToggle = () => {
    setIsSignup(!isSignup);
  };

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
