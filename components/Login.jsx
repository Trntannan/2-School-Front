import React, { useState } from "react";
import axios from "axios";

require("dotenv").config();

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Login = () => {
  const [error, setError] = useState(null);
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

    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      window.location.href = "/groups";
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <form className="form-container" onSubmit={handleSubmit}>
        <input
          className="form-group"
          type="text"
          name="username"
          placeholder="Username"
          autoComplete="on"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          className="form-group"
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="on"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
