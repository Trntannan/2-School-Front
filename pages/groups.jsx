import React, { useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import styles from "../styles/groups.module.css";

const MapComponent = ({ groups, selectedStart, selectedEnd, setRouteInfo }) => {
  const mapRef = useRef(null);
  const directionsRenderer = useRef(null);

  useEffect(() => {
    if (mapRef.current && selectedStart && selectedEnd) {
      renderDirections(selectedStart, selectedEnd);
    }
  }, [selectedStart, selectedEnd]);

  const renderDirections = (start, end) => {
    const { map, mapsApi } = mapRef.current;
    if (!map || !mapsApi) return;

    if (!directionsRenderer.current) {
      directionsRenderer.current = new mapsApi.DirectionsRenderer();
      directionsRenderer.current.setMap(map);
    }

    const directionsService = new mapsApi.DirectionsService();
    directionsService.route(
      { origin: start, destination: end, travelMode: "WALKING" },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.current.setDirections(result);
          const { distance, duration } = result.routes[0].legs[0];
          setRouteInfo({ distance: distance.text, duration: duration.text });
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  const handleApiLoaded = (map, mapsApi) => {
    mapRef.current = { map, mapsApi };
    groups.forEach(({ start, end }) => renderDirections(start, end));
  };

  return (
    <div className={styles.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.GOOGLE_MAPS_API_KEY,
          libraries: ["places"],
        }}
        defaultCenter={{ lat: -36.892057, lng: 174.618656 }}
        defaultZoom={14}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, mapsApi }) => handleApiLoaded(map, mapsApi)}
      />
    </div>
  );
};

export default MapComponent;
