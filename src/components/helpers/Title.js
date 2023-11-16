import React from "react";
import PropTypes from "prop-types";
import styles from "../../stylesheets/title.module.css";

const Title = ({ title = "", size = 0, margin = 20 }) => {
  return (
    <div className={styles.wrapper}>
      <h1
        className={styles.title}
        style={{ fontSize: 15 + size * 10 + "px", margin: `${margin}px 0` }}
      >
        {title}
      </h1>
    </div>
  );
};

Title.propTypes = {
  title: PropTypes.string,
  size: PropTypes.number,
  margin: PropTypes.number,
};

export default Title;
