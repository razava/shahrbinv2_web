import React from "react";
import styles from "./style.module.css";

const TableHeader = ({ renderHeader = (f) => f, className = "" }) => {
  return (
    <>
      <div className={[styles.wrapper, className].join(" ")}>
        {renderHeader()}
      </div>
    </>
  );
};

export default TableHeader;
