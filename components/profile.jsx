import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import QRCode from "./QrCode";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userTier, setUserTier] = useState(null);
  const getTierImage = (tier) => {
    const tierImages = {
      BRONZE: "/Tiers/bronze.png",
      SILVER: "/Tiers/silver.png",
      GOLD: "/Tiers/gold.png",
      DIAMOND: "/Tiers/diamond.png",
    };
    return tierImages[tier];
  };

  const fetchUserTier = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${backendUrl}/api/user/current-tier`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUserTier(response.data.tier);
  };
  useEffect(() => {
    fetchUserTier();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile({
        ...response.data.profile,
        username: response.data.username,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    setIsClient(true);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTempData((prevData) => ({ ...prevData, [name]: value }));
  };

  const enterEditMode = () => {
    setTempData({
      username: profile?.username || "",
      bio: profile?.bio || "",
      profilePic: null,
    });
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      let formData = new FormData();

      formData.append("username", tempData.username);
      formData.append("bio", tempData.bio);

      if (tempData.profilePic) {
        const fileInput = document.querySelector('input[name="profilePic"]');
        if (fileInput.files.length > 0) {
          formData.append("profilePic", fileInput.files[0]);
        }
      } else if (profile.profilePic) {
        formData.append("profilePic", profile.profilePic);
      }

      await axios.put(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchProfile();
      setEditMode(false);
      setTempData({});
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient || !profile) {
    return (
      <div className="page-container">
        <main className="main-content flex items-center justify-center">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"
            disabled
          >
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Processing...
          </button>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`page-container ${isSubmitting ? "cursor-not-allowed" : ""}`}
    >
      <main
        className={`main-content ${isSubmitting ? "pointer-events-none" : ""}`}
      >
        <div className={styles.profilePicContainer}>
          <div className={styles.profilePicContent}>
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
              <input type="file" name="profilePic" onChange={handleChange} />
            )}
          </div>
          {editMode ? (
            <input
              type="text"
              name="username"
              value={tempData.username}
              onChange={handleChange}
              className={styles.usernameInput}
            />
          ) : (
            <h2 className={styles.userName}>{profile.username}</h2>
          )}
        </div>

        <div className={styles.bioContainer}>
          <h3 className={styles.bioHeader}>Bio: </h3>
          <div className={styles.bio}>
            {editMode ? (
              <textarea
                name="bio"
                value={tempData.bio}
                onChange={handleChange}
                className={styles.bioInput}
              />
            ) : (
              <p>{profile.bio}</p>
            )}
          </div>
        </div>

        <div
          className={`${styles.profileBottom} ${
            isSubmitting ? "cursor-not-allowed" : ""
          }`}
        >
          {!editMode ? (
            <button
              className={styles.editProfileButton}
              onClick={enterEditMode}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`w-4 h-4 mr-1`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
              Edit Profile
            </button>
          ) : (
            <button
              className={`${styles.editProfileButton} ${
                isSubmitting
                  ? "cursor-not-allowed opacity-75 pointer-events-none"
                  : ""
              }`}
              onClick={handleSaveClick}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          )}
          <button
            className={styles.qrCodeButton}
            onClick={() => setShowQrModal(true)}
          >
            Verification
          </button>
        </div>

        {showQrModal && (
          <div className={styles.qrModal} onClick={() => setShowQrModal(false)}>
            <div className={styles.qrModalContent}>
              <div className={styles.qrBackground}>
                <img
                  src={getTierImage(userTier)}
                  alt={`${userTier} background`}
                  className={styles.tierBackground}
                />
                <div className={styles.qrOverlay}>
                  <QRCode userId={localStorage.getItem("userId")} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
