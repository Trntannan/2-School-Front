import React, { useState } from "react";
import styles from "../styles/Requests.module.css";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com";

const Requests = ({ requests, onRequestUpdate }) => {
  const [processingRequests, setProcessingRequests] = useState({});

  const handleAccept = async (requestId, groupId) => {
    setProcessingRequests((prev) => ({ ...prev, [requestId]: true }));
    try {
      await axios.post(
        `${backendUrl}/api/user/accept-request`,
        {
          requestId,
          groupId,
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
    setProcessingRequests((prev) => ({ ...prev, [requestId]: false }));
  };

  const handleRefuse = async (requestId, groupId) => {
    setProcessingRequests((prev) => ({ ...prev, [requestId]: true }));
    try {
      await axios.post(
        `${backendUrl}/api/user/refuse-request`,
        {
          requestId,
          groupId,
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
    setProcessingRequests((prev) => ({ ...prev, [requestId]: false }));
  };

  return (
    <div className={styles.requestsModal}>
      <div className={styles.requestsContent}>
        <h2>Join Requests</h2>
        {requests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          requests.map((request) => (
            <div key={request._id} className={styles.requestCard}>
              <div className={styles.userInfo}>
                <img
                  src={request.user.profile.profilePic || "/default-avatar.png"}
                  alt={request.user.username}
                  className={styles.profilePic}
                />
                <div className={styles.userDetails}>
                  <h3>{request.user.username}</h3>
                  <p>{request.user.profile.bio}</p>
                </div>
              </div>
              <div className={styles.actions}>
                {processingRequests[request._id] ? (
                  <div className={styles.processing}>Processing...</div>
                ) : (
                  <>
                    <button
                      onClick={() => handleAccept(request._id, request.groupId)}
                      className={styles.acceptBtn}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRefuse(request._id, request.groupId)}
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
    </div>
  );
};

export default Requests;
