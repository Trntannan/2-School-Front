import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const NewGroupForm = ({ map, mapsApi, setGroups, closeForm }) => {
  const [form, setForm] = useState({
    groupName: "",
    meetupPoint: "",
    endLocation: "",
    startTime: "",
  });

  const autocompleteRef = useRef(null);
  const searchBoxRef = useRef(null);
  const meetupMarker = useRef(null);
  const schoolMarker = useRef(null);

  useEffect(() => {
    if (mapsApi && map) {
      initAutocomplete();
    }
  }, [mapsApi, map]);

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
      label: field === "meetupPoint" ? "Start" : "End",
    });

    map.panTo(location);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.body.style.cursor = "wait";

    if (!form.meetupPoint || !form.endLocation) {
      alert("Please enter both meetup point and end location");
      return;
    } else if (form.meetupPoint === form.endLocation) {
      alert("Meetup point and end location cannot be the same");
      return;
    } else if (!form.startTime) {
      alert("Please enter a start time");
      return;
    } else if (!form.groupName) {
      alert("Please enter a group name");
      return;
    }

    try {
      const newGroup = {
        name: form.groupName,
        startTime: new Date(`1970-01-01T${form.startTime}:00`).toISOString(),
        routes: [
          {
            start: {
              latitude: parseFloat(form.meetupPoint.split(",")[0]),
              longitude: parseFloat(form.meetupPoint.split(",")[1]),
            },
            end: {
              latitude: parseFloat(form.endLocation.split(",")[0]),
              longitude: parseFloat(form.endLocation.split(",")[1]),
            },
            waypoints: [],
          },
        ],
      };

      const response = await axios.post(
        `${backendUrl}/api/user/new-group`,
        newGroup,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Group created:", response.data);
      setGroups((prevGroups) => [...prevGroups, response.data]);
      document.body.style.cursor = "default";
      closeForm();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <button onClick={closeForm} className="close-button" type="button">
        ×
      </button>
      <input
        type="text"
        name="groupName"
        id="groupName"
        value={form.groupName}
        className="form-group mb-3"
        placeholder="Group Name"
        onChange={(e) => setForm({ ...form, groupName: e.target.value })}
      />
      <input
        ref={autocompleteRef}
        type="text"
        name="meetupPoint"
        id="meetupPoint"
        className="form-group mb-3"
        placeholder="Meetup Point"
      />
      <input
        ref={searchBoxRef}
        type="text"
        name="endLocation"
        id="endLocation"
        className="form-group mb-3"
        placeholder="End Location"
      />
      <input
        type="time"
        name="startTime"
        id="startTime"
        value={form.startTime}
        className="form-group mb-3"
        style={{ width: "50%", alignSelf: "center" }}
        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
      />
      <button type="submit" className="login-btn">
        Submit
      </button>
    </form>
  );
};

NewGroupForm.propTypes = {
  map: PropTypes.object,
  mapsApi: PropTypes.object,
  setGroups: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
};

export default NewGroupForm;
