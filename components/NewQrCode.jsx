import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/groups.module.css";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const MapComponent = ({
  setSelectedGroup,
  onMapReady,
  selectedGroup,
  onMapClick,
}) => {
  const mapElementRef = useRef(null);
  const [allGroups, setAllGroups] = useState([]);

  const fetchAllGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/user/all-groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.length > 0) {
        setAllGroups(response.data);
      } else {
        setAllGroups([]);
        console.log("No groups found.");
      }
    } catch (error) {
      console.error("Error fetching all groups:", error);
    }
  };

  useEffect(() => {
    fetchAllGroups();
  }, []);

  useEffect(() => {
    window.handleJoinRequest = async (groupId) => {
      console.log("Sending join request for group:", groupId);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.post(
          `${backendUrl}/api/user/join-request`,
          { groupId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          alert("Join request sent successfully!");
        }
      } catch (error) {
        console.error("Error sending join request:", error);
        alert("Failed to send join request. Please try again.");
      }
    };

    const loadGoogleMapsApi = () => {
      if (!window.google || !window.google.maps) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDnZFGBT7fBegTCG1unMndZ4eEV5pFEzfI&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.body.appendChild(script);
      } else {
        initMap();
      }
    };

    const generateUniqueColors = (count) => {
      const colors = [];
      for (let i = 0; i < count; i++) {
        const hue = (i * 360) / count;
        colors.push(`hsl(${hue}, 70%, 50%)`);
      }
      return colors;
    };

    const initMap = () => {
      const map = new window.google.maps.Map(mapElementRef.current, {
        center: { lat: -36.892057, lng: 174.618656 },
        zoom: 14,
      });

      const mapsApi = window.google.maps;
      if (onMapReady) onMapReady(map, mapsApi);

      const groupColors = generateUniqueColors(allGroups.length);

      if (!selectedGroup) {
        allGroups.forEach((group, index) => {
          const groupColor = groupColors[index];
          renderGroupOnMap(group, groupColor, map);
        });
      } else {
        renderGroupOnMap(selectedGroup, "#119902", map, true);
      }

      map.addListener("click", () => {
        setSelectedGroup(null);
        onMapClick();
      });
    };

    const renderGroupOnMap = (group, color, map, isSelected = false) => {
      const startLocation = new window.google.maps.LatLng(
        parseFloat(group.routes[0].start.latitude),
        parseFloat(group.routes[0].start.longitude)
      );
      const endLocation = new window.google.maps.LatLng(
        parseFloat(group.routes[0].end.latitude),
        parseFloat(group.routes[0].end.longitude)
      );

      const startMarker = new window.google.maps.Marker({
        position: startLocation,
        map,
        title: `${group.name} - Start Location`,
        label: {
          text: group.name,
          color: "#1a0d00",
          fontSize: "14px",
          fontWeight: "bold",
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#1a0d00",
          scale: 35,
        },
      });

      const endMarker = new window.google.maps.Marker({
        position: endLocation,
        map,
        title: `${group.name} - End Location`,
        label: {
          text: "End",
          color: "#1a0d00",
          fontSize: "14px",
          fontWeight: "bold",
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#1a0d00",
          scale: 18,
        },
      });

      const infoWindowContent = `
        <div style="color: black;">
          <h4>${group.name}</h4>
          <p>Start Time: ${new Date(group.startTime).toLocaleTimeString()}</p>
          ${
            !isSelected
              ? `<button id="join-${group._id}" onclick="window.handleJoinRequest('${group._id}')">Ask to join</button>`
              : ""
          }
        </div>
      `;
      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent,
      });

      startMarker.addListener("click", () => {
        infoWindow.open(map, startMarker);
      });

      endMarker.addListener("click", () => {
        infoWindow.open(map, endMarker);
      });

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: startLocation,
          destination: endLocation,
          travelMode: window.google.maps.TravelMode.WALKING,
          avoidHighways: true,
          avoidTolls: true,
          avoidFerries: true,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (result, status) => {
          if (status === "OK") {
            const directionsRenderer =
              new window.google.maps.DirectionsRenderer({
                map,
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: color,
                  strokeOpacity: isSelected ? 1.0 : 0.7,
                  strokeWeight: isSelected ? 8 : 6,
                },
              });
            directionsRenderer.setDirections(result);
          }
        }
      );

      map.addListener("click", () => {
        infoWindow.close();
      });
    };

    loadGoogleMapsApi();
  }, [allGroups, selectedGroup]);

  return <div ref={mapElementRef} className={styles.mapContainer} />;
};

MapComponent.propTypes = {
  groups: PropTypes.array.isRequired,
  onMapReady: PropTypes.func,
  onMapClick: PropTypes.func.isRequired,
};

export default MapComponent;
