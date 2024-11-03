import React, { useEffect, useState, useRef } from "react";
import GoogleMapReact from "google-map-react";
import styles from "../styles/groups.module.css";

const MapComponent = ({
  groups,
  selectedStart,
  selectedEnd,
  routeInfo,
  setRouteInfo,
}) => {
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
      {
        origin: start,
        destination: end,
        travelMode: "WALKING",
      },
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
    groups.forEach((group) =>
      renderDirections(group.meetupPoint, group.schoolLocation)
    );
  };

  return (
    <div className={styles.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyDnZFGBT7fBegTCG1unMndZ4eEV5pFEzfI",
          libraries: ["places"],
        }}
        defaultCenter={{ lat: -36.892057, lng: 174.618656 }}
        defaultZoom={10}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      />
    </div>
  );
};

const WrappedMapComponent = ({ groups, children }) => {
  const [map, setMap] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);

  return (
    <>
      <MapComponent groups={groups} setMap={setMap} setMapsApi={setMapsApi} />
      {children(map, mapsApi)}
    </>
  );
};

export default WrappedMapComponent;
