import React from "react";
import useFields from "../../../assets2/hooks/useFields";
import CheckBox from "../../CheckBox/CheckBox";
import styles from "../styles.module.css";

const CheckBoxField = ({
  fieldName = "",
  fieldLabel = "",
  options = [],
  props = {},
}) => {
  // hooks
  const { addChange } = useFields();

  const handleChange = (value, option) => {
    addChange({ [option.value]: value.checked });
  };

  return (
    <>
      <section className={styles.group}>
        <span className={styles.label}>{fieldLabel}</span>
        <div className={styles.otherOptions}>
          {options.map((option) => (
            <CheckBox
              key={option.id}
              onChange={(value) => handleChange(value, option)}
              title={option.title}
              checked={props[option.value]}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default CheckBoxField;
