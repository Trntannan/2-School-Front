import React, { useState, useEffect } from "react";
import styles from "../styles/groups.module.css";
import NewGroupForm from "../components/newGroupForm";
import BottomNavBar from "../components/BottomNavBar";
import WrappedMapComponent from "../components/MapComponent";
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
    // Open the form in edit mode with pre-filled data (modify NewGroupForm to support this)
    // Example logic to set form with the selected group's data could be added here
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
          {(map, mapsApi) =>
            showNewGroupForm && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <button
                    className={styles.closeButton}
                    onClick={() => setShowNewGroupForm(false)}
                  >
                    X
                  </button>
                  <NewGroupForm
                    map={map}
                    mapsApi={mapsApi}
                    setGroups={setGroups}
                  />
                </div>
              </div>
            )
          }
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
      <BottomNavBar activePage="home" />
    </div>
  );
};

export default Groups;
