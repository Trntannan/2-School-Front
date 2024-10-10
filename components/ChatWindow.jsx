import React from 'react';
import styles from '../styles/ChatWindow.module.css';
import MessageBubble from './MessageBubble';


const ChatWindow = ({ activeConversation }) => {
  return (
    <div className={styles.chatWindow}>
      {activeConversation.messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
    </div>
  );
};

export default ChatWindow;