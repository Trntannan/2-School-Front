import React, { useState } from "react";
import styles from "../styles/home.module.css";
import router from "next/router";


const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = form;
    if(password === "" || username === "") {
      alert("Please enter username and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, password
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login successful");
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        router.push("/groups");
      } else {
        alert(errorData.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed");
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
      </div>
    </div>
  );
};

export default Login;
