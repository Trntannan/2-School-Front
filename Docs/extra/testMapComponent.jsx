import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/groups.module.css";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const MapComponent = ({ groups, selectedGroup, onMapClick, onMapReady }) => {
  const mapElementRef = useRef(null);
  const [allGroups, setAllGroups] = useState([]);

  const fetchAllGroups = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${backendUrl}/api/user/all-groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setAllGroups(response.data);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    if (groups && groups.length) {
      setAllGroups(groups);
    } else {
      fetchAllGroups();
    }
  }, [groups]);

  useEffect(() => {
    const initMap = () => {
      const mapOptions = {
        center: { lat: -36.892057, lng: 174.618656 },
        zoom: 14,
      };
      const map = new window.google.maps.Map(mapElementRef.current, mapOptions);

      const mapsApi = window.google.maps;
      if (onMapReady) {
        onMapReady(map, mapsApi);
      }

      const generateUniqueColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
          const hue = (i * 360) / count; // Evenly spaced hues
          colors.push(`hsl(${hue}, 70%, 50%)`); // Adjust saturation and lightness
        }
        return colors;
      };

      const groupColors = generateUniqueColors(allGroups.length);

      if (!selectedGroup) {
        // Render all groups if no selectedGroup
        allGroups.forEach((group, index) => {
          const groupColor = groupColors[index];
          renderGroupOnMap(group, groupColor, map);
        });
      } else {
        // Render only the selectedGroup
        renderGroupOnMap(selectedGroup, "#FF0000", map, true); // Highlight selectedGroup in red
      }

      map.addListener("click", () => {
        onMapClick();
      });
    };

    const renderGroupOnMap = (group, color, map, isSelected = false) => {
      const startLocation = new window.google.maps.LatLng(
        group.routes[0].start.latitude,
        group.routes[0].start.longitude
      );
      const endLocation = new window.google.maps.LatLng(
        group.routes[0].end.latitude,
        group.routes[0].end.longitude
      );

      const startMarker = new window.google.maps.Marker({
        position: startLocation,
        map,
        title: `${group.name} - Start Location`,
      });

      const endMarker = new window.google.maps.Marker({
        position: endLocation,
        map,
        title: `${group.name} - End Location`,
      });

      const infoWindowContent = `
        <div style="color: black;">
          <h4>${group.name}</h4>
          <p>Start Time: ${new Date(group.startTime).toLocaleTimeString()}</p>
          ${!isSelected ? "<button>Ask to join</button>" : ""}
        </div>
      `;
      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent,
      });

      startMarker.addListener("click", () => infoWindow.open(map, startMarker));
      endMarker.addListener("click", () => infoWindow.open(map, endMarker));

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: startLocation,
          destination: endLocation,
          travelMode: window.google.maps.TravelMode.WALKING,
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

    loadGoogleMapsApi();
  }, [onMapReady]);

  return <div ref={mapElementRef} className={styles.mapContainer} />;
};

MapComponent.propTypes = {
  groups: PropTypes.array.isRequired,
  selectedGroup: PropTypes.object,
  onMapClick: PropTypes.func.isRequired,
  onMapReady: PropTypes.func, // Add prop types for onMapReady
};

export default MapComponent;
