import React from "react";
import styles from "./style.module.css";

const Indetermine = () => {
  return (
    <>
      <div className={styles.progressBar}>
        <div className={styles.progressBarValue}></div>
      </div>
    </>
  );
};

export default Indetermine;
