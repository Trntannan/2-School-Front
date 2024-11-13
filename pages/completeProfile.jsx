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
      <div className="page-header">
        <h1>Complete Your Profile</h1>
      </div>
      <main className={styles.completeProfMain}>
        <form
          onSubmit={handleSubmit}
          className={styles.completeProfFormContainer}
        >
          <div className={styles.completeProfForm}>
            <label htmlFor="bio">
              Tell us a little bit about yourself, This will be displayed on
              your profile.
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.completeProfForm}>
            <label htmlFor="profilePic">Profile Picture:</label>
            <input
              id="profilePic"
              type="file"
              name="profilePic"
              onChange={handleChange}
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
