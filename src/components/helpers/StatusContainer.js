import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../../stylesheets/status.module.css";
import StatusCard from "./StatusCard";

const StatusContainer = () => {
  const [statuses, setStatuses] = useState([
    { name: "در انتظار تایید", id: 1, isActive: false },
    { name: "تایید شده", id: 2, isActive: false },
    { name: "ارجاع به واحد اجرایی", id: 3, isActive: false },
    { name: "حکم کار", id: 4, isActive: false },
    { name: "انجام شده", id: 5, isActive: false },
    { name: "رد شده", id: 6, isActive: false },
  ]);

  const handleClick = (id) => (e) => {
    const newStatuses = statuses.map((status, i) => {
      if (status.id === id) {
        status.isActive = !status.isActive;
        return status;
      } else return status;
    });
    setStatuses(newStatuses);
  };
  return (
    <div className={styles.statusWrapper}>
      <div className={styles.statuses}>
        {statuses.map((status, i) => (
          <StatusCard key={i} status={status} handleClick={handleClick} />
        ))}
      </div>
    </div>
  );
};

StatusContainer.propTypes = {};

export default StatusContainer;
