import React, { useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const hashedPassword = await bcrypt.hash(password, 10);

      const response = await axios.post(
        `${backendUrl}/api/user/register`,
        {
          username,
          email,
          password: hashedPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

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
            className="form-group mb-3"
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            className="form-group mb-3"
            type="text"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <div className="relative mb-3">
            <input
              className="form-group pr-10"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="on"
              placeholder="Password"
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
          <div className="relative mb-3">
            <input
              className="form-group pr-10"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="on"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <button type="submit" className="login-btn">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
