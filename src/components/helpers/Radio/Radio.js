import React from "react";
import styles from "../../../stylesheets/input.module.css";

const defaultLabelClassName = "text-color f12 ml1 py05 text-right";

const Radio = ({
  name = "",
  onChange = (f) => f,
  defaultStyles = true,
  wrapperClassName = "",
  inputClassName = "",
  labelClassName = "",
  titleClassName = "",
  options = [],
  title = "",
}) => {
  return (
    <>
      <div
        className={[
          defaultStyles ? styles.inputWrapper : "",
          wrapperClassName,
        ].join(" ")}
      >
        <span
          className={[
            defaultStyles ? styles.inputLabel : "",
            titleClassName,
          ].join(" ")}
        >
          {title}
        </span>
        <div
          className={[defaultStyles ? styles.input : "", inputClassName].join(
            " "
          )}
        >
          {options.map((option, i) => (
            <div className="frs" key={i}>
              <input
                type="radio"
                checked={option.checked}
                className="sq15 ml1"
                name={name}
                id={option.id}
                onChange={onChange(option.name)}
              />
              <label
                htmlFor={option.id}
                className={[
                  defaultStyles ? defaultLabelClassName : "",
                  labelClassName,
                ].join(" ")}
              >
                {option.title}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Radio;
