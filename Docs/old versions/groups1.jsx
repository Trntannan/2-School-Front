import React, { useState } from "react";
import GoogleMapReact from 'google-map-react';
import styles from "../styles/groups.module.css";
import NewGroupForm from "../../components/NewGroupForm";
import BottomNavBar from "../../components/BottomNavBar";

const Groups = () => {
  const [groups, setGroups] = useState([
    {
      meetupPoint: { lat: -36.8485, lng: 174.7633 },
      schoolLocation: { lat: -36.852, lng: 174.768 },
      groupName: "Default Group",
      status: "active" // just an example status
    }
  ]);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [map, setMap] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);
  const [directionRenderers, setDirectionRenderers] = useState([]);

  const renderDirections = (map, mapsApi, group) => {
    const { meetupPoint, schoolLocation } = group;
    const directionsService = new mapsApi.DirectionsService();
    const directionsRenderer = new mapsApi.DirectionsRenderer();

    directionsRenderer.setMap(map);

    directionsService.route({
      origin: meetupPoint,
      destination: schoolLocation,
      travelMode: 'WALKING'
    }, (result, status) => {
      if (status === mapsApi.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
        setDirectionRenderers(prevState => [...prevState, directionsRenderer]);
      } else {
        console.error(`Directions request failed due to ${status}`);
      }
    });
  };

  const apiIsLoaded = (map, mapsApi) => {
    setMap(map);
    setMapsApi(mapsApi);
    groups.forEach(group => renderDirections(map, mapsApi, group));
  };

  return (
    <div className={styles.groupsPage}>
      <div className="page-header">
        <h1>Groups</h1>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.mapContainer}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyDnZFGBT7fBegTCG1unMndZ4eEV5pFEzfI", libraries: ['places'] }}
            defaultCenter={{ lat: -36.892057, lng: 174.618656 }}
            defaultZoom={10}
            className={styles.map}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
          />
        </div>
        <div className={styles.groupsList}>
          <div className={styles.groupsHeader}>
            <h2 className={styles.userGroups}>Active Groups</h2>
            <button className={styles.addGroupButton} onClick={() => setShowNewGroupForm(true)}>+</button>
          </div>
          <ul>
            {groups.map((group, index) => (
              <li key={index} className={styles.groupItem}>
                <span className={styles[group.status]}></span>
                {group.groupName}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showNewGroupForm && (
        <div className={styles.overlay}>
          <div className={styles.formContainer}>
            <button className={styles.closeButton} onClick={() => setShowNewGroupForm(false)}>X</button>
            <NewGroupForm map={map} mapsApi={mapsApi} setGroups={setGroups} />
          </div>
        </div>
      )}
      <BottomNavBar activePage="home" />
    </div>
  );
};

export default Groups;