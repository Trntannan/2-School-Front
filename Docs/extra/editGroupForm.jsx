import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const backendUrl = "https://two-school-backend.onrender.com" || 5000;

const EditGroupForm = ({ map, mapsApi, groupData, setGroups, closeForm }) => {
  const [form, setForm] = useState({
    groupName: groupData.name || "",
    meetupPoint:
      `${groupData.routes[0].start.latitude},${groupData.routes[0].start.longitude}` ||
      "",
    endLocation:
      `${groupData.routes[0].end.latitude},${groupData.routes[0].end.longitude}` ||
      "",
    startTime: groupData.startTime
      ? new Date(groupData.startTime).toTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    isActive: groupData.isActive || false,
  });

  const autocompleteRef = useRef(null);
  const searchBoxRef = useRef(null);
  const meetupMarker = useRef(null);
  const schoolMarker = useRef(null);

  useEffect(() => {
    if (mapsApi) {
      initAutocomplete();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedGroup = {
        name: form.groupName,
        startTime: form.startTime,
        isActive: form.isActive,
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

      const response = await axios.put(
        `${backendUrl}/api/user/edit-group`,
        updatedGroup,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          data: { groupId: groupData._id },
        }
      );

      console.log("Group updated:", response.data);
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === response.data._id ? response.data : group
        )
      );

      closeForm();
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
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
        defaultValue={form.meetupPoint}
      />
      <input
        ref={searchBoxRef}
        type="text"
        name="endLocation"
        id="endLocation"
        className="form-group mb-3"
        placeholder="End Location"
        defaultValue={form.endLocation}
      />
      <input
        type="time"
        name="startTime"
        id="startTime"
        value={form.startTime}
        className="form-group mb-3"
        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
      />
      <div className="form-group mb-3">
        <label>
          Active:
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
        </label>
      </div>
      <button type="submit" className="login-btn">
        Update
      </button>
    </form>
  );
};

EditGroupForm.propTypes = {
  map: PropTypes.object,
  mapsApi: PropTypes.object,
  groupData: PropTypes.object.isRequired,
  setGroups: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
};

export default EditGroupForm;
