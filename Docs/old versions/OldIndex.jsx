import React, { useState } from "react";
import styles from "../styles/home.module.css";
import router from 'next/router'

const Home = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleToggle = () => {
    setIsSignup(!isSignup);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignup) {
      alert("Login successful (placeholder)");
    } else {
      const { username, email, password, confirmPassword } = form;
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (response.ok) {
          alert("Registration successful!");
          router.push(data.redirectUrl); // probably not the right way to do this
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error during signup:", error);
        alert("Sign up failed");
      }
    }
  };

  return (
    <div className={styles.landingPage}>
      <div className="page-header">
        <h1>2 School</h1>
      </div>
      <div>
        {isSignup ? (
          <div>
            <form onSubmit={handleSubmit}>
              <input
                className={styles.input}
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                className={styles.input}
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <input
                className={styles.input}
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="submit" className={styles.loginBtn}>
                Sign up
              </button>
            </form>
            <div className={styles.option}>
              <p onClick={handleToggle} className={styles.toggleText}>
                Already Registered? Login Here
              </p>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                className={styles.input}
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className={styles.loginBtn}>
                Login
              </button>
            </form>
            <div className={styles.option}>
              <p onClick={handleToggle} className={styles.toggleText}>
                Don't have an account? Sign up
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;