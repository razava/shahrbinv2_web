import React, { useEffect, useState } from "react";
import Radio from "./Radio";
import styles from "./radio.module.css";

const getRowStyle = (horizontal) => {
  if (horizontal) return styles.horizontal;
  else return styles.vertical;
};

const RadioGroup = ({
  label = "",
  nameKey = "title",
  valueKey = "value",
  name = "",
  defaultValue = {},
  options = [],
  horizontal = true,
  onChange = (f) => f,
  disabled = false,
}) => {
  // states
  // ** data
  const [selected, setSelected] = useState(defaultValue);
  // console.log(defaultValue);
  // styles
  const rowStyle = getRowStyle(horizontal);
  const wrapperClassName = [
    styles.wrapper,
    disabled ? styles.disabled : "",
  ].join(" ");
  const containerClassName = [styles.container, rowStyle].join(" ");
  const labelClassName = [styles.label].join(" ");

  useEffect(() => {
    if (defaultValue != {}) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);
  //   functions
  const onRadioClick = (option) => {
    setSelected(option);
    onChange(option, name);
  };
  console.log(options);
  return (
    <>
      <section className={wrapperClassName}>
        <span className={labelClassName}>{label}</span>
        <div className={containerClassName}>
          {options.map((option) => (
            <Radio
              key={option.id}
              option={option}
              checked={selected[valueKey] === option[valueKey]}
              nameKey={nameKey}
              onRadioClick={onRadioClick}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default RadioGroup;
