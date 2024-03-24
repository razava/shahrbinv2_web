import React from "react";
import styles from "../../stylesheets/input.module.css";

const Textarea = ({
  name = "",
  title = "",
  value = "",
  handleChange = (f) => (f) => f,
  placeholder = "",
  wrapperStyle = {},
  wrapperClassName = "",
  inputClassName = "",
  labelClassName = "",
  readOnly = false,
  defaultStyles = true,
  required = false,
  resize = true,
  ref = null,
}) => {
  return (
    <div
      className={[
        defaultStyles ? styles.inputWrapper : "",
        wrapperClassName,
      ].join(" ")}
      style={wrapperStyle}
    >
      {title && (
        <label
          htmlFor={name}
          className={[
            defaultStyles ? styles.inputLabel : "",
            labelClassName,
          ].join(" ")}
        >
          {title}
        </label>
      )}
      <textarea
        required={required}
        value={value}
        name={name}
        id={name}
        style={{ resize: resize ? "vertical" : "none" }}
        className={[defaultStyles ? styles.input : "", inputClassName].join(
          " "
        )}
        onChange={handleChange(name)}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={ref}
      />
    </div>
  );
};

Textarea.propTypes = {};

export default Textarea;
