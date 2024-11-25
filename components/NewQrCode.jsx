import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/groups.module.css";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const MapComponent = ({ groups, onMapReady, userId }) => {
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

      if (response.data) {
        const filteredGroups = response.data.filter(
          (group) => !groups.some((g) => g._id === group._id)
        );
        setAllGroups(filteredGroups);
      }
    } catch (error) {
      console.error("Error fetching all groups:", error);
    }
  };

  useEffect(() => {
    fetchAllGroups();
  }, [groups]);

  useEffect(() => {
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

      [...groups, ...allGroups].forEach((group) => {
        if (group.routes && group.routes.length > 0) {
          const startLocation = new mapsApi.LatLng(
            group.routes[0].start.latitude,
            group.routes[0].start.longitude
          );
          const endLocation = new mapsApi.LatLng(
            group.routes[0].end.latitude,
            group.routes[0].end.longitude
          );

          new mapsApi.Marker({
            position: startLocation,
            map,
            title: `${group.name} - Start Location`,
          });

          new mapsApi.Marker({
            position: endLocation,
            map,
            title: `${group.name} - End Location`,
          });
        }
      });
    };

    loadGoogleMapsApi();
  }, [allGroups, groups]);

  return <div ref={mapElementRef} className={styles.mapContainer} />;
};

MapComponent.propTypes = {
  groups: PropTypes.array.isRequired,
  onMapReady: PropTypes.func,
};

export default MapComponent;
