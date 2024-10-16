import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import BottomNavBar from "../components/BottomNavBar";
import QRCode from "react-qr-code";
import axios from "axios";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    school: "",
    kidCount: "",
    bio: "",
    profilePic: null,
  });

  const [editField, setEditField] = useState(null);
  const [tempData, setTempData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      console.log(`Fetching profile for userId: ${userId}`);

      // Fetch user profile
      const profileResponse = await fetch('http://localhost:5000/api/users/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      const data = await profileResponse.json();
      setProfile(data);

      // Generate QR code using quickchart.io
      const qrUrl = `https://quickchart.io/qr?text=${userId}`;
      const qrResponse = await axios.get(qrUrl, { responseType: 'blob' });
      const qrCodeUrl = URL.createObjectURL(qrResponse.data);
      setQrCode(qrCodeUrl);

    };

    fetchProfile();
  }, []);

  const handleEditClick = (field) => {
    setEditField(field);
    setTempData({ [field]: profile[field] });
  };

  const handleSaveClick = async (field) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [field]: tempData[field],
    }));
    setEditField(null);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ [field]: tempData[field] })
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error updating profile data", error);
    }
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setTempData({ ...tempData, [name]: files ? files[0] : value });
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
          alt="Profile pic"
          className={styles.profilePic}
        />
        {editField === "profilePic" ? (
          <div>
            <input type="file" name="profilePic" onChange={handleChange} />
            <button onClick={() => handleSaveClick("profilePic")}>Save</button>
          </div>
        ) : (
          <button
            className={styles.editButton}
            onClick={() => handleEditClick("profilePic")}
          >
            <span className={styles.editIcon}>&#9998;</span>
          </button>
        )}
        <h2 className={styles.fullName}>
          {editField === "fullName" ? (
            <div className={styles.formGroup}>
              <input
                type="text"
                name="fullName"
                value={tempData.fullName}
                onChange={handleChange}
              />
              <button onClick={() => handleSaveClick("fullName")}>Save</button>
            </div>
          ) : (
            <>
              {profile.fullName}
              <button
                className={styles.editButton}
                onClick={() => handleEditClick("fullName")}
              >
                <span className={styles.editIcon}>&#9998;</span>
              </button>
            </>
          )}
        </h2>
      </div>
      <div className={styles.formGroup}>
        <p>
          <strong>School:</strong>
          {editField === "school" ? (
            <div className={styles.formGroup}>
              <input
                type="text"
                name="school"
                value={tempData.school}
                onChange={handleChange}
              />
              <button onClick={() => handleSaveClick("school")}>Save</button>
            </div>
          ) : (
            <>
              {profile.school}
              <button
                className={styles.editButton}
                onClick={() => handleEditClick("school")}
              >
                <span className={styles.editIcon}>&#9998;</span>
              </button>
            </>
          )}
        </p>
      </div>
      <div className={styles.formGroup}>
        <p>
          <strong>Kid Count:</strong>
          {editField === "kidCount" ? (
            <div className={styles.formGroup}>
              <input
                type="text"
                name="kidCount"
                value={tempData.kidCount}
                onChange={handleChange}
              />
              <button onClick={() => handleSaveClick("kidCount}")}>Save</button>
            </div>
          ) : (
            <>
              {profile.kidCount}
              <button
                className={styles.editButton}
                onClick={() => handleEditClick("kidCount}")}
              >
                <span className={styles.editIcon}>&#9998;</span>
              </button>
            </>
          )}
        </p>
      </div>
      <div className={styles.formGroup}>
        <h3>Bio</h3>
        {editField === "bio" ? (
          <div className={styles.formGroup}>
            <textarea name="bio" value={tempData.bio} onChange={handleChange} />
            <button onClick={() => handleSaveClick("bio")}>Save</button>
          </div>
        ) : (
          <>
            <p>{profile.bio}</p>
            <button
              className={styles.editButton}
              onClick={() => handleEditClick("bio")}
            >
              <span className={styles.editIcon}>&#9998;</span>
            </button>
          </>
        )}
      </div>
      <div className={styles.qrCodeContainer}>
        <h2>QR Code</h2>
        {QRCode ? (
          <img src={QRCode} alt="QR Code" />
        ) : (
          <p>Loading QR Code...</p>
        )}
      </div>
      <BottomNavBar activePage="profile" />
    </div>
  );
};

export default UserProfile;
