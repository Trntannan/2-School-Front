import React, { useState } from "react";
import styles from "../styles/profile.module.css";
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    kidCount: "",
    school: "",
    bio: "",
    profilePic: null,
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file uploads
    const data = new FormData();
    const token = localStorage.getItem('token');
    data.append('token', token);
    data.append('fullName', formData.fullName);
    data.append('kidCount', formData.kidCount);
    data.append('school', formData.school);
    data.append('bio', formData.bio);
    if (formData.profilePic) {
      data.append('profilePic', formData.profilePic);
    }

    try {
      const response = await fetch('/api/users/completeProfile', {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        const result = await response.json();
        router.push('/userProfile'); // Redirect to user profile page
      } else {
        alert('Failed to complete profile');
      }
    } catch (error) {
      console.error('Error completing profile:', error);
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className="page-header">
        <h1>Complete Your Profile</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
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
        <div className={styles.profilePicContainer}>
          <label htmlFor="profilePic">Profile Picture</label>
          <input id="profilePic" type="file" name="profilePic" onChange={handleFileChange} />
        </div>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default CompleteProfile;