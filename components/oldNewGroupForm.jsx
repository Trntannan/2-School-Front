import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "../styles/groups.module.css";

require("dotenv").config();

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const NewGroupForm = ({ map, mapsApi, setGroups }) => {
  const [form, setForm] = useState({
    groupName: "",
    meetupPoint: "",
    endLocation: "",
    startTime: "",
  });
  const [routeInfo, setRouteInfo] = useState({ distance: "", duration: "" });

  const autocompleteRef = useRef(null);
  const searchBoxRef = useRef(null);
  const meetupMarker = useRef(null);
  const schoolMarker = useRef(null);
  const directionsRenderer = useRef(null);

  useEffect(() => {
    if (mapsApi) {
      initAutocomplete();
      directionsRenderer.current = new mapsApi.DirectionsRenderer({ map });
    }
  }, [mapsApi]);

  const initAutocomplete = () => {
    const autocomplete = new mapsApi.places.Autocomplete(
      autocompleteRef.current,
      {
        types: ["geocode"],
      }
    );
    autocomplete.addListener(
      "place_changed",
      handlePlaceChanged(autocomplete, "meetupPoint")
    );

    const searchBox = new mapsApi.places.SearchBox(searchBoxRef.current);
    searchBox.addListener("places_changed", handleSearchBoxChanged(searchBox));
  };

  const handlePlaceChanged = (autocomplete, field) => () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const location = place.geometry.location;
      setForm((prevForm) => ({
        ...prevForm,
        [field]: `${location.lat()},${location.lng()}`,
      }));
      setMarker(field, location);
      if (form.schoolLocation) calculateRoute();
    }
  };

  const handleSearchBoxChanged = (searchBox) => () => {
    const places = searchBox.getPlaces();
    if (!places.length) return;

    const place = places[0];
    const location = place.geometry.location;
    setForm((prevForm) => ({
      ...prevForm,
      schoolLocation: `${location.lat()},${location.lng()}`,
    }));
    setMarker("schoolLocation", location);
    if (form.meetupPoint) calculateRoute();
  };

  const setMarker = (field, location) => {
    const marker = field === "meetupPoint" ? meetupMarker : schoolMarker;
    if (marker.current) marker.current.setMap(null);

    marker.current = new mapsApi.Marker({
      position: location,
      map,
      label: field === "meetupPoint" ? "M" : "S",
    });

    map.panTo(location);
  };

  const calculateRoute = () => {
    const directionsService = new mapsApi.DirectionsService();
    directionsService.route(
      {
        origin: form.meetupPoint,
        destination: form.endLocation,
        travelMode: "WALKING",
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.current.setDirections(result);
          const { distance, duration } = result.routes[0].legs[0];
          setRouteInfo({ distance: distance.text, duration: duration.text });
        } else {
          console.error("Error calculating route:", status);
        }
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    const [startLat, startLng] = form.meetupPoint.split(",").map(Number);
    const [endLat, endLng] = form.endLocation.split(",").map(Number);

    const groupData = {
      name: form.groupName,
      startTime: new Date(form.startTime),
      members: [],
      routes: [
        {
          start: { latitude: startLat, longitude: startLng },
          end: { latitude: endLat, longitude: endLng },
          waypoints: [],
        },
      ],
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/new-group`,
        { groupData },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroups((prevGroups) => [...prevGroups, response.data.group]);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="groupName">Group Name:</label>
        <input
          type="text"
          id="groupName"
          name="groupName"
          value={form.groupName}
          onChange={(e) => setForm({ ...form, groupName: e.target.value })}
          placeholder="Enter group name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="startLocation">Meetup Point:</label>
        <input
          type="text"
          id="startLocation"
          name="startLocation"
          ref={autocompleteRef}
          placeholder="Select a meetup point"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="endLocation">End Location:</label>
        <input
          type="text"
          id="endLocation"
          name="endLocation"
          ref={searchBoxRef}
          placeholder="Search for end location"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="startTime">Start Time:</label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          required
        />
      </div>

      {routeInfo.distance && routeInfo.duration && (
        <div className={styles.routeInfo}>
          <p>Distance: {routeInfo.distance}</p>
          <p>Estimated Duration: {routeInfo.duration}</p>
        </div>
      )}

      <button type="submit" className="login-btn">
        Create Group
      </button>
    </form>
  );
};

NewGroupForm.propTypes = {
  map: PropTypes.object,
  mapsApi: PropTypes.object,
  setGroups: PropTypes.func.isRequired,
};

export default NewGroupForm;
