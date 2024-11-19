const Requests = ({ requests, onAccept, onRefuse }) => {
  return (
    <div className={styles.popup}>
      <h2>Join Requests</h2>
      {requests.map((request) => (
        <div key={request._id} className={styles.request}>
          <div className={styles.profile}>
            <img
              src={request.profilePic}
              alt={`${request.name}'s profile`}
              className={styles.profilePic}
            />
            <div>
              <h3>{request.name}</h3>
              <p>Number of children: {request.children}</p>
              <p>School: {request.school}</p>
              <a href={`/profile/${request.userId}`} target="_blank">
                View Profile
              </a>
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.accept}
              onClick={() => onAccept(request._id)}
            >
              ACCEPT
            </button>
            <button
              className={styles.refuse}
              onClick={() => onRefuse(request._id)}
            >
              REFUSE
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
