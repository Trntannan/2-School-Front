import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/groups.module.css";
import NewGroupForm from "../components/newGroupForm";
import MapComponent from "../components/MapComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import jwt_decode from "jwt-decode";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Groups = () => {
  const [ownedGroups, setOwnedGroups] = useState([]);
  const [memberGroups, setMemberGroups] = useState([]);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapsApiInstance, setMapsApiInstance] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userTier, setUserTier] = useState(null);

  const groupsListRef = React.useRef(null);

  const fetchUserGroups = async () => {
    setIsClient(false);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${backendUrl}/api/user/all-groups`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        const decodedToken = jwt_decode(token);
        const username = decodedToken.username;

        const owned = response.data.filter((group) => group.owner === username);
        const member = response.data.filter(
          (group) =>
            group.owner !== username &&
            group.members.some((member) => member.username === username)
        );

        setOwnedGroups(owned);
        setMemberGroups(member);
      } else {
        setOwnedGroups([]);
        setMemberGroups([]);
      }
      setIsClient(true);
    } catch (error) {
      console.error("Failed to fetch groups", error);
      setIsClient(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserTier(decodedToken.tier);
    }
    fetchUserGroups();
  }, []);

  const canAddGroup = () => {
    if (!userTier) return false;
    if (userTier === "BRONZE") return false;
    if (userTier === "GOLD" || userTier === "PLATINUM") return true;
    return ownedGroups.length < 1;
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
          groups={[...ownedGroups, ...memberGroups]}
          className={styles.mapContainer}
          setSelectedGroup={setSelectedGroup}
          onMapReady={(mapInstance, mapsApiInstance) => {
            setMapInstance(mapInstance);
            setMapsApiInstance(mapsApiInstance);
          }}
          selectedGroup={selectedGroup}
          onMapClick={() => setSelectedGroup(null)}
        />
        <div className={styles.groupsList} ref={groupsListRef}>
          <div className={styles.groupsHeader}>
            <h2 className={styles.userGroups}>Your Groups</h2>
            <div
              title={
                userTier === "BRONZE"
                  ? "Bronze tier users must join an existing group to be promoted to Silver tier before creating groups"
                  : userTier === "SILVER"
                  ? "Silver tier users can only create one group"
                  : "Create a new group"
              }
            >
              <button
                className={`${styles.addGroupButton} ${
                  !canAddGroup() ? styles.disabledButton : ""
                }`}
                onClick={() => canAddGroup() && setShowNewGroupForm(true)}
                disabled={!canAddGroup()}
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.ownedGroups}>
            <h3>Groups You Own</h3>
            {ownedGroups.length > 0 ? (
              <ul>
                {ownedGroups.map((group) => (
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
              <p>None.</p>
            )}
          </div>

          <div className={styles.memberGroups}>
            <h3>Groups You're In</h3>
            {memberGroups.length > 0 ? (
              <ul>
                {memberGroups.map((group) => (
                  <li className={styles.groupItem} key={group._id}>
                    <div
                      className={styles.groupName}
                      onClick={() => handleGroupClick(group)}
                    >
                      {group.name}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>None.</p>
            )}
          </div>
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
