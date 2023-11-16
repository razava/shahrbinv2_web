import React, { useState } from "react";
import styles from "../../stylesheets/filters.module.css";

const ScatterMapAccordion = ({ condition, children }) => {
  const [className, setClassName] = useState("");
  const toggleClassName = (e) => {
    if (condition) {
      setClassName("op1");
    } else {
      setClassName("op0");
    }
  };

  return (
    <>
      <div
        className={[
          styles.accordion,
          className,
          condition ? styles.accordionOpen : "",
        ].join(" ")}
        onTransitionEnd={toggleClassName}
      >
        {children}
      </div>
    </>
  );
};

export default ScatterMapAccordion;
