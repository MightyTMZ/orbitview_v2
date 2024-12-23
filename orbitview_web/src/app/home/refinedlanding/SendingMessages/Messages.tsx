import React from "react";
import styles from "./Message.module.css";

const MessagingFeatures = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Innovative Messaging at Your Fingertips</h2>
      <p className={styles.description}>
        OrbitView’s next-generation messaging system lets you connect,
        collaborate, and innovate with ease.
      </p>
      <ul className={styles.featuresList}>
        <li>Real-time collaboration tools integrated directly into chats</li>
        <li>
          AI-driven suggestions to streamline communication and project
          management
        </li>
        <li>End-to-end encryption ensuring your conversations stay private</li>
      </ul>
    </div>
  );
};

export default MessagingFeatures;
