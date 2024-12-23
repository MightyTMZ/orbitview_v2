import React from "react";
import styles from "./Explore.module.css";

const ExploreSection = () => {
  const thingsToExplore = [];
  // map through once decided

  return (
    <section id="explore" className={styles.exploreContainer}>
      <div className={styles.exploreHeader}>
        <h1>
          Explore experiences and tools
        </h1>
        <p className={styles.exploreSubtitle}>across fields</p>
      </div>
      <div className={styles.exploreItems}>
        {Array.from({ length: 9 }, (_, i) => (
          <button key={i} className={styles.item}>
            item #{i + 1}
          </button>
        ))}
        <button className={`${styles.item} ${styles.showAll}`}>Show all</button>
      </div>
    </section>
  );
};

export default ExploreSection;
