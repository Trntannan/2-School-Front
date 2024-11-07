import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import BottomNavBar from "./BottomNavBar";
import QRCode from "./QrCode";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
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

        console.log("Fetched profile:", response.data);

        setProfile({
          ...response.data.profile,
          username: response.data.username,
        });
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
    try {
      const token = localStorage.getItem("token");
      let formData = new FormData();

      if (field === "profilePic") {
        const fileInput = document.querySelector('input[name="profilePic"]');
        if (fileInput.files.length > 0) {
          formData.append("profilePic", fileInput.files[0]);
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
      setEditMode(false);
      window.location.reload();
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
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
            {editMode && (
              <>
                <input type="file" name="profilePic" onChange={handleChange} />
              </>
            )}
          </div>
          {editMode ? (
            <>
              <input
                type="text"
                name="username"
                value={tempData.username || profile.username || ""}
                onChange={handleChange}
              />
            </>
          ) : (
            <h2 className={styles.fullNameContainer}>
              {profile.username || "No username available"}
            </h2>
          )}
        </div>

        <div className={styles.editProfileButtonContainer}>
          {!editMode ? (
            <button
              className={styles.editProfileButton}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          ) : (
            <button
              className={styles.saveProfileButton}
              onClick={() => {
                handleSaveClick("username");
                handleSaveClick("bio");
                handleSaveClick("profilePic");
              }}
            >
              Save Changes
            </button>
          )}
        </div>

        <div className={styles.bioContainer}>
          <strong className={styles.bioHeader}>About me: </strong>
          <div className={styles.bio}>
            {editMode ? (
              <>
                <textarea
                  name="bio"
                  value={tempData.bio || ""}
                  onChange={handleChange}
                />
              </>
            ) : (
              <p>{profile.bio || "No bio available"}</p>
            )}
          </div>
        </div>

        <div
          className={styles.qrCodeContainer}
          onClick={() => setShowQrModal(true)}
        >
          <h4 className={styles.qrCodeHeader}>QR Code</h4>
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
