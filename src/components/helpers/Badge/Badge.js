import React from "react";
import styles from "./style.module.css";

const Badge = ({ count = 0, className = "", isActive }) => {
  return (
    <>
      <span
        className={[
          styles.badge,
          isActive ? "" : styles.notActive,
          className,
        ].join(" ")}
      >
        {count}
      </span>
    </>
  );
};

export default Badge;
