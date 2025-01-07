import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/settings.module.css";

require("dotenv").config();

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Settings = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${backendUrl}/api/user/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmation !== "Delete my account") {
      return;
    }

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
      <main className={styles.mainContent}>
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
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.closeButton}
              >
                ×
              </button>
              <p className={styles.deleteWarning}>
                To permanently delete your account enter <br />
                "Delete my account" <br /> in the field below.
              </p>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="'Delete my account'"
                className={styles.deleteConfirmationInput}
              />
              <div className={styles.buttonGroup}>
                <button
                  onClick={handleDelete}
                  className={`${styles.confirmButton} ${
                    deleteConfirmation !== "Delete my account"
                      ? styles.disabled
                      : ""
                  }`}
                  disabled={deleteConfirmation !== "Delete my account"}
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation("");
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Settings;
