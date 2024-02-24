import React, { useEffect, useState } from "react";
import CheckBox from "./CheckBox";
import styles from "./style.module.css";

const CheckBoxGroup = ({
  onChange = (f) => f,
  items = [],
  title = "",
  wrapperClassName = "",
  labelClassName = "",
}) => {
  const [checkeds, setCheckeds] = useState([]);
  const handleChange = (value, id) => {
    const exists = checkeds.findIndex((c) => c === id) !== -1;
    if (exists) {
      const newCheckeds = checkeds.filter((c) => c !== id);
      setCheckeds(newCheckeds);
      onChange(newCheckeds);
    } else {
      const newCheckeds = [...checkeds, id];
      setCheckeds(newCheckeds);
      onChange(newCheckeds);
    }
  };

  useEffect(() => {
    const checkeds = items
      .filter((item) => item.checked)
      .map((item) => item.id);
    setCheckeds(checkeds);
  }, [items]);

  return (
    <>
      <div className={[styles.wrapper, wrapperClassName].join(" ")}>
        <span className={[styles.title, labelClassName].join(" ")}>
          {title}
        </span>
        {items.map((item) => (
          <CheckBox
            key={item.id}
            id={item.id}
            label={item.label}
            onChange={handleChange}
            checked={checkeds.findIndex((c) => c === item.id) !== -1}
            wrapperClassName={item.wrapperClassName}
            inputClassName={item.inputClassName}
            labelClassName={item.labelClassName}
          />
        ))}
      </div>
    </>
  );
};

export default CheckBoxGroup;
