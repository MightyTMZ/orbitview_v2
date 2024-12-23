import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.spinnerBody}>
      <div className={styles.orbitContainer}>
        <div className={styles.planet}></div>
        <div className={`${styles.orbitRing} ${styles.ring1}`}></div>
        <div className={`${styles.orbitRing} ${styles.ring2}`}></div>
        <div className={`${styles.orbitObject} ${styles.object1}`}></div>
        <div className={`${styles.orbitObject} ${styles.object1}`}></div>
      </div>
    </div>
  );
};

export default Spinner;
