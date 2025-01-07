import React, { useState } from "react";
import styles from "../styles/Requests.module.css";
import axios from "axios";
import QRScanner from "./QRScanner";

const backendUrl = "https://two-school-backend.onrender.com";

const SuccessPopup = ({ onClose }) => {
  return (
    <div className={styles.successPopup}>
      <div className={styles.successContent}>
        <h2>Welcome to the Group!</h2>
        <p>You are now officially a member</p>
        <button onClick={onClose}>Continue</button>
      </div>
    </div>
  );
};

const Requests = ({ requests, onRequestUpdate }) => {
  const [processingRequests, setProcessingRequests] = useState({});
  const [showScanner, setShowScanner] = useState(false);
  const [currentVerification, setCurrentVerification] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleAccept = async (userId, groupId, username, tier) => {
    setProcessingRequests((prev) => ({ ...prev, [userId]: true }));
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/accept-request`,
        {
          userId,
          groupId,
          username,
          tier,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      onRequestUpdate();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
    setProcessingRequests((prev) => ({ ...prev, [userId]: false }));
  };

  const handleDeny = async (userId, groupId, username) => {
    setProcessingRequests((prev) => ({ ...prev, [userId]: true }));
    try {
      await axios.post(
        `${backendUrl}/api/user/deny-request`,
        {
          userId,
          groupId,
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      onRequestUpdate();
    } catch (error) {
      console.error("Error refusing request:", error);
    }
    setProcessingRequests((prev) => ({ ...prev, [userId]: false }));
  };

  const handleVerify = (request) => {
    setCurrentVerification(request);
    setShowScanner(true);
  };

  const handleScanComplete = async (scannedData) => {
    const parsedData = JSON.parse(scannedData);
    console.log("Parsed scan data:", parsedData);

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/verify-member`,
        {
          scannedUsername: parsedData.username,
          groupId: currentVerification.groupId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setShowSuccessPopup(true);
        setShowScanner(false);
        setCurrentVerification(null);
        onRequestUpdate();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      alert("Verification failed. Please try again.");
    }
  };

  return (
    <div className={styles.requestsModal}>
      <div className={styles.requestsContent}>
        <div className={styles.requestsHeader}>Requests To Join Your Group</div>
        {requests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          requests.map((request) => (
            <div key={request._id} className={styles.requestCard}>
              <div className={styles.userInfo}>
                <div className={styles.userNameAndPic}>
                  <img
                    src={
                      request.user.profile.profilePic
                        ? `data:image/jpeg;base64,${request.user.profile.profilePic}`
                        : "https://randomuser.me/api/portraits/men/1.jpg"
                    }
                    alt="Profile"
                    className={styles.profilePic}
                  />
                  <div className={styles.username}>{request.user.username}</div>
                </div>
                <p className={styles.userDetails}>{request.user.profile.bio}</p>
              </div>
              <div className={styles.actions}>
                {processingRequests[request.userId] ? (
                  <div className={styles.processing}>Processing...</div>
                ) : request.status === "SCAN" ? (
                  <button
                    onClick={() => handleVerify(request)}
                    className={styles.verifyBtn}
                  >
                    Verify
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        handleAccept(
                          request.userId,
                          request.groupId,
                          request.user.username,
                          request.user.tier
                        )
                      }
                      className={styles.acceptBtn}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleDeny(
                          request.userId,
                          request.groupId,
                          request.user.username
                        )
                      }
                      className={styles.refuseBtn}
                    >
                      Refuse
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showScanner && (
        <QRScanner
          onScan={handleScanComplete}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => {
            setShowSuccessPopup(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default Requests;
