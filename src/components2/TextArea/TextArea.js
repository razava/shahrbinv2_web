import React, { useRef } from "react";
import { cn } from "../../utils/functions";
import styles from "./styles.module.css";

const TextArea = ({
  placeholder = "",
  classNames = {
    wrapper: "",
    input: "",
    label: "",
    error: "",
    inputWrapper: "",
  },
  style = {
    wrapper: {},
    input: {},
    label: {},
    error: {},
    inputWrapper: {},
  },
  onChange = (f) => f,
  name = "",
  englishOnly = false,
  digitsOnly = false,
  value,
  defaultValue,
  maxLength = "",
  label = "",
  error = false,
  errorMessage = "",
}) => {
  // refs
  const inputRef = useRef(null);

  // classNames
  const wrapperClassName = [styles.wrapper, classNames.wrapper].join(" ");
  const inputClassName = [
    styles.input,
    classNames.input,
    error ? styles.error : "",
  ].join(" ");
  const labelClassName = [styles.label, classNames.label].join(" ");
  const errorClassName = [styles.error, classNames.error].join(" ");

  //   functions
  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "") return onChange(e.target.value, name);
    if (englishOnly) {
      if (/[A-Za-z][A-Za-z0-9]*/.test(value) || /\d+/.test(value)) {
        if (digitsOnly) {
          if (/^\d+/.test(value)) {
            onChange(e.target.value, name);
          }
        } else {
          onChange(e.target.value, name);
        }
      }
    } else {
      if (digitsOnly) {
        if (/^\d+/.test(value)) {
          onChange(e.target.value, name);
        }
      } else {
        onChange(e.target.value, name);
      }
    }
  };

  return (
    <>
      <section className={wrapperClassName} style={style.wrapper}>
        {label && (
          <span className={labelClassName} style={style.label}>
            {label}
          </span>
        )}
        <div
          className={cn(styles.inputWrapper, classNames.inputWrapper)}
          style={style.inputWrapper}
        >
          <textarea
            placeholder={placeholder}
            className={inputClassName}
            onChange={onChange ? handleChange : undefined}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            ref={inputRef}
            style={style.input}
          />
        </div>
        {error && (
          <span className={errorClassName} style={style.error}>
            {errorMessage}
          </span>
        )}
      </section>
    </>
  );
};

export default TextArea;
