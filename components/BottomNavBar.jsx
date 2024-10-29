import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faComments, faHome, faCog } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/BottomNavBar.module.css';
import { useRouter } from 'next/router';
import Requests from '../components/Requests.jsx'; 

const BottomNavBar = ({ activePage, requests = [] }) => {
  const router = useRouter();
  const [showRequests, setShowRequests] = useState(false);

  const numRequests = requests.length;

  const handleRequestsClick = () => {
    setShowRequests(!showRequests);
  };

  const navItems = {
    home: { icon: faHome, label: 'Home', path: '/groups' },
    profile: { icon: faUser, label: 'Profile', path: '/profile' },
    requests: { icon: faEnvelope, label: 'Requests', onClick: handleRequestsClick },
    chat: { icon: faComments, label: 'Chat', path: '/ChatPage' },
    settings: { icon: faCog, label: 'Settings', path: '../components/settings' },
  };

  const getNavBar = () => {
    switch (activePage) {
      case 'home':
        return ['profile', 'chat', 'settings'];
      case 'profile':
        return ['home', 'chat', 'settings'];
      case 'chat':
        return ['home', 'profile', 'settings'];
      default:
        return ['home', 'profile', 'settings'];
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