import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import BottomNavBar from "./BottomNavBar";
import QRCode from "./QrCode";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Profile = () => {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({});
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendUrl}/api/user/get-profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUsername(response.data.username);
          setProfile(response.data.profile);
          setTempData(response.data.profile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTempData({ ...tempData, [name]: value });
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("username", tempData.username);
      formData.append("bio", tempData.bio);

      const fileInput = document.querySelector('input[name="profilePic"]');
      if (fileInput && fileInput.files.length > 0) {
        formData.append("profilePic", fileInput.files[0]);
      }

      const response = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(response.data.profile || response.data.username);
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile</h1>
      </div>
      <main className="main-content">
        <div className={styles.profilePicContainer}>
          <div className={styles.profilePicSection}>
            <img
              src={
                profile?.profilePic
                  ? `data:image/jpeg;base64,${profile.profilePic}`
                  : "https://randomuser.me/api/portraits/men/1.jpg"
              }
              alt="Profile"
              className={styles.profilePic}
            />
            {isEditing && (
              <input type="file" name="profilePic" onChange={handleChange} />
            )}
          </div>
          <h2 className={styles.fullNameContainer}>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={tempData.username || ""}
                onChange={handleChange}
              />
            ) : (
              profile.username || "No username available"
            )}
          </h2>
          <button
            className={styles.editProfileButton}
            onClick={handleEditToggle}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className={styles.bioContainer}>
          <strong className={styles.bioHeader}>About me: </strong>
          {isEditing ? (
            <textarea
              name="bio"
              value={tempData.bio || ""}
              onChange={handleChange}
            />
          ) : (
            profile.bio || "No bio available"
          )}
        </div>

        {isEditing && (
          <button className={styles.saveButton} onClick={handleSaveClick}>
            Save
          </button>
        )}

        <div
          className={styles.qrCodeContainer}
          onClick={() => setShowQrModal(true)}
        >
          <h2>QR Code</h2>
          <QRCode userId={localStorage.getItem("userId")} />
        </div>

        {showQrModal && (
          <div className={styles.qrModal} onClick={() => setShowQrModal(false)}>
            <div className={styles.qrModalContent}>
              <QRCode userId={localStorage.getItem("userId")} />
            </div>
          </div>
        )}
      </main>

      <BottomNavBar activePage="Profile" />
    </div>
  );
};

export default Profile;
