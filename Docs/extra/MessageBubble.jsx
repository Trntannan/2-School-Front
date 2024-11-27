import React from 'react';
import styles from '../styles/MessageBubble.module.css';

const MessageBubble = ({ message }) => {
  return (
    <div className={`${styles.messageBubble} ${message.self ? styles.self : ''}`}>
      {message.text}
    </div>
  );
};

export default MessageBubble;