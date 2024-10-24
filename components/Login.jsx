import React, { useState } from "react";
import styles from "../styles/home.module.css";
import router from "next/router";
import axios from "axios";


const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const backendUrl = "https://two-school-backend.onrender.com";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = form;
    if (username === "" || password === "") {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, 
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      const token = response.data.token;
      console.log("Token received:", token);

      localStorage.setItem("token", token);
      console.log("Login successful");
      router.push("/profile");
    } catch (error) {
      console.error("Error logging in:", error);
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
            type="text"
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
      </div>
    </div>
  );
};

export default Login;
