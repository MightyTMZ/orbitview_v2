"use client";

import React, { useState } from "react";
import styles from "./ImmersiveText.module.css";

const ImmersiveText = () => {
  const [isTextImmersive, setIsTextImmersive] = useState(false);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.text} ${
          isTextImmersive ? styles["stereoscopic-mode"] : ""
        }`}
      >
        Click the toggle switch to experience immersive text on OrbitView!
      </div>
      <p style={{ fontSize: "11px" }} className="mb-4">
        Put on some 3D goggles for the best experience...
      </p>
      <div
        className={styles.toggleSwitch}
        onClick={() => setIsTextImmersive(!isTextImmersive)}
      >
        <div
          className={`${styles.toggleThumb} ${
            isTextImmersive ? styles.active : ""
          }`}
        ></div>
      </div>
    </div>
  );
};

export default ImmersiveText;
