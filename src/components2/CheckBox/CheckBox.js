import React, { useEffect, useState } from "react";
import styles from "./checkbox.module.css";

const getSizeStyle = (size) => {
  switch (size) {
    case "small":
      return styles.small;
    case "medium":
      return styles.medium;
    case "large":
      return styles.large;
    default:
      return styles.small;
  }
};

const CheckBox = ({
  checked = false,
  disabled = false,
  size = "medium",
  name = "",
  onChange = (f) => f,
  title = "",
  classNames = {
    wrapper: "",
    checkboxShow: "",
    checkboxHide: "",
    iconShow: "",
    iconHide: "",
    label: "",
  },
}) => {
  //   states
  //  ** flags
  const [isChecked, setIsChecked] = useState(checked);
  console.log(isChecked);
  // styles
  const sizeStyle = getSizeStyle(size);
  const checkBoxWrapperClassName = [
    styles.wrapper,
    disabled ? styles.disabled : "",
    classNames.wrapper,
  ].join(" ");
  const checkBoxClassName = [
    styles.checkbox,
    sizeStyle,
    isChecked ? styles.show : styles.hide,
    isChecked ? classNames.checkboxShow : classNames.checkboxHide,
  ].join(" ");
  const checkIconClassName = [
    styles.checkIcon,
    sizeStyle,
    isChecked ? styles.show : styles.hide,
    isChecked ? classNames.iconShow : classNames.iconHide,
  ].join(" ");
  const labelClassName = [styles.label, sizeStyle, classNames.label].join(" ");

  //   functions
  const onCheckBoxClick = () => {
    if (disabled) return;
    setIsChecked(!isChecked);
    onChange({ title, checked: !isChecked }, name);
  };

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  //   renders
  const renderLabel = () =>
    title ? <span className={labelClassName}>{title}</span> : null;
  return (
    <>
      <section className={checkBoxWrapperClassName} onClick={onCheckBoxClick}>
        <span className={checkBoxClassName}>
          <span className={checkIconClassName}>
            <i className="fas fa-check"></i>
          </span>
        </span>
        {renderLabel()}
      </section>
    </>
  );
};

export default CheckBox;
