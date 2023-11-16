import React from "react";
import PropTypes from "prop-types";
import styles from "../../stylesheets/status.module.css";

const StatusCard = ({ status, handleClick = (f) => (f) => f }) => {
  return (
    <div
      onClick={handleClick(status.id)}
      className={[styles.status, status.isActive ? styles.active : ""].join(
        " "
      )}
    >
      <span>{status.name}</span>
    </div>
  );
};

StatusCard.propTypes = {};

export default StatusCard;
