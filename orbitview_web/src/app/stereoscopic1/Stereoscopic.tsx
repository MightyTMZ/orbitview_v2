import React from 'react';
import styles from './Stereoscopic.module.css';

const OrbitViewStereoscopic: React.FC = () => {
  return (
    <div className={styles.stereoContainer}>
      <h1 className={styles.orbitViewText}>OrbitView</h1>
      <p className={styles.orbitViewSubtitle}>
        Redefining Connections. Immersive Experiences. Limitless Possibilities.
      </p>
    </div>
  );
};

export default OrbitViewStereoscopic;
