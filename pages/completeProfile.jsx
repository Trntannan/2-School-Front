import React, { useState } from "react";
import styles from "../styles/profile.module.css";
import axios from "axios";

require("dotenv").config();

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const CompleteProfile = () => {
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
    const { bio, profilePic } = formData;

    const token = localStorage.getItem("token");
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
    }
  };

  return (
    <div className="page-container">
      <main className="main-content justify-center">
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
              className="form-group border-none cursor-pointer "
              accept="image/*"
            />
          </div>
          <button type="submit" className="complete-prof-btn">
            Save Profile
          </button>
        </form>
      </main>
    </div>
  );
};

export default CompleteProfile;
