import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/groups.module.css";
import axios from "axios";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const backendUrl = "https://two-school-backend.onrender.com";

const MapComponent = ({
  setSelectedGroup,
  onMapReady,
  selectedGroup,
  onMapClick,
}) => {
  const mapElementRef = useRef(null);
  const [allGroups, setAllGroups] = useState([]);
  const [userLocation, setUserLocation] = useState({
    lat: -36.892057,
    lng: 174.618656,
  });

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    }
  };

  const fetchAllGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/user/all-groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.length > 0) {
        setAllGroups(response.data);
      } else {
        setAllGroups([]);
        console.log("No groups found.");
      }
    } catch (error) {
      console.error("Error fetching all groups:", error);
    }
  };

  useEffect(() => {
    getUserLocation();
    fetchAllGroups();
  }, []);

  useEffect(() => {
    window.handleJoinRequest = async (groupId) => {
      console.log("Sending join request for group:", groupId);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.post(
          `${backendUrl}/api/user/join-request`,
          { groupId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          alert("Join request sent successfully!");
        }
      } catch (error) {
        console.error("Error sending join request:", error);
        alert("Failed to send join request. Please try again.");
      }
    };

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

    const generateUniqueColors = (count) => {
      const colors = [];
      for (let i = 0; i < count; i++) {
        const hue = (i * 360) / count;
        colors.push(`hsl(${hue}, 70%, 50%)`);
      }
      return colors;
    };

    const initMap = () => {
      const map = new window.google.maps.Map(mapElementRef.current, {
        center: userLocation,
        zoom: 20,
      });

      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map,
        title: "Your Location",
        label: {
          text: "User",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          textAlign: "center",
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#1a0d00",
          scale: 35,
        },
      });

      const mapsApi = window.google.maps;
      if (onMapReady) onMapReady(map, mapsApi);

      const groupColors = generateUniqueColors(allGroups.length);
      const markers = [];
      const bounds = new window.google.maps.LatLngBounds();

      if (!selectedGroup) {
        allGroups.forEach((group, index) => {
          const groupColor = groupColors[index];
          const groupMarkers = renderGroupOnMap(group, groupColor, map);
          markers.push(groupMarkers[0]);
          bounds.extend(groupMarkers[0].getPosition());
        });

        const markerClusterer = new MarkerClusterer({
          map,
          markers,
          onClusterClick: (cluster) => {
            const clusteredMarkers = cluster.getMarkers();
            const bounds = new window.google.maps.LatLngBounds();
            clusteredMarkers.forEach((marker) =>
              bounds.extend(marker.getPosition())
            );
            map.fitBounds(bounds);
          },
          gridSize: 30,
          minimumClusterSize: 2,
          styles: [
            {
              url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
              width: 47,
              height: 47,
              textColor: "#fff",
            },
          ],
        });

        map.fitBounds(bounds, { padding: 50 });
      } else {
        const selectedMarkers = renderGroupOnMap(
          selectedGroup,
          "#119902",
          map,
          true
        );
        markers.push(selectedMarkers[0]);
      }

      map.addListener("click", () => {
        setSelectedGroup(null);
        onMapClick();
      });
    };

    const renderGroupOnMap = (group, color, map, isSelected = false) => {
      console.log("Rendering group with ID:", group._id);

      const startLocation = new window.google.maps.LatLng(
        parseFloat(group.routes[0].start.latitude),
        parseFloat(group.routes[0].start.longitude)
      );
      const endLocation = new window.google.maps.LatLng(
        parseFloat(group.routes[0].end.latitude),
        parseFloat(group.routes[0].end.longitude)
      );

      let currentInfoWindow = null;

      const startMarker = new window.google.maps.Marker({
        position: startLocation,
        map,
        title: `${group.name} - Start Location`,
        label: {
          text: group.name,
          color: "#1a0d00",
          fontSize: "10px",
          fontWeight: "bold",
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#1a0d00",
          scale: 30,
        },
      });

      const endMarker = new window.google.maps.Marker({
        position: endLocation,
        map: null,
        title: `${group.name} - End Location`,
        label: {
          text: "End",
          color: "#1a0d00",
          fontSize: "10px",
          fontWeight: "bold",
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#1a0d00",
          scale: 10,
        },
      });

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: startLocation,
          destination: endLocation,
          travelMode: window.google.maps.TravelMode.WALKING,
          avoidHighways: true,
          avoidTolls: true,
          avoidFerries: true,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (result, status) => {
          if (status === "OK") {
            const duration = result.routes[0].legs[0].duration.text;

            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div style="color: black;">
                <h4>${group.name}</h4>
                <p>Start Time: ${new Date(
                  group.startTime
                ).toLocaleTimeString()}</p>
                <p>Estimated Walking Time: ${duration}</p>
                ${
                  !isSelected
                    ? `<button data-group-id="${group._id}" onclick="handleJoinRequest(this.dataset.groupId)">
                    Ask to join
                  </button>`
                    : ""
                }</div>`,
            });

            startMarker.addListener("click", () => {
              if (currentInfoWindow) {
                currentInfoWindow.close();
              }
              infoWindow.open(map, startMarker);
              currentInfoWindow = infoWindow;
              endMarker.setMap(map);
            });

            const directionsRenderer =
              new window.google.maps.DirectionsRenderer({
                map,
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: color,
                  strokeOpacity: isSelected ? 1.0 : 0.7,
                  strokeWeight: isSelected ? 8 : 6,
                },
              });
            directionsRenderer.setDirections(result);

            const path = result.routes[0].overview_path;
            const clickablePolyline = new window.google.maps.Polyline({
              path: path,
              strokeColor: color,
              strokeOpacity: 0,
              strokeWeight: 8,
              clickable: true,
              map: map,
              cursor: "pointer",
            });

            clickablePolyline.addListener("click", () => {
              if (currentInfoWindow) {
                currentInfoWindow.close();
              }
              infoWindow.open(map, startMarker);
              currentInfoWindow = infoWindow;
              endMarker.setMap(map);
            });
          }
        }
      );

      map.addListener("click", () => {
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        endMarker.setMap(null);
      });

      return [startMarker, endMarker];
    };

    loadGoogleMapsApi();
  }, [allGroups, selectedGroup, userLocation]);

  return <div ref={mapElementRef} className={styles.mapContainer} />;
};

MapComponent.propTypes = {
  groups: PropTypes.array.isRequired,
  onMapReady: PropTypes.func,
  onMapClick: PropTypes.func.isRequired,
};

export default MapComponent;
