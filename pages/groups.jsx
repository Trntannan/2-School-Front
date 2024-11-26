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

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleGroupClick = (group) => {
    if (map && mapsApi) {
      const infoWindow = new mapsApi.InfoWindow({
        content: `<div style="color: black;">
          <h4>${group.name}</h4>
          <p>Start Time: ${new Date(group.startTime).toLocaleTimeString()}</p>
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

  // handle delete group by name
  const handleDeleteGroup = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/api/user/delete-group`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { groupId },
      });
      fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  // const getIndicatorStyle = (isActive) =>
  //   `${
  //     isActive ? "bg-green-500" : "bg-white"
  //   } h-4 w-4 rounded-full border border-gray-300 inline-block`;

  return (
    <div className="page-container">
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
                    {/* <span className={getIndicatorStyle(group.isActive)}></span> */}
                    {/* <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => handleEditGroup(group._id)}
                      className={styles.editIcon}
                    /> */}
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
              map={map}
              mapsApi={mapsApi}
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
