import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import styles from "../styles/groups.module.css";

const NewGroupForm = ({ map, mapsApi, setGroups }) => {
  const [form, setForm] = useState({
    groupName: "",
    schoolName: "",
    schoolLocation: "",
    meetupPoint: "",
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
        destination: form.schoolLocation,
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
    const user = localStorage.getItem("token");

    if (!form.meetupPoint || !form.schoolLocation) {
      alert("Please select both a meetup point and school location.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/user/new-group", {
        user,
        groupData: form,
      });
      setGroups((prevGroups) => [...prevGroups, response.data.group]);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <label htmlFor="groupName">Group Name:</label>
        <input
          type="text"
          id="groupName"
          name="groupName"
          value={form.groupName}
          onChange={(e) => setForm({ ...form, groupName: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="meetupPoint">Meetup Point:</label>
        <input
          type="text"
          id="meetupPoint"
          name="meetupPoint"
          ref={autocompleteRef}
          placeholder="Select a meetup point"
          required
        />
      </div>

      <div>
        <label htmlFor="schoolName">School Name:</label>
        <input
          type="text"
          id="schoolName"
          name="schoolName"
          value={form.schoolName}
          onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="schoolLocation">School Location:</label>
        <input
          type="text"
          id="schoolLocation"
          name="schoolLocation"
          ref={searchBoxRef}
          placeholder="Search for the school location"
          required
        />
      </div>

      <div>
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

      <button type="submit">Create Group</button>
    </form>
  );
};

NewGroupForm.propTypes = {
  map: PropTypes.object,
  mapsApi: PropTypes.object,
  setGroups: PropTypes.func.isRequired,
};

export default NewGroupForm;
