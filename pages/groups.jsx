import React, { useState, useEffect } from "react";
import styles from "../styles/groups.module.css";
import NewGroupForm from "../components/newGroupForm";
import BottomNavBar from "../components/BottomNavBar";
import MapComponent from "../components/MapComponent";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-group`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleDelete = async (groupId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${backendUrl}/api/user/delete-group/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups((prevGroups) =>
        prevGroups.filter((group) => group._id !== groupId)
      );
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleEdit = (groupId) => {
    // Logic for handling edit can be added here
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
        <MapComponent
          groups={groups}
          onMapReady={(map, mapsApi) => {
            // Pass the map and mapsApi to be used in NewGroupForm if needed
          }}
        />
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
                  <button onClick={() => handleEdit(group._id)}>Edit</button>
                  <button onClick={() => handleDelete(group._id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No groups found.</p>
          )}
        </div>
      </main>
      {showNewGroupForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowNewGroupForm(false)}
            >
              X
            </button>
            <NewGroupForm setGroups={setGroups} />
          </div>
        </div>
      )}
      <BottomNavBar activePage="home" />
    </div>
  );
};

export default Groups;
