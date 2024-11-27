import React, { useState } from "react";
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
import Requests from "../components/Requests.jsx";

const BottomNavBar = ({ activePage = [] }) => {
  const router = useRouter();
  const [showRequests, setShowRequests] = useState(false);

  const requests = [
    {
      id: 1,
      name: "John Doe",
      profilePic: "https://picsum.photos/200/300",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.",
    },
    {
      id: 2,
      name: "Jane Smith",
      profilePic: "https://picsum.photos/200/301",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex. Phasellus malesuada massa sed purus convallis, sed bibendum ex viverra.",
    },
    {
      id: 3,
      name: "Bob Johnson",
      profilePic: "https://picsum.photos/200/302",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex. Phasellus malesuada massa sed purus convallis, sed bibendum ex viverra. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
    },
  ];

  const numRequests = requests.length;

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
            {item === "requests" && numRequests > 0 && (
              <span className={`${styles.indicator} `}>{numRequests}</span>
            )}
          </div>
        ))}
      </div>
      {showRequests && (
        <Requests
          requests={requests}
          onAccept={(id) => {
            console.log(`Accepted request with ID: ${id}`);
            setShowRequests(false);
          }}
          onRefuse={(id) => {
            console.log(`Refused request with ID: ${id}`);
            setShowRequests(false);
          }}
        />
      )}
    </>
  );
};

export default BottomNavBar;
