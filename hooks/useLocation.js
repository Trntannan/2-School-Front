import { useState, useCallback } from "react";

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState({
    lat: -36.892057,
    lng: 174.618656,
  });

  const getUserLocation = useCallback(() => {
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
  }, []);

  const handleMarkerDrag = useCallback((event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setUserLocation(newLocation);
  }, []);

  return { userLocation, getUserLocation, handleMarkerDrag };
};
