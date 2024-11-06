import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import BottomNavBar from "./BottomNavBar";
import QRCode from "./QrCode";
import axios from "axios";

require("dotenv").config();

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Profile = () => {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState({});
  const [editField, setEditField] = useState(null);
  const [tempData, setTempData] = useState({});
  const [isClient, setIsClient] = useState(false);
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
        }

        console.log("Fetched profile:", response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = (field) => {
    setEditField(field);
    setTempData({ [field]: profile[field] }); // Initialize tempData with the current field value
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTempData({ ...tempData, [name]: value });
  };

  const handleSaveClick = async (field) => {
    const token = localStorage.getItem("token");

    try {
      let formData = new FormData();

      if (field === "profilePic") {
        const fileInput = document.querySelector('input[name="profilePic"]');
        if (fileInput.files.length > 0) {
          formData.append("profilePic", fileInput.files[0]);
        }
      } else if (field === "username") {
        formData.append("username", tempData.username); // Add username to formData
      } else {
        formData.append(field, tempData[field]);
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

      setProfile((prevProfile) => ({
        ...prevProfile,
        [field]: response.data.profile[field] || response.data.username,
      }));
      setEditField(null);
      window.location.reload();
    } catch (error) {
      console.error(`Error updating ${field}`, error);
    }
  };

  if (!isClient) return null;

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
            {editField === "profilePic" ? (
              <>
                <input type="file" name="profilePic" onChange={handleChange} />
                <button onClick={() => handleSaveClick("profilePic")}>
                  Save
                </button>
              </>
            ) : (
              <button
                className={styles.editButton}
                onClick={() => handleEditClick("profilePic")}
              >
                &#9998;
              </button>
            )}
          </div>
          <h2 className={styles.fullNameContainer}>
            {editField === "username" ? (
              <>
                <input
                  type="text"
                  name="username"
                  value={tempData.username || ""}
                  onChange={handleChange}
                />
                <button onClick={() => handleSaveClick("username")}>
                  Save
                </button>
              </>
            ) : (
              <>
                {profile.username || "No username available"}
                <button
                  className={styles.editButton}
                  onClick={() => handleEditClick("username")}
                >
                  &#9998;
                </button>
              </>
            )}
          </h2>
        </div>

        <div className={styles.bioContainer}>
          <strong className={styles.bioHeader}>About me: </strong>
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
              <button
                className={styles.editButton}
                onClick={() => handleEditClick("bio")}
              >
                &#9998;
              </button>
            </>
          )}
        </div>

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
