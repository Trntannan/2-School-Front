import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/school-dashboard.module.css";

const SchoolDashboard = () => {
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [schoolName, setSchoolName] = useState("");

  const handleVerify = async (userId) => {
    const token = localStorage.getItem("schoolToken");
    await axios.post(
      `${backendUrl}/api/school/verify-user`,
      {
        userId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchPendingVerifications();
  };

  const handleDeny = async (userId, requiresInPerson, reason) => {
    const token = localStorage.getItem("schoolToken");
    await axios.post(
      `${backendUrl}/api/school/deny-user`,
      {
        userId,
        requiresInPerson,
        reason,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchPendingVerifications();
  };

  return (
    <div className={styles.dashboard}>
      <h1>{schoolName}</h1>
      <div className={styles.verificationList}>
        {pendingVerifications.map((user) => (
          <div key={user.userId} className={styles.verificationItem}>
            <h3>{user.username}</h3>
            <p>Child: {user.childName}</p>
            <div className={styles.actions}>
              <button onClick={() => handleVerify(user.userId)}>Verify</button>
              <button onClick={() => setShowDenyModal(user.userId)}>
                Deny
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchoolDashboard;
