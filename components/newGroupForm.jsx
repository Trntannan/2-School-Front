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

  useEffect(() => {
    const initAutocomplete = () => {
      if (mapsApi && mapsApi.places) {
        const autocomplete = new mapsApi.places.Autocomplete(autocompleteRef.current, { types: ["geocode"] });
        autocomplete.addListener("place_changed", handlePlaceChanged(autocomplete, "meetupPoint"));

        const searchBox = new mapsApi.places.SearchBox(searchBoxRef.current);
        searchBox.addListener("places_changed", handleSearchBoxChanged(searchBox));
      }
    };

    if (mapsApi) {
      initAutocomplete();
    }
  }, [mapsApi]);

  const handlePlaceChanged = (autocomplete, field) => () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const location = place.geometry.location;
      setForm((prevForm) => ({ ...prevForm, [field]: `${location.lat()},${location.lng()}` }));
      new mapsApi.Marker({ position: location, map: map });
    }
  };

  const handleSearchBoxChanged = (searchBox) => () => {
    const places = searchBox.getPlaces();
    if (!places.length) return;

    const place = places[0];
    if (place.geometry) {
      const location = place.geometry.location;
      setForm((prevForm) => ({ ...prevForm, schoolLocation: `${location.lat()},${location.lng()}` }));
      new mapsApi.Marker({ position: location, map: map });
      calculateRoute({ ...form, schoolLocation: `${location.lat()},${location.lng()}` }, form.meetupPoint);
    }
  };

  const calculateRoute = (formValues, newMeetupPoint) => {
    const directionsService = new mapsApi.DirectionsService();
    const meetupPoint = newMeetupPoint || formValues.meetupPoint;
    const schoolLocation = formValues.schoolLocation;

    if (meetupPoint && schoolLocation && mapsApi) {
      directionsService.route(
        {
          origin: meetupPoint,
          destination: schoolLocation,
          travelMode: "WALKING",
        },
        (result, status) => {
          if (status === mapsApi.DirectionsStatus.OK) {
            const distance = result.routes[0].legs[0].distance.text;
            const duration = result.routes[0].legs[0].duration.text;
            setRouteInfo({ distance, duration });
          } else {
            console.error("Error calculating route:", status);
          }
        }
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.post("/api/groups", { userId, groupData: form });
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
          onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
          required
        />
      </div>
      <div>
        <label htmlFor="meetupPoint">Meetup/Start Point:</label>
        <input
          type="text"
          id="meetupPoint"
          name="meetupPoint"
          ref={autocompleteRef}
          defaultValue={form.meetupPoint}
          onBlur={() => calculateRoute(form)}
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
          onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
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
          defaultValue={form.schoolLocation}
          onBlur={() => calculateRoute(form)}
          required
        />
      </div>
      <div ref={map} style={{ height: "100px", width: "100%" }} />
      <div>
        <label htmlFor="startTime">Start Time:</label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
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