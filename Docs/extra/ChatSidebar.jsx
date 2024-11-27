import React from 'react';
import styles from '../styles/ChatSidebar.module.css';

const ChatSidebar = ({ conversations, selectConversation }) => {
  return (
    <div className={styles.sidebar}>
      <input type="text" placeholder="Search..." className={styles.search} />
      {conversations.map((conversation, index) => (
        <div 
          key={index} 
          className={styles.conversation}
          onClick={() => selectConversation(conversation)}>
          <img src={conversation.profilePic} alt={conversation.name} className={styles.profilePic} />
          <div className={styles.details}>
            <div className={styles.name}>
              {conversation.name}
              {conversation.isOnline && <span className={styles.onlineIndicator}></span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;