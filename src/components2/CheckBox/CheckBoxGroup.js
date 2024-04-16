import React, { useEffect, useState } from "react";
import CheckBox from "./CheckBox";
import styles from "./checkbox.module.css";

const CheckBoxGroup = ({
  label = "",
  onChange = (f) => f,
  name = "",
  options = [],
  defaultSelecteds = [],
  defaults = [],
  readOnly = false,
}) => {
  //   states
  const [values, setValues] = useState(defaults);

  console.log(readOnly);

  const handleChange = (value, index) => {
    const newValues = values;
    newValues[index] = value;
    setValues(newValues);
    onChange(newValues, name);
  };
  console.log(defaults);
  // useEffect(() => {
  //   if (defaults) {
  //     console.log("defaults", defaults);
  //     setValues(defaults);
  //   }
  // }, [defaults]);

  return (
    <>
      <section className={styles.checkBoxGroup}>
        {label && <span className={styles.groupLabel}>{label}</span>}
        <div className={styles.checkboxes}>
          {options.map((option, i) => (
            <CheckBox
              key={option.id}
              {...option}
              disabled={readOnly}
              onChange={(value) => {
                if (!readOnly) {
                  handleChange(value, i);
                }
              }}
              defaultChecked={defaults[i]?.checked}
              checked={values[i]?.checked || false}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default CheckBoxGroup;
