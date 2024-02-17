import React from "react";
import CheckBox from "../CheckBox/CheckBox";
import styles from "./dropdown.module.css";

const DropDownItem = ({
  value = "",
  title = "",
  icon = "",
  hoverIcon = "",
  id = "",
  onClick = (f) => f,
  index,
  classNames = {
    dropdownitem: "",
    title: "",
    icon: "",
  },
  isSelected,
  single,
}) => {
  // functions
  const handleClick = (e) => {
    e.stopPropagation();
    onClick({ value, title, id });
  };

  // classNames
  const wrapperClassName = [styles.dropdownitem, classNames.dropdownitem].join(
    " "
  );
  const titleClassName = [styles.dropdownitemTitle, classNames.title].join(" ");
  const iconClassName = [styles.dropdownitemIcon, classNames.icon].join(" ");
  return (
    <div className={wrapperClassName} onClick={handleClick}>
      {!single && <CheckBox checked={isSelected} />}
      <span className={titleClassName}>{title}</span>
      <span className={iconClassName}>
        <i key={`hover-icon-${index}`} className={hoverIcon}></i>
        <i key={`icon-${index}`} className={icon}></i>
      </span>
    </div>
  );
};

export default DropDownItem;
