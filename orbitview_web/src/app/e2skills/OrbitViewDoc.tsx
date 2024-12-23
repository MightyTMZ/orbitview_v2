import React, { ReactNode } from "react";
import styles from "./OrbitViewDoc.module.css"

// Server side component, but they can
// go to a /interactive endpoint for the OV doc which they can customize like crazy

interface Props {
  title: string;
  children: ReactNode;
  is_first: boolean;
}

const OrbitViewDoc = (props: Props) => {
  return (
    <main className={styles.mainContent}>
      <h1 className={styles.heading}>{props.title}</h1>
      <div className={styles.buttonGrid}>
        <button className={styles.button}>&lt; {props.is_first ? "Home" : "Previous"}</button>
        <button className={styles.button}>Next &gt;</button>
      </div>
      <section id="content">{props.children}</section>
    </main>
  );
};

export default OrbitViewDoc;
