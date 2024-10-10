import React, { useState } from 'react';
import styles from '../styles/ChatPage.module.css';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import NewChatIcon from '../components/NewChatIcon';
import BottomNavBar from '../components/BottomNavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const ChatPage = () => {
  const [conversations] = useState([
    { id: 1, name: 'John Doe', profilePic: '../images/raccoon.jpg', isOnline: true, messages: [{ text: 'Hello!', self: false }, { text: 'Hi John!', self: true }] },
    { id: 2, name: 'Jane Smith', profilePic: '../images/ratish.jpg', isOnline: false, messages: [{ text: 'How are you?', self: false }, { text: 'I am good, thanks!', self: true }] }
  ]);

  const [activeConversation, setActiveConversation] = useState(null);

  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
  };

  const sendMessage = (text) => {
    setActiveConversation(prev => ({
      ...prev,
      messages: [...prev.messages, { text, self: true }]
    }));
  };

  return (
    <div className={styles.chatPage}>
      <div className={`${styles.header} ${activeConversation ? styles.headerActive : ''}`}>
        {activeConversation ? (
          <>
            <FontAwesomeIcon icon={faChevronLeft} className={styles.backIcon} onClick={() => setActiveConversation(null)} />
            <div className={styles.headerTitle}>
                <h2>Chats</h2>
            </div>
          </>
        ) : (
          <>
            <div className={styles.headerTitle}>
                <h2>Chats</h2>
            </div>
            <NewChatIcon onClick={() => alert('Start new chat')} />
          </>
        )}
      </div>
      {activeConversation ? (
        <div className={styles.chatArea}>
          <ChatWindow activeConversation={activeConversation} />
          <MessageInput sendMessage={sendMessage} />
        </div>
      ) : (
        <ChatSidebar conversations={conversations} selectConversation={selectConversation} />
      )}
      <BottomNavBar activePage="chat" />
    </div>
  );
};

export default ChatPage;