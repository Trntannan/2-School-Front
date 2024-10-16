import React, { useState } from "react";
import styles from "../styles/home.module.css";
import router from "next/router";
import axios from "axios";
import bycrypt from "bcryptjs";

//use bcryptjs to hash the password


const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = form;
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("/api/register", {
        username,
        email,
        password,
      });
      alert(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      router.push("/completeProfile");
    } catch (error) {
      alert(error.response.data.message || "Error signing up");
    }
  };

  return (
    <div>
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
      </div>
    </div>
  );
};

export default Signup;
