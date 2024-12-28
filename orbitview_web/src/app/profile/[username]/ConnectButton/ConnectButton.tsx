import React from "react";
import styles from "./ConnectButton.module.css";

const ConnectButton = () => {
  return (
    <button className={styles.connectButton} disabled>
      Connect
      <span className={styles.tooltip}>
        Connecting feature coming soon to OrbitView!
      </span>
    </button>
  );
};

export default ConnectButton;
