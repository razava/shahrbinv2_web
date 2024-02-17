import React from "react";
import styles from "./styles.module.css";

const Header = ({ title = "", subTitle = "", style = {} }) => {
  return (
    <>
      <section className={styles.header} style={style}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subTitle}>{subTitle}</p>
      </section>
    </>
  );
};

export default Header;
