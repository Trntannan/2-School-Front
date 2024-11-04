import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "../styles/groups.module.css";

const MapComponent = ({ groups, onMapReady }) => {
  const mapRef = useRef(null);
  const directionsRenderer = useRef(null);
  const meetupMarker = useRef(null);
  const endMarker = useRef(null);

  useEffect(() => {
    // Initialize Google Maps and related elements
    const initMap = () => {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: -36.892057, lng: 174.618656 },
        zoom: 12,
      });
      const mapsApi = google.maps;

      directionsRenderer.current = new mapsApi.DirectionsRenderer({
        map: map,
      });

      onMapReady(map, mapsApi);
    };

    // Check if the Google Maps API is loaded, else load it
    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDnZFGBT7fBegTCG1unMndZ4eEV5pFEzfI&libraries=places`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      // Cleanup: remove existing markers and directions if any
      if (directionsRenderer.current) directionsRenderer.current.setMap(null);
      if (meetupMarker.current) meetupMarker.current.setMap(null);
      if (endMarker.current) endMarker.current.setMap(null);
    };
  }, [groups]);

  const setAdvancedMarker = (position, label) => {
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      map: mapRef.current,
      content: `<div class="marker">${label}</div>`,
    });
    return marker;
  };

  return <div ref={mapRef} className={styles.mapContainer}></div>;
};

MapComponent.propTypes = {
  groups: PropTypes.array.isRequired,
  onMapReady: PropTypes.func,
};

export default MapComponent;
