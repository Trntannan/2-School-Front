import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import BottomNavBar from "./BottomNavBar";
import QRCode from "./QrCode";
import axios from "axios";

require("dotenv").config();

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [editField, setEditField] = useState(null);
  const [tempData, setTempData] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/api/user/get-profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched profile:", response.data);

        setProfile({
          ...response.data.profile,
          username: response.data.username,
        });
        setTempData(response.data.profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setIsClient(false);
      }
    };

    fetchProfile();
    setIsClient(true);
  }, []);

  const handleChange = async (event) => {
    const { name, value } = event.target;
    setTempData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveClick = async (field) => {
    const token = localStorage.getItem("token");

    try {
      let formData = new FormData();

      if (field === "profilePic") {
        const fileInput = document.querySelector('input[name="profilePic"]');
        if (fileInput.files.length > 0) {
          formData.append("profilePic", fileInput.files[0]);
          window.location.reload();
        }
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
        [field]: response.data.profile[field],
      }));
      setEditField(null);
    } catch (error) {
      console.error(`Error updating ${field}`, error);
    }
  };

  const handleEditToggle = () => {
    if (editField === null) {
      setEditField("all");
    } else {
      setEditField(null);
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
                  : // placeholder jpeg from media folder
                    require("../media/avatar.jpeg")
              }
              alt="Profile"
              className={styles.profilePic}
            />
            {editField === "profilePic" || editField === "all" ? (
              <>
                <input type="file" name="profilePic" onChange={handleChange} />
                <button onClick={() => handleSaveClick("profilePic")}>
                  Save
                </button>
              </>
            ) : (
              <button
                className={styles.editButton}
                onClick={() => setEditField("profilePic")}
              >
                &#9998;
              </button>
            )}
          </div>
          <h2 className={styles.fullNameContainer}>
            {editField === "username" || editField === "all" ? (
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
                  onClick={() => setEditField("username")}
                >
                  &#9998;
                </button>
              </>
            )}
          </h2>
        </div>

        <div className={styles.bioContainer}>
          <strong className={styles.bioHeader}>About me: </strong>
          {editField === "bio" || editField === "all" ? (
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
                onClick={() => setEditField("bio")}
              >
                &#9998;
              </button>
            </>
          )}
        </div>

        <button className={styles.editProfileButton} onClick={handleEditToggle}>
          {editField === null ? "Edit Profile" : "Cancel Editing"}
        </button>

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
