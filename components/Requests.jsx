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
                {processingRequests[request._id] ? (
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
                        handleRefuse(
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
    </div>
  );
};

export default Requests;
