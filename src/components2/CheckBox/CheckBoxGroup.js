import React, { useEffect, useState } from "react";
import CheckBox from "./CheckBox";
import styles from "./checkbox.module.css";

const CheckBoxGroup = ({
  label = "",
  onChange = (f) => f,
  name = "",
  options = [],
  defaultSelecteds = [],
  defaults,
}) => {
  //   states
  const [values, setValues] = useState(defaultSelecteds);

  const handleChange = (value, index) => {
    const newValues = values;
    newValues[index] = value;
    setValues(newValues);
    onChange(newValues, name);
  };
  console.log(defaults);
  useEffect(() => {
    if (defaults) {
      setValues(defaults);
    }
  }, []);
  return (
    <>
      <section className={styles.checkBoxGroup}>
        {label && <span className={styles.groupLabel}>{label}</span>}
        <div className={styles.checkboxes}>
          {options.map((option, i) => (
            <CheckBox
              key={option.id}
              {...option}
              onChange={(value) => handleChange(value, i)}
              checked={values[i]}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default CheckBoxGroup;
