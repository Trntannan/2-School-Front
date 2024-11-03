import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "../styles/groups.module.css";

const MapComponent = ({ groups, onMapReady }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -36.892057, lng: 174.618656 },
        zoom: 12,
      });
      const mapsApi = window.google.maps;

      if (onMapReady) onMapReady(map, mapsApi);
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDnZFGBT7fBegTCG1unMndZ4eEV5pFEzfI&libraries=places`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    }
  }, [groups]);

  return <div ref={mapRef} className={styles.mapContainer}></div>;
};

MapComponent.propTypes = {
  groups: PropTypes.array.isRequired,
  onMapReady: PropTypes.func,
};

export default MapComponent;
