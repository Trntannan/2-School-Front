import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "../styles/groups.module.css";

const MapComponent = ({ groups, allGroups, onMapReady }) => {
  const mapElementRef = useRef(null);

  const colorPalette = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFA500",
    "#800080",
    "#008080",
    "#FF69B4",
  ];

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

      const renderGroupMarkers = (groupList, isUserGroup = false) => {
        groupList?.forEach((group, index) => {
          if (group.routes && group.routes.length > 0) {
            const color = isUserGroup
              ? colorPalette[index % colorPalette.length]
              : "#808080";

            const startLocation = new mapsApi.LatLng(
              group.routes[0].start.latitude,
              group.routes[0].start.longitude
            );

            const endLocation = new mapsApi.LatLng(
              group.routes[0].end.latitude,
              group.routes[0].end.longitude
            );

            const startMarker = new mapsApi.Marker({
              position: startLocation,
              map,
              title: `${group.name} - Start Location`,
              icon: {
                path: mapsApi.SymbolPath.CIRCLE,
                fillColor: color,
                fillOpacity: 0.6,
                scale: 8,
              },
            });

            const endMarker = new mapsApi.Marker({
              position: endLocation,
              map,
              title: `${group.name} - End Location`,
              icon: {
                path: mapsApi.SymbolPath.CIRCLE,
                fillColor: color,
                fillOpacity: 0.6,
                scale: 8,
              },
            });
          }
        });
      };

      renderGroupMarkers(groups, true);
      renderGroupMarkers(allGroups);
    };

    loadGoogleMapsApi();
  }, [groups, allGroups]);

  return <div ref={mapElementRef} className={styles.mapContainer} />;
};

MapComponent.propTypes = {
  groups: PropTypes.array.isRequired,
  allGroups: PropTypes.array,
  onMapReady: PropTypes.func,
};

export default MapComponent;
