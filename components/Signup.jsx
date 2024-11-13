import React, { useState } from "react";
import axios from "axios";

require("dotenv").config();

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

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
    if (!/^[a-zA-Z0-9._%+-]+@example\.com$/.test(email)) {
      alert("Email must be in '@example.com' domain");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      alert(
        "Password must be at least 8 characters and include uppercase, number, and special character"
      );
      return;
    }
    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        username,
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      window.location.href = "/completeProfile";
    } catch (err) {
      alert(err.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div>
      <div>
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            className="form-group"
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            className="form-group"
            type="text"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="form-group"
            type="password"
            name="password"
            autoComplete="on"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            className="form-group"
            type="password"
            name="confirmPassword"
            autoComplete="on"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-btn">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
