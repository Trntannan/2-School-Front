import React, { useState } from "react";
import styles from "../styles/Requests.module.css";
import { on } from "events";

const Requests = ({ requests }) => {
  const [bioExpanded, setBioExpanded] = React.useState({});
  const [requestStatus, setRequestStatus] = useState({});

  const handleBioToggle = (index) => {
    setBioExpanded((prevBioExpanded) => ({
      ...prevBioExpanded,
      [index]: !prevBioExpanded[index],
    }));
  };

  const onAccept = (id) => {
    setRequestStatus((prevStatus) => ({ ...prevStatus, [id]: "accepted" }));
  };

  const onRefuse = (id) => {
    setRequestStatus((prevStatus) => ({ ...prevStatus, [id]: "refused" }));
  };

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
              <div className={styles.bio}>
                {bioExpanded[index] ? (
                  <span className={styles.bioFull}>{request.bio}</span>
                ) : (
                  <span className={styles.bioSummary}>
                    {request.bio.substring(0, 50)}...
                  </span>
                )}
              </div>
            </div>
          </div>
          {requestStatus[request.id] === "accepted" ? (
            <main className="request-main flex items-center justify-center m-0">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-default"
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
          ) : requestStatus[request.id] === "refused" ? null : (
            <div>
              <button
                className={styles.accept}
                onClick={() => onAccept(request.id)}
              >
                Accept
              </button>
              <button
                className={styles.refuse}
                onClick={() => onRefuse(request.id)}
              >
                Refuse
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Requests;
