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

      groups.forEach((group) => {
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
                });
                directionsRenderer.setDirections(result);
              }
            }
          );
        }
      });
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
