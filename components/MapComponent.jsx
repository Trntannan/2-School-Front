import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "../styles/groups.module.css";

const MapComponent = ({ groups, onMapReady }) => {
  const mapElementRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsApi = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?AIzaSyDnZFGBT7fBegTCG1unMndZ4eEV5pFEzfI&libraries=places`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    };

    const initMap = () => {
      const map = new window.google.maps.Map(mapElementRef.current, {
        center: { lat: -36.892057, lng: 174.618656 },
        zoom: 12,
      });

      const mapsApi = window.google.maps;

      if (onMapReady) onMapReady(map, mapsApi);

      groups.forEach((group, index) => {
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

          const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

          const startMarker = new mapsApi.Marker({
            position: startLocation,
            map,
            icon: {
              path: mapsApi.SymbolPath.CIRCLE,
              fillColor: color,
              fillOpacity: 0.8,
              scale: 10,
              strokeColor: color,
              strokeWeight: 2,
            },
          });

          const endMarker = new mapsApi.Marker({
            position: endLocation,
            map,
            icon: {
              path: mapsApi.SymbolPath.CIRCLE,
              fillColor: color,
              fillOpacity: 0.6,
              scale: 10,
              strokeColor: color,
              strokeWeight: 2,
            },
          });

          const infoWindow = new mapsApi.InfoWindow({
            content: `<div style="color: black;">
                        <h4>${group.name}</h4>
                        <p>Start Time: ${new Date(
                          group.startTime
                        ).toLocaleTimeString()}</p>
                      </div>`,
          });

          startMarker.addListener("click", () => {
            infoWindow.open(map, startMarker);
            startMarker.setIcon({
              ...startMarker.icon,
              scale: 14,
            });
          });

          endMarker.addListener("click", () => {
            infoWindow.open(map, endMarker);
            endMarker.setIcon({
              ...endMarker.icon,
              scale: 14,
            });
          });

          infoWindow.addListener("closeclick", () => {
            startMarker.setIcon({
              ...startMarker.icon,
              scale: 10,
            });
            endMarker.setIcon({
              ...endMarker.icon,
              scale: 10,
            });
          });

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
                  directions: result,
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: color,
                  },
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
      loadGoogleMapsApi();
    }
  }, [groups]);

  return <div ref={mapElementRef} className={styles.mapContainer} />;
};

MapComponent.propTypes = {
  groups: PropTypes.array.isRequired,
  onMapReady: PropTypes.func,
};

export default MapComponent;
