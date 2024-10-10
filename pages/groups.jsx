import React, { useState } from "react";
import styles from "../styles/groups.module.css";
import NewGroupForm from "../components/newGroupForm";
import BottomNavBar from "../components/BottomNavBar";
import WrappedMapComponent from "../components/MapComponent";

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
  const [groups, setGroups] = useState([
    {
      meetupPoint: { lat: -36.8485, lng: 174.7633 },
      schoolLocation: { lat: -36.852, lng: 174.768 },
      groupName: "Test Group",
      status: "active"
    }
  ]);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);

  return (
    <div className={styles.groupsPage}>
      <div className="page-header">
        <h1>Groups</h1>
      </div>
      <div className={styles.mainContent}>
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
          <ul>
            {groups.map((group, index) => (
              <li key={index} className={styles.groupItem}>
                <span className={styles[group.status]}></span>
                {group.groupName}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <BottomNavBar activePage="home" requests={mockRequests} />
    </div>
  );
};

export default Groups;