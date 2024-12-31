import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/groups.module.css";
import NewGroupForm from "../components/newGroupForm";
import MapComponent from "../components/MapComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Groups = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapsApiInstance, setMapsApiInstance] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userTier, setUserTier] = useState(null);

  const groupsListRef = React.useRef(null);

  const getUserTierFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.tier;
    }
    return null;
  };

  const fetchUserGroups = async () => {
    setIsClient(false);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-group`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setUserGroups(response.data);
      } else {
        setUserGroups([]);
      }
      setIsClient(true);
    } catch (error) {
      console.error("Failed to fetch groups", error);
      setIsClient(true);
    }
  };

  useEffect(() => {
    fetchUserGroups();
    setUserTier(getUserTierFromToken());
  }, []);

  const canAddGroup = () => {
    if (!userTier) return false;
    if (userTier === "GOLD" || userTier === "PLATINUM") return true;
    return userGroups.length < 1;
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    if (mapInstance) {
      mapInstance.setCenter({ lat: group.lat, lng: group.lng });
      mapInstance.setZoom(15);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        groupsListRef.current &&
        !groupsListRef.current.contains(event.target)
      ) {
        setSelectedGroup(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelectedGroup]);

  const handleDeleteGroup = async (groupId) => {
    setIsClient(false);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${backendUrl}/api/user/delete-group`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { groupId },
      });
      fetchUserGroups();
      setIsClient(true);
    } catch (error) {
      console.error("Error deleting group:", error);
      setIsClient(true);
    }
  };

  const renderAddGroupButton = () => {
    const isBasicTier = userTier === "BRONZE" || userTier === "SILVER";
    const hasMaxGroups = userGroups.length >= 1;

    return (
      <button
        className={`${styles.addGroupButton} ${
          !canAddGroup() ? styles.disabledButton : ""
        }`}
        onClick={() => canAddGroup() && setShowNewGroupForm(true)}
        title={
          isBasicTier && hasMaxGroups
            ? "As a bronze or silver user you can only have 1 group at a time."
            : "Add new group"
        }
        disabled={!canAddGroup()}
      >
        +
      </button>
    );
  };

  if (!isClient) {
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
          groups={userGroups}
          className={styles.mapContainer}
          setSelectedGroup={setSelectedGroup}
          onMapReady={(mapInstance, mapsApiInstance) => {
            setMapInstance(mapInstance);
            setMapsApiInstance(mapsApiInstance);
          }}
          selectedGroup={selectedGroup}
          onMapClick={() => setSelectedGroup(null)}
        />
        <div className={styles.groupsList}>
          <div className={styles.groupsHeader}>
            <h2 className={styles.userGroups}>Your Groups</h2>
            {renderAddGroupButton()}
          </div>
          {userGroups.length > 0 ? (
            <ul>
              {userGroups.map((group) => (
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
            <NewGroupForm
              map={mapInstance}
              mapsApi={mapsApiInstance}
              setGroups={fetchUserGroups}
              closeForm={() => setShowNewGroupForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
