import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/groups.module.css";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const MapComponent = ({ groups: userGroups, onMapReady }) => {
  const mapElementRef = useRef(null);
  const [allGroups, setAllGroups] = useState([]);

  const fetchAllGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/user/all-groups`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setAllGroups(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching all groups:", error);
    }
  };

  useEffect(() => {
    fetchAllGroups();
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

    const initMap = () => {
      const map = new window.google.maps.Map(mapElementRef.current, {
        center: { lat: -36.892057, lng: 174.618656 },
        zoom: 12,
      });

      const mapsApi = window.google.maps;

      if (onMapReady) onMapReady(map, mapsApi);

      // Combine user and all groups for display
      const combinedGroups = [...userGroups, ...allGroups];

      combinedGroups.forEach((group) => {
        if (group.routes && group.routes.length > 0) {
          const directionsService = new mapsApi.DirectionsService();
          const startLocation = new mapsApi.LatLng(
            group.routes[0].start.latitude,
            group.routes[0].start.longitude
          );
          const endLocation = new mapsApi.LatLng(
            group.routes[0].end.latitude,
            group.routes[0].end.longitude
          );

          const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

          const startMarker = new mapsApi.Marker({
            position: startLocation,
            map,
            title: `${group.name} - Start Location`,
          });

          const endMarker = new mapsApi.Marker({
            position: endLocation,
            map,
            title: `${group.name} - End Location`,
          });

          const infoWindow = new mapsApi.InfoWindow({
            content: `<div style="color: black;"><button class="${
              styles.toJoin
            }" data-group-id="${group._id}">Ask to join</button>
                        <h4>${group.name}</h4>
                        <p>Start Time: ${new Date(
                          group.startTime
                        ).toLocaleTimeString()}</p>
                      </div>`,
          });

          startMarker.addListener("click", () => {
            infoWindow.open(map, startMarker);
            startMarker.setIcon({
              ...startMarker.icon,
              scale: 14,
            });
          });

          endMarker.addListener("click", () => {
            infoWindow.open(map, endMarker);
            endMarker.setIcon({
              ...endMarker.icon,
              scale: 14,
            });
          });

          infoWindow.addListener("closeclick", () => {
            startMarker.setIcon({
              ...startMarker.icon,
              scale: 10,
            });
            endMarker.setIcon({
              ...endMarker.icon,
              scale: 10,
            });
          });

          directionsService.route(
            {
              origin: startLocation,
              destination: endLocation,
              travelMode: mapsApi.TravelMode.WALKING,
              unitSystem: mapsApi.UnitSystem.METRIC,
            },
            (result, status) => {
              if (status === "OK") {
                const directionsRenderer = new mapsApi.DirectionsRenderer({
                  map,
                  directions: result,
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: color,
                  },
                });
                directionsRenderer.setDirections(result);
              }
            }
          );
        }
      });
    };

    loadGoogleMapsApi();
  }, [userGroups, allGroups]);

  return <div ref={mapElementRef} className={styles.mapContainer} />;
};

MapComponent.propTypes = {
  groups: PropTypes.array.isRequired,
  onMapReady: PropTypes.func,
};

export default MapComponent;
