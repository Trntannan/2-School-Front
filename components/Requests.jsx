import React, { useState } from "react";
import styles from "../styles/Requests.module.css";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com";

const Requests = ({ requests, onRequestUpdate }) => {
  const [processingRequests, setProcessingRequests] = useState({});
  const [showScanner, setShowScanner] = useState(false);
  const [currentVerification, setCurrentVerification] = useState(null);

  const handleAccept = async (userId, groupId, username) => {
    setProcessingRequests((prev) => ({ ...prev, [userId]: true }));
    try {
      await axios.post(
        `${backendUrl}/api/user/accept-request`,
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
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/verify-member`,
        {
          scannedUsername: scannedData,
          groupId: currentVerification.groupId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Member verified successfully!");
        onRequestUpdate();
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setShowScanner(false);
      setCurrentVerification(null);
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
                      request.user.profile.profilePic?.data
                        ? `data:image/jpeg;base64,${profile.profilePic}`
                        : "https://randomuser.me/api/portraits/men/1.jpg"
                    }
                    alt="Profile"
                    className={styles.profilePic}
                  />
                  <div className={styles.username}>{request.user.username}</div>
                </div>

                <div className={styles.userDetails}>
                  <p>{request.user.profile.bio}</p>
                </div>
              </div>
              <div className={styles.actions}>
                {request.status === "QR_SCAN_NEEDED" ? (
                  <button
                    onClick={() => handleVerify(request)}
                    className={styles.verifyBtn}
                  >
                    Verify
                  </button>
                ) : processingRequests[request._id] ? (
                  <div className={styles.processing}>Processing...</div>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        handleAccept(
                          request.userId,
                          request.groupId,
                          request.user.username
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
    </div>
  );
};

export default Requests;
