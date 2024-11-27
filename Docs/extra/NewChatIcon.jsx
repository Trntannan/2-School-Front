import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/NewChatIcon.module.css';

const NewChatIcon = ({ onClick }) => {
  return (
    <div className={styles.newChatIcon} onClick={onClick}>
      <FontAwesomeIcon icon={faPlus} />
    </div>
  );
};

export default NewChatIcon;