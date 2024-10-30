import React, { useState, useEffect } from "react";
import styles from "../styles/groups.module.css";
import NewGroupForm from "../components/newGroupForm";
import BottomNavBar from "../components/BottomNavBar";
import WrappedMapComponent from "../components/MapComponent";
import axios from "axios";

const backendUrl = "http://localhost:5000";

const mockRequests = [
  {
    id: 1,
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    name: 'John Doe',
    children: 2,
    school: 'Springfield Elementary'
  },
  {
    id: 2,
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
    name: 'Jane Smith',
    children: 1,
    school: 'Shelbyville High'
  }
];

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);

  const fetchGroups =async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-group`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const fetchedGroups = response.data;
      console.log("Fetched groups:", fetchedGroups);

      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroups([]);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Groups</h1>
      </div>
      <main className={styles.mainContent}>
        <WrappedMapComponent groups={groups}>
          {(map, mapsApi) => (
            showNewGroupForm && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <button className={styles.closeButton} onClick={() => setShowNewGroupForm(false)}>
                    X
                  </button>
                  <NewGroupForm map={map} mapsApi={mapsApi} setGroups={setGroups} />
                </div>
              </div>
            )
          )}
        </WrappedMapComponent>
        <div className={styles.groupsList}>
          <div className={styles.groupsHeader}>
            <h2 className={styles.userGroups}>Active Groups</h2>
            <button
              className={styles.addGroupButton}
              onClick={() => setShowNewGroupForm(true)}
            >
              +
            </button>
          </div>
          {groups.length > 0 ? (
            <ul>
              {groups.map((group) => (
                <li key={group._id}>
                  <p>{group.groupName}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No groups found.</p>
          )}
        </div>
      </main>
      <BottomNavBar activePage="home" requests={mockRequests} />
    </div>
  );
};

export default Groups;