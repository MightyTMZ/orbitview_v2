import React from "react";
import styles from './MessageButton.module.css';

const MessageButton = () => {
  return (
    <button className={styles.messageButton} disabled>
      Message
      <span className={styles.tooltip}>Messaging feature coming soon to OrbitView!</span>
    </button>
  );
};

export default MessageButton;
