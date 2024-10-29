import React, { useState } from "react";
import styles from "../styles/profile.module.css";
import axios from "axios";
import router from "next/router";

require("dotenv").config();

const CompleteProfile = ({}) => {
  const [formData, setForm] = useState({
    kidCount: "",
    school: "",
    bio: "",
  });

  const backendUrl = process.env.BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { kidCount, school, bio } = formData;

    if (!kidCount || !school || !bio) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token received:", token);
      await axios.post( `${backendUrl}/api/user/complete-profile`, 
        {
          kidCount,
          school,
          bio,
        },
        { headers: { "Authorization": `Bearer ${token}` } } 
      );
      
       console.log("Profile created successfully");
      router.push("/profile");
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className="page-header">
        <h1>Complete Your Profile</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="kidCount">Number of kids</label>
          <input id="kidCount" type="text" name="kidCount" value={formData.kidCount} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="school">School</label>
          <input id="school" type="text" name="school" value={formData.school} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="profilePic">Profile Picture</label>
          <input id="profilePic" type="file" name="profilePic" onChange={handleChange} />
        </div>
        <button type="submit" className={styles.completeBtn}>Save Profile</button>
      </form>
    </div>
  );
};

export default CompleteProfile;