import React, { useState } from "react";
import styles from "../styles/home.module.css";
import { useRouter } from "next/router";
import axios from "axios";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const backendUrl = "https://two-school-backend.onrender.com";

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
      const response = await axios.post(
        `${backendUrl}/api/user/register`,
        {
          username,
          email,
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
      console.log("Registration successful");
      router.push("/completeProfile");
    } catch (err) {
      alert("Error registering user");
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
