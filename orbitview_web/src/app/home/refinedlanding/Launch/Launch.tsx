import React from "react";
import styles from "./Launch.module.css";

const Launch = () => {
  return (
    <section id="launch">
      <div className={styles.container}>
        <h1 className={styles.title}>Launch Projects for the world to see!</h1>
        <p className={styles.description}>
          Showcase your startup, side hustle, or creative project and connect with
          people who can help scale it.
        </p>
        <button className={styles.button}>Post your project</button>
      </div>
    </section>
  );
};

export default Launch;
