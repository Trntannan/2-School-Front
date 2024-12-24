import React, { useState } from "react";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import bcrypt from "bcryptjs";

require("dotenv").config();

const backendUrl = "https://two-school-backend.onrender.com";

const Login = () => {
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const { username, password } = form;

    if (!username || !password) {
      alert("Please fill in all fields");
      setIsSubmitting(false);
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
      console.error("Login error:", error.response?.data || error);
      setError(error.response?.data?.message || "Server error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${isSubmitting ? "cursor-not-allowed" : ""}`}>
      <form
        className={`form-container ${
          isSubmitting ? "pointer-events-none" : ""
        }`}
        onSubmit={handleSubmit}
      >
        <input
          className="form-group mb-3"
          type="text"
          name="username"
          placeholder="Username"
          autoComplete="on"
          value={form.username}
          onChange={handleChange}
          required
        />
        <div className="relative mb-3">
          <input
            className="form-group pr-10"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            autoComplete="on"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {error && <div className="text-red-500 mb-3">{error}</div>}
        <button type="submit" className="login-btn" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
