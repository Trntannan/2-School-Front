import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/groups.module.css";
import NewGroupForm from "../components/newGroupForm";
import BottomNavBar from "../components/BottomNavBar";
import MapComponent from "../components/MapComponent";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [map, setMap] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-requests`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${backendUrl}/api/groups/accept-request`,
        { requestId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleRefuseRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${backendUrl}/api/groups/refuse-request`,
        { requestId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRequests();
    } catch (error) {
      console.error("Error refusing request:", error);
    }
  };

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
    fetchRequests();
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
        </div>
        <div className={styles.requestsList}>
          <h2>Join Requests</h2>
          {loading ? (
            <p>Loading requests...</p>
          ) : (
            <ul>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <li className={styles.requestItem} key={request._id}>
                    <div className={styles.requestDetails}>
                      <h3>{request.name}</h3>
                      <p>{request.message || "No message"}</p>
                    </div>
                    <div className={styles.requestActions}>
                      <button
                        className={styles.acceptButton}
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        Accept
                      </button>
                      <button
                        className={styles.refuseButton}
                        onClick={() => handleRefuseRequest(request._id)}
                      >
                        Refuse
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No join requests found.</p>
              )}
            </ul>
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
