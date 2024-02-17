import React from "react";
import styles from "./styles.module.css";

const Message = ({ title = "", description = "" }) => {
  return (
    <>
      <section className={styles.message}>
        <h1 className={styles.messageTitle}>{title}</h1>
        <p className={styles.messageDescription}>{description}</p>
      </section>
    </>
  );
};

export default Message;
