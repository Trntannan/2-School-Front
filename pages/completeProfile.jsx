import React, { useState } from "react";
import styles from "../styles/profile.module.css";
import axios from "axios";
import router from "next/router";


const CompleteProfile = ({}) => {
  const [formData, setForm] = useState({
    kidCount: "",
    school: "",
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { kidCount, school, bio } = formData;
    try {
      const token = localStorage.getItem("token");
      await axios.post( "https://two-school-backend.onrender.com/api/user/complete-profile", 
        { 
          kidCount, 
          school, 
          bio 
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
        <button type="submit" className={styles.completeProfBtn}>Save Profile</button>
      </form>
    </div>
  );
};

export default CompleteProfile;