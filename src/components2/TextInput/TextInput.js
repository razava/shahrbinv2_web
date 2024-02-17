import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/functions";
import Icon from "../Icon/Icon";
import styles from "./style.module.css";

const TextInput = ({
  icon = "",
  type = "",
  placeholder = "",
  classNames = {
    wrapper: "",
    inputWrapper: "",
    input: "",
    icon: "",
    label: "",
    error: "",
    controls: "",
    control: "",
  },
  onChange,
  onClick = (f) => f,
  onFocus = (f) => f,
  onBlur = (f) => f,
  onIconClick = (f) => f,
  name = "",
  englishOnly = false,
  digitsOnly = false,
  editable = true,
  disabled = false,
  value,
  defaultValue,
  maxLength = "",
  label = "",
  error = false,
  errorMessage = "",
  controls = false,
  step = 1,
  precision = 1,
  style = {
    wrapper: {},
    inputWrapper: {},
    input: {},
    icon: {},
    label: {},
  },
  forwardRef = {},
}) => {
  // refs
  const inputRef = useRef(null);
  forwardRef.current = inputRef?.current;

  // classNames
  const wrapperClassName = [styles.wrapper, classNames.wrapper].join(" ");
  const iconClassName = [styles.icon, classNames.icon].join(" ");
  const inputWrapperClassName = [
    styles.inputWrapper,
    classNames.inputWrapper,
  ].join(" ");
  const inputClassName = [styles.input, classNames.input].join(" ");
  const labelClassName = [styles.label, classNames.label].join(" ");
  const errorClassName = [styles.error, classNames.error].join(" ");
  const controlsClassName = [styles.controls, classNames.controls].join(" ");
  const controlClassName = [styles.control, classNames.control].join(" ");
  console.log(placeholder);
  console.log(inputRef.current?.value);
  //   functions  
  const handleChange = (e) => {
    const value = e.target.value;
    console.log(value);
    if (value === "") return onChange?.(e.target.value, name);
    if (englishOnly) {
      if (/[A-Za-z][A-Za-z0-9]*/.test(value) || /\d+/.test(value)) {
        if (digitsOnly) {
          if (/^\d+/.test(value)) {
            onChange?.(e.target.value, name);
          }
        } else {
          onChange?.(e.target.value, name);
        }
      }
    } else {
      onChange?.(e.target.value, name);
    }
  };

  const handleFocus = (e) => {
    onFocus(e);
  };

  const handleBlur = (e) => {
    onBlur(e);
  };

  const increment = (e) => {
    e.stopPropagation();
    const change = step / Math.pow(10, precision);
    const changeTo = value
      ? parseFloat(value) + parseFloat(change)
      : parseFloat(change);
    onChange?.(changeTo.toFixed(precision), name);
  };

  const decrement = (e) => {
    e.stopPropagation();
    const change = step / Math.pow(10, precision);
    const changeTo = parseFloat(value)
      ? parseFloat(value) - parseFloat(change)
      : 0;
    onChange?.(changeTo.toFixed(precision), name);
  };
  return (
    <>
      <section className={wrapperClassName} style={style.wrapper}>
        {label && (
          <span className={labelClassName} style={style.label}>
            {label}
          </span>
        )}
        <div className={inputWrapperClassName} style={style.inputWrapper}>
          <input
            type={type}
            placeholder={placeholder}
            className={inputClassName}
            onChange={onChange || englishOnly ? handleChange : undefined}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            readOnly={!editable}
            disabled={disabled}
            ref={inputRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={onClick}
            style={style.input}
          />
          {icon && (
            <Icon
              name={icon}
              onClick={onIconClick}
              classNames={{ icon: cn(styles.icon, classNames.icon) }}
            />
          )}
        </div>
        {error && <span className={errorClassName}>{errorMessage}</span>}

        {controls && (
          <span className={controlsClassName}>
            <span
              className={controlClassName}
              key={"plus-control"}
              onClick={increment}
            >
              <i className="fa-solid fa-plus"></i>
            </span>
            <span
              className={controlClassName}
              key={"minus-control"}
              onClick={decrement}
            >
              <i className="fa-solid fa-minus"></i>
            </span>
          </span>
        )}
      </section>
    </>
  );
};

export default TextInput;
