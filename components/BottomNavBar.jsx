import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faComments,
  faHome,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/BottomNavBar.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import Requests from "../components/Requests.jsx";

const backendUrl = "https://two-school-backend.onrender.com";

const BottomNavBar = ({ activePage = [] }) => {
  const router = useRouter();
  const [showRequests, setShowRequests] = useState(false);
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestsClick = () => {
    setShowRequests(!showRequests);
  };

  const navItems = {
    home: { icon: faHome, label: "Groups", path: "/groups" },
    profile: { icon: faUser, label: "Profile", path: "/profile" },
    requests: {
      icon: faEnvelope,
      label: "Requests",
      onClick: handleRequestsClick,
    },
    chat: { icon: faComments, label: "Chat", path: "/ChatPage" },
    settings: { icon: faCog, label: "Settings", path: "/settings" },
  };

  const getNavBar = () => {
    switch (activePage) {
      case "Groups":
        return ["profile", "requests", "settings"];
      case "Profile":
        return ["home", "requests", "settings"];
      case "Chat":
        return ["home", "profile", "settings"];
      case "Settings":
        return ["home", "profile", "requests"];
      default:
        return ["home", "profile", "settings"];
    }
  };

  const requestsRef = React.createRef();

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (requestsRef.current && !requestsRef.current.contains(event.target)) {
        setShowRequests(false);
      }
    };

    document.body.addEventListener("click", handleDocumentClick);
    return () => {
      document.body.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    if (showRequests) {
      setShowRequests(false);
    }
  }, [activePage]);

  return (
    <>
      <div className={styles.navbar}>
        {getNavBar().map((item, idx) => (
          <div
            key={idx}
            className={`${styles.navitem} ${
              item === "requests" ? styles.navitemRequests : ""
            }`}
            onClick={
              navItems[item].onClick || (() => router.push(navItems[item].path))
            }
          >
            <FontAwesomeIcon icon={navItems[item].icon} />
            <span>{navItems[item].label}</span>
            {item === "requests" && requests.length > 0 && (
              <span className={styles.indicator}>{requests.length}</span>
            )}
          </div>
        ))}
      </div>
      {showRequests && (
        <div ref={requestsRef}>
          <Requests requests={requests} onRequestUpdate={fetchRequests} />
        </div>
      )}
    </>
  );
};

export default BottomNavBar;
