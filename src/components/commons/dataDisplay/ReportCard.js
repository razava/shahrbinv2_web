import React from "react";
import { fixDigit } from "../../../helperFuncs";
import styles from "../../../stylesheets/infowidget.module.css";

const ReportCard = ({ icon = "", title = "", value = "" }) => {
  return (
    <div className={styles.infoWidget}>
      <span className={styles.infoIcon}>
        <i className={icon}></i>
      </span>
      <div className={styles.info}>
        <span className={styles.infoTitle}>{title}</span>
        <span className={styles.infoValue}>{fixDigit(value)}</span>
      </div>
    </div>
  );
};

export default ReportCard;
