import React, { useEffect, useState, useRef } from "react";
import GoogleMapReact from "google-map-react";
import styles from "../styles/groups.module.css";

const MapComponent = ({ groups, setMap, setMapsApi }) => {
  const handleApiLoaded = (map, mapsApi) => {
    setMap(map);
    setMapsApi(mapsApi);
    if (groups.length) {
      groups.forEach(group => renderDirections(map, mapsApi, group));
    }
  };

  const renderDirections = (map, mapsApi, group) => {
    const { meetupPoint, schoolLocation } = group;
    const directionsService = new mapsApi.DirectionsService();
    const directionsRenderer = new mapsApi.DirectionsRenderer();

    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: meetupPoint,
        destination: schoolLocation,
        travelMode: "WALKING",
      },
      (result, status) => {
        if (status === mapsApi.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error(`Directions request failed due to ${status}`);
        }
      }
    );
  };

  return (
    <div className={styles.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDnZFGBT7fBegTCG1unMndZ4eEV5pFEzfI", libraries: ["places"] }}
        defaultCenter={{ lat: -36.892057, lng: 174.618656 }}
        defaultZoom={10}
        className={styles.map}
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