import React, { useState } from "react";
import styles from "../styles/profile.module.css";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com";

const CompleteProfile = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setForm] = useState({
    bio: "",
    profilePic: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const { bio, profilePic } = formData;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("bio", bio);
      if (profilePic) formDataToSend.append("profilePic", profilePic);

      await axios.post(
        `${backendUrl}/api/user/complete-profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      console.log("Profile created successfully");
      window.location.href = "/profile";
    } catch (error) {
      console.error("Error creating profile:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`page-container ${isProcessing ? "cursor-not-allowed" : ""}`}
    >
      <main
        className={`main-content justify-center ${
          isProcessing ? "pointer-events-none" : ""
        }`}
      >
        <form onSubmit={handleSubmit} className="form-container">
          <label className="form-label" htmlFor="bio">
            Tell us a little bit about yourself, This will be displayed in your
            profile.
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="form-group"
            required
          />
          <div className="compProfPic mt-2 ">
            <label className="form-label" htmlFor="profilePic">
              Profile Picture:
            </label>
            <input
              id="profilePic"
              type="file"
              name="profilePic"
              onChange={handleChange}
              className="form-group border-none cursor-pointer"
              accept="image/*"
            />
          </div>
          {!isProcessing ? (
            <button type="submit" className="complete-prof-btn">
              Save Profile
            </button>
          ) : (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"
              disabled
            >
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Processing...
            </button>
          )}
        </form>
      </main>
    </div>
  );
};

export default CompleteProfile;
