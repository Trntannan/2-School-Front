import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faComments, faHome } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/BottomNavBar.module.css';
import { useRouter } from 'next/router';
import Requests from '../components/Requests.jsx'; // Import the Requests component

const BottomNavBar = ({ activePage, requests = [] }) => {
  const router = useRouter();
  const [showRequests, setShowRequests] = useState(false);

  // Calculate the number of new requests
  const numRequests = requests.length;

  const handleRequestsClick = () => {
    setShowRequests(!showRequests);
  };

  const navItems = {
    home: { icon: faHome, label: 'Home', path: '/groups' },
    profile: { icon: faUser, label: 'Profile', path: '/userProfile' },
    requests: { icon: faEnvelope, label: 'Requests', onClick: handleRequestsClick },
    chat: { icon: faComments, label: 'Chat', path: '/ChatPage' },
  };

  const getNavBar = () => {
    switch (activePage) {
      case 'home':
        return ['profile', 'requests', 'chat'];
      case 'profile':
        return ['home', 'requests', 'chat'];
      case 'chat':
        return ['home', 'requests', 'profile'];
      default:
        return ['home', 'requests', 'chat'];
    }
  };

  return (
    <>
      <div className={styles.navbar}>
        {getNavBar().map((item, idx) => (
          <div
            key={idx}
            className={`${styles.navitem} ${item === 'requests' ? styles.navitemRequests : ''}`}
            onClick={navItems[item].onClick || (() => router.push(navItems[item].path))}
          >
            <FontAwesomeIcon icon={navItems[item].icon} />
            <span>{navItems[item].label}</span>
            {item === 'requests' && numRequests > 0 && (
              <span className={styles.indicator}>{numRequests}</span>
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