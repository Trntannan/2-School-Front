import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/groups.module.css";
import NewGroupForm from "../components/newGroupForm";
import BottomNavBar from "../components/BottomNavBar";
import MapComponent from "../components/MapComponent";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [map, setMap] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);

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

  const fetchJoinedGroups = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-joined`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setJoinedGroups(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching joined groups:", error);
    }
  };

  const fetchAllGroups = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-group`);
      setAllGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  //function to delete group using group name not groupId
  const handleDelete = async (group) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${backendUrl}/api/user/delete-group`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { name: group.name },
      });
      fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleStatusChange = async (groupId, status) => {
    setGroupStatus((prevStatus) => ({
      ...prevStatus,
      [groupId]: status,
    }));
  };

  const handleGroupClick = (group) => {
    if (map && mapsApi) {
      const infoWindow = new mapsApi.InfoWindow({
        content: `<div style="color: black;">
                    <h4>${group.name}</h4>
                    <p>Start Time: ${new Date(
                      group.startTime
                    ).toLocaleTimeString()}</p>
                  </div>`,
      });

      const startLocation = new mapsApi.LatLng(
        group.routes[0].start.latitude,
        group.routes[0].start.longitude
      );

      infoWindow.setPosition(startLocation);
      infoWindow.open(map);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchJoinedGroups();
    fetchAllGroups();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Groups</h1>
      </div>
      <main className={styles.mainContent}>
        <MapComponent
          groups={groups}
          className={styles.mapContainer}
          onMapReady={(mapInstance, mapsApiInstance) => {
            setMap(mapInstance);
            setMapsApi(mapsApiInstance);
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
                <li className={styles.groupItem} key={group._id}>
                  <div
                    className={styles.groupName}
                    onClick={() => handleGroupClick(group)}
                  >
                    {group.name}
                  </div>
                  <div className={styles.statusSelector}>
                    <label>
                      <input
                        type="radio"
                        checked={groupStatus[group._id] === "active"}
                        onChange={() => handleStatusChange(group._id, "active")}
                      />
                      Active
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={groupStatus[group._id] === "inactive"}
                        onChange={() =>
                          handleStatusChange(group._id, "inactive")
                        }
                      />
                      Inactive
                    </label>
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(group)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No groups found.</p>
          )}
          <div className={styles.groupsHeader}>
            <h2 className={styles.otherGroups}>Other Groups</h2>
          </div>
          {joinedGroups.length > 0 ? (
            <ul>
              {joinedGroups.map((group) => (
                <li className={styles.groupItem} key={group._id}>
                  <div
                    className={styles.groupName}
                    onClick={() => handleGroupClick(group)}
                  >
                    {group.name}
                  </div>
                  <div className={styles.statusSelector}>
                    <span>Joined</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No joined groups.</p>
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
              map={map}
              mapsApi={mapsApi}
              setGroups={setGroups}
              closeForm={() => setShowNewGroupForm(false)}
            />
          </div>
        </div>
      )}
      <BottomNavBar activePage="home" />
    </div>
  );
};

export default Groups;
