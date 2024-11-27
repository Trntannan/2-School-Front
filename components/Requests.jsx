import React from "react";
import styles from "../styles/Requests.module.css";

const Requests = ({ requests, onAccept, onRefuse }) => {
  const [bioExpanded, setBioExpanded] = React.useState({});

  // const requests = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     profilePic: "https://picsum.photos/200/300",
  //     bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     profilePic: "https://picsum.photos/200/301",
  //     bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex. Phasellus malesuada massa sed purus convallis, sed bibendum ex viverra.",
  //   },
  //   {
  //     id: 3,
  //     name: "Bob Johnson",
  //     profilePic: "https://picsum.photos/200/302",
  //     bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex. Phasellus malesuada massa sed purus convallis, sed bibendum ex viverra. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
  //   },
  // ];

  const handleBioToggle = (index) => {
    setBioExpanded((prevBioExpanded) => ({
      ...prevBioExpanded,
      [index]: !prevBioExpanded[index],
    }));
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
                <button
                  className={styles.bioToggle}
                  onClick={() => handleBioToggle(index)}
                >
                  Read more
                </button>
              </div>
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
