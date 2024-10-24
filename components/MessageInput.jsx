import React, { useState } from 'react';
import styles from '../styles/MessageInput.module.css';

const MessageInput = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <form className={styles.messageInput} onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;