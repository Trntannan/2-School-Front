import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import BottomNavBar from "../components/BottomNavBar";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [qrCode, setQrCode] = useState(
    "https://quickchart.io/qr?text=dummyText"
  );
  const [editField, setEditField] = useState(null);
  const [tempData, setTempData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        router.push("/login");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;
      console.log("User ID:", userId);

      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        router.push("/completeProfile");
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <p>Loading...</p>;
  }

  const handleEditClick = (field) => {
    setEditField(field);
    setTempData({ [field]: profile[field] });
  };

  const handleSaveClick = async (field) => {
    const updatedProfile = { ...profile, [field]: tempData[field] };
    setProfile(updatedProfile);
    setEditField(null);

    // Save updated profile back to the backend
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const data = new FormData();
    data.append("token", token);
    data.append("userId", userId);
    data.append(field, tempData[field]);
    if (field === "profilePic" && tempData[field]) {
      data.append("profilePic", tempData[field]);
    }

    try {
      const response = await fetch(`/api/users/completeProfile`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        alert("Failed to save profile data");
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
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
        {qrCode ? (
          <img src={qrCode} alt="QR Code" />
        ) : (
          <p>Loading QR Code...</p>
        )}
      </div>
      <BottomNavBar activePage="profile" />
    </div>
  );
};

export default UserProfile;
