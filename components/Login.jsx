import React, { useState } from "react";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

require("dotenv").config();

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Login = () => {
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
