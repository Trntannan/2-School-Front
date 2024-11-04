import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styles from "../styles/groups.module.css";

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
      { types: ["geocode"] }
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
      if (form.endLocation) calculateRoute();
    }
  };

  const handleSearchBoxChanged = (searchBox) => () => {
    const places = searchBox.getPlaces();
    if (!places.length) return;

    const place = places[0];
    const location = place.geometry.location;
    setForm((prevForm) => ({
      ...prevForm,
      endLocation: `${location.lat()},${location.lng()}`,
    }));
    setMarker("endLocation", location);
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
      routes: [
        {
          start: { latitude: startLat, longitude: startLng },
          end: { latitude: endLat, longitude: endLng },
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
      setGroups((prevGroups) => [...prevGroups, response.data]);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <input
        type="text"
        name="groupName"
        id="groupName"
        value={form.groupName}
        className="form-group"
        placeholder="Group Name"
        onChange={(e) => setForm({ ...form, groupName: e.target.value })}
      />
      <input
        ref={autocompleteRef}
        type="text"
        name="meetupPoint"
        id="meetupPoint"
        className="form-group"
        placeholder="Meetup Point"
      />
      <input
        ref={searchBoxRef}
        type="text"
        name="endLocation"
        id="endLocation"
        className="form-group"
        placeholder="End Location"
      />
      <input
        type="datetime-local"
        name="startTime"
        id="startTime"
        value={form.startTime}
        className="form-group"
        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
      />
      {routeInfo.distance && routeInfo.duration && (
        <p>
          Distance: {routeInfo.distance}, Duration: {routeInfo.duration}
        </p>
      )}
      <button className="login-btn" type="submit">
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
