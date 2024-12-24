import React, { useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const backendUrl = "https://two-school-backend.onrender.com";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState({
    message: "",
    suggestion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "email") setEmailError("");
    if (name === "username") setUsernameError({ message: "", suggestion: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { username, email, password, confirmPassword } = form;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/.test(
        password
      )
    ) {
      alert(
        "Password must be at least 8 characters and include uppercase, number, and special character"
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        username,
        email,
        password: hashedPassword,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      window.location.href = "/completeProfile";
    } catch (err) {
      const errorData = err.response?.data;

      if (errorData?.field === "email") {
        setEmailError(errorData.message);
      } else if (errorData?.field === "username") {
        setUsernameError({
          message: errorData.message,
          suggestion: errorData.suggestion,
        });
      } else {
        alert(errorData?.message || "Error registering user");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${isSubmitting ? "cursor-not-allowed" : ""}`}>
      <div className={`${isSubmitting ? "pointer-events-none" : ""}`}>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              className={`w-full ${
                usernameError.message ? "border-red-500" : ""
              }`}
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            {usernameError.message && (
              <div className="text-red-500 text-sm mb-2">
                {usernameError.message}
                <div>Alternatively try: {usernameError.suggestion}</div>
              </div>
            )}
          </div>

          <div className="form-group mb-3">
            <input
              className={`w-full ${emailError ? "border-red-500" : ""}`}
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {emailError && (
              <div className="text-red-500 text-sm mb-2">{emailError}</div>
            )}
          </div>

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

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
