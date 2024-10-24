"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, use } from "react";
import styles from "../styles/profile.module.css";
import BottomNavBar from "../components/BottomNavBar";
import QRCode from "../components/QrCode";
import axios from "axios";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    school: "",
    kidCount: 0,
    bio: "",
  });

  const [editField, setEditField] = useState(null);
  const [tempData, setTempData] = useState({});


  useEffect(() => {
    const fetchProfile = async () => {
      const token = window.localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/get-profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(response.data.profile);
      } catch (error) {
        console.error("Error retrieving profile data", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTempData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveClick = async (field) => {
    const token = window.localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5000/api/user/update-profile",
        { [field]: tempData[field] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile((prevProfile) => ({
        ...prevProfile,
        [field]: response.data[field],
      }));
      setEditField(null);
    } catch (error) {
      console.error(`Error updating ${field}`, error);
    }
  };

  return (
    <div className={styles.profilePage}>
      <header className="page-header">
        <h1>Profile</h1>
      </header>

      <div className={styles.profilePicContainer}>
        <img
          src={
            profile?.profilePic
              ? `data:image/jpeg;base64,${profile.profilePic}`
              : "https://randomuser.me/api/portraits/men/1.jpg"
          }
          alt="Profile"
          className={styles.profilePic}
        />
        {editField === "profilePic" ? (
          <>
            <input type="file" name="profilePic" onChange={handleChange} />
            <button onClick={() => handleSaveClick("profilePic")}>Save</button>
          </>
        ) : (
          <button onClick={() => setEditField("profilePic")}>&#9998;</button>
        )}
      </div>

      <h2 className={styles.fullName}>
        {editField === "fullName" ? (
          <>
            <input
              type="text"
              name="fullName"
              value={tempData.fullName || ""}
              onChange={handleChange}
            />
            <button onClick={() => handleSaveClick("fullName")}>Save</button>
          </>
        ) : (
          <>
            {profile.fullName}
            <button onClick={() => setEditField("fullName")}>&#9998;</button>
          </>
        )}
      </h2>

      <div className={styles.formGroup}>
        <strong>No. of Children: </strong>
        {editField === "kidCount" ? (
          <>
            <input
              type="number"
              name="kidCount"
              value={tempData.kidCount || ""}
              onChange={handleChange}
            />
            <button onClick={() => handleSaveClick("kidCount")}>Save</button>
          </>
        ) : (
          <>
            {profile.kidCount}
            <button onClick={() => setEditField("kidCount")}>&#9998;</button>
          </>
        )}
      </div>

      <div className={styles.formGroup}>
        <strong>School: </strong>
        {editField === "school" ? (
          <>
            <input
              type="text"
              name="school"
              value={tempData.school || ""}
              onChange={handleChange}
            />
            <button onClick={() => handleSaveClick("school")}>Save</button>
          </>
        ) : (
          <>
            {profile.school}
            <button onClick={() => setEditField("school")}>&#9998;</button>
          </>
        )}
      </div>

      <div className={styles.formGroup}>
        <strong>Bio: </strong>
        {editField === "bio" ? (
          <>
            <textarea
              name="bio"
              value={tempData.bio || ""}
              onChange={handleChange}
            />
            <button onClick={() => handleSaveClick("bio")}>Save</button>
          </>
        ) : (
          <>
            {profile.bio}
            <button onClick={() => setEditField("bio")}>&#9998;</button>
          </>
        )}
      </div>

      <QRCode userId={localStorage.getItem("userId")} />
      <BottomNavBar activePage="Profile" />
    </div>
  );
};

export default UserProfile;
