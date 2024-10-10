import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faComments, faHome } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/BottomNavBar.module.css';
import { useRouter } from 'next/router';

const BottomNavBar = ({ activePage }) => {
  const router = useRouter();

  const navItems = {
    home: { icon: faHome, label: 'Home', path: '/groups' },
    profile: { icon: faUser, label: 'Profile', path: '/userProfile' },
    requests: { icon: faEnvelope, label: 'Requests', path: '/requests' },
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
    <div className={styles.navbar}>
      {getNavBar().map((item, idx) => (
        <div key={idx} className={styles.navitem} onClick={() => router.push(navItems[item].path)}>
          <FontAwesomeIcon icon={navItems[item].icon} />
          <span>{navItems[item].label}</span>
        </div>
      ))}
    </div>
  );
};

export default BottomNavBar;