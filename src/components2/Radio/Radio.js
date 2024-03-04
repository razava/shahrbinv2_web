import React from "react";
import styles from "./radio.module.css";

const Radio = ({
  checked = true,
  onRadioClick = (f) => f,
  option = {},
  nameKey = "",
}) => {
  const radioClassName = [styles.radio, checked ? styles.checked : ""].join(
    " "
  );
  console.log(option);
  return (
    <>
      <div className={styles.radioWrapper} onClick={() => onRadioClick(option)}>
        <div className={radioClassName}>
          <div></div>
        </div>
        <span className={styles.radioLabel}>{option[nameKey]}</span>
      </div>
    </>
  );
};

export default Radio;
