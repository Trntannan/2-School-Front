import React from "react";
import styles from "../styles/Requests.module.css";

const Requests = ({ requests, onAccept, onRefuse }) => {
  return (
    <div className={styles.popup}>
      <h2>Requests</h2>
      {requests.map((request, index) => (
        <div key={index} className={styles.request}>
          <div className={styles.profile}>
            <img
              src={request.profilePic}
              alt={`${request.name}'s profile`}
              className={styles.profilePic}
            />

            <div>
              <h3>{request.name}</h3>
              <a href={`/profile/${request.id}`} target="_blank">
                View Profile
              </a>
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.accept}
              onClick={() => onAccept(request.id)}
            >
              ACCEPT
            </button>
            <button
              className={styles.refuse}
              onClick={() => onRefuse(request.id)}
            >
              REFUSE
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Requests;
