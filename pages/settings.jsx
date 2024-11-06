import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/settings.module.css";

require("dotenv").config();

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Settings = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
    // refresh the page
    window.location.reload();
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `${backendUrl}/api/user/delete-account`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Account deleted successfully:", response.data);
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <h1>Settings</h1>
        <button
          onClick={() => setShowLogoutModal(true)}
          className={styles.logoutBtn}
        >
          Logout
        </button>
        {showLogoutModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <p>Confirm Logout</p>
              <div className={styles.buttonGroup}>
                <button onClick={handleLogout} className={styles.confirmButton}>
                  Yes
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowDeleteModal(true)}
          className={styles.deleteButton}
        >
          Delete Account
        </button>
        {showDeleteModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <p>Are you sure you want to permanently DELETE your account?</p>
              <div className={styles.buttonGroup}>
                <button onClick={handleDelete} className={styles.confirmButton}>
                  Yes
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
