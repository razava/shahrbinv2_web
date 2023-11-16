import React from "react";
import dropdownStyles from "../../../stylesheets/dropdown.module.css";

const DropDownItem = ({
  value = "",
  title = "",
  icon = "",
  hoverIcon = "",
  onClick = (f) => f,
  index,
}) => {
  return (
    <div className={dropdownStyles.dropdownitem} onClick={() => onClick(value)}>
      <span>{title}</span>
      <span className={dropdownStyles.dropdownicon}>
        <i key={`hover-icon-${index}`} className={hoverIcon}></i>
        <i key={`icon-${index}`} className={icon}></i>
      </span>
    </div>
  );
};

export default DropDownItem;
