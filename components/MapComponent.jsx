import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "../styles/groups.module.css";

const MapComponent = ({ groups, onMapReady }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.google) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDnZFGBT7fBegTCG1unMndZ4eEV5pFEzfI&libraries=places`;
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    }
  }, []);

  const initMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: -36.892057, lng: 174.618656 },
      zoom: 12,
    });

    const mapsApi = window.google.maps;

    if (onMapReady) onMapReady(map, mapsApi);

    // Display group markers on the map
    groups.forEach((group) => {
      const { latitude, longitude } = group.routes[0].start;
      new mapsApi.Marker({
        position: { lat: latitude, lng: longitude },
        map,
        label: group.name[0], // First letter of the group name
      });
    });
  };

  return <div ref={mapRef} className={styles.mapContainer}></div>;
};

MapComponent.propTypes = {
  groups: PropTypes.array.isRequired,
  onMapReady: PropTypes.func,
};

export default MapComponent;
