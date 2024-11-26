import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/groups.module.css";
import NewGroupForm from "../components/newGroupForm";
import MapComponent from "../components/MapComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null); // Track the selected group
  const [isClient, setIsClient] = useState(false);

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-group`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
    setIsClient(true);
  }, []);

  const handleGroupClick = (group) => {
    setSelectedGroup(group); // Set the selected group to display its markers and routes
  };

  const handleDeleteGroup = async (groupId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${backendUrl}/api/user/delete-group`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { groupId },
      });
      fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  if (!isClient || groups.length === 0) {
    return (
      <div className="page-container">
        <main className="main-content flex items-center justify-center">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"
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
      </div>
    );
  }

  return (
    <div className="page-container">
      <main className={styles.mainContent}>
        <MapComponent
          groups={groups}
          selectedGroup={selectedGroup} // Pass the selected group to the map
          onMapClick={() => setSelectedGroup(null)} // Reset selected group on map click
        />
        <div className={styles.groupsList}>
          <div className={styles.groupsHeader}>
            <h2 className={styles.userGroups}>Your Groups</h2>
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
                <li className={styles.groupItem} key={group._id}>
                  <div
                    className={styles.groupName}
                    onClick={() => handleGroupClick(group)}
                  >
                    {group.name}
                  </div>

                  <div className={styles.actionIcons}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleDeleteGroup(group._id)}
                      className={styles.trashIcon}
                    />
                  </div>
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
            <NewGroupForm
              setGroups={fetchGroups}
              closeForm={() => setShowNewGroupForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
