import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../../stylesheets/filters.module.css";

const FiltersAccordion = ({ condition, children, expandable = true }) => {
  const [className, setClassName] = useState("");
  const toggleClassName = (e) => {
    if (condition) {
      setClassName("op1");
    } else {
      setClassName("op0");
    }
  };
  return (
    <div
      className={[
        styles.accordion,
        className,
        condition ? styles.accordionOpen : "",
        expandable ? "" : styles.notExpandable
      ].join(" ")}
      onTransitionEnd={toggleClassName}
    >
      {children}
    </div>
  );
};

FiltersAccordion.propTypes = {};

export default FiltersAccordion;
