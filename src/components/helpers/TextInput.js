import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../stylesheets/input.module.css";

const TextInput = ({
  value = "",
  title = "",
  name = "",
  type = "text",
  required = true,
  placeholder = "",
  maxLength = "",
  direction = "rtl",
  onChange = (f) => (f) => f,
  onInput = (f) => (f) => f,
  onFocus = (f) => f,
  onBlur = (f) => f,
  onClick = (f) => f,
  wrapperClassName = "",
  inputClassName = "",
  labelClassName = "",
  isValid,
  isEmpty,
  onlyDigit = false,
  decimal = false,
  focusonSelect = false,
  rtl = false,
  center = false,
  readOnly = false,
  disabled = false,
  icon = "",
  onIconClick = (f) => f,
  iconClassName = "",
  forwardWrapperRef,
  forwardInputRef,
  children,
  errorMessage = "",
  defaultStyles = true,
  autoFocus,
  renderInfo,
  min = "",
  max = "",
}) => {
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const [top, setTop] = useState(0);

  const showPassword = (e) => {
    if (inputRef.current.type === "password") {
      inputRef.current.type = "text";
    } else {
      inputRef.current.type = "password";
    }
  };

  useEffect(() => {
    const top =
      wrapperRef?.current?.offsetHeight - inputRef?.current?.offsetHeight;
    setTop(top);
  }, [wrapperRef.current, inputRef.current]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus, inputRef.current]);
  return (
    <div
      className={[
        defaultStyles ? styles.inputWrapper : "",
        wrapperClassName,
      ].join(" ")}
      ref={forwardWrapperRef ? forwardWrapperRef : wrapperRef}
    >
      {title ? (
        <label
          htmlFor={name}
          className={[
            defaultStyles ? styles.inputLabel : "",
            labelClassName,
          ].join(" ")}
        >
          {title}
          {required ? "*" : ""}
        </label>
      ) : null}
      <input
        autocomplete="chrome-off"
        autoFocus={autoFocus}
        type={type}
        ref={forwardInputRef ? forwardInputRef : inputRef}
        className={`${defaultStyles ? styles.input : ""} ${inputClassName} ${
          isValid === true
            ? "border-color"
            : isValid === false
            ? "border-error"
            : ""
        } ${isEmpty === true ? "input-error" : ""} ${
          center ? "inputCenter" : ""
        } ${rtl ? "rtl" : "ltr"}`}
        id={name}
        name={name}
        onChange={
          onChange
            ? onChange(
                name,
                onlyDigit ? onlyDigit : null,
                decimal ? decimal : null
              )
            : null
        }
        onInput={
          onInput
            ? onInput(
                name,
                onlyDigit ? onlyDigit : null,
                decimal ? decimal : null
              )
            : null
        }
        onClick={(e) => {
          if (focusonSelect) {
            e.target.select();
          }
        }}
        value={value === null ? "" : value}
        style={{ direction: direction ? `${direction}` : "" }}
        maxLength={maxLength ? maxLength : null}
        placeholder={placeholder}
        readOnly={readOnly}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        disabled={disabled}
        min={min}
        max={max}
      />
      {!isValid && <span className="text-error">{errorMessage}</span>}

      {type === "password" && (
        <span
          className="absolute pointer f12"
          style={{
            top: isNaN(top) ? 0 : top,
            height: inputRef?.current?.offsetHeight,
            left: 20,
            display: top ? "block" : "none",
          }}
          onClick={showPassword}
        >
          <i className="fas fa-eye"></i>
        </span>
      )}
      {icon && (
        <span
          className={["absolute pointer f12 h100 fcc", iconClassName].join(" ")}
          style={{
            // top: isNaN(top) ? 0 : top,
            // height: inputRef?.current?.offsetHeight,
            left: 20,
          }}
          onClick={onIconClick}
        >
          <i className={icon}></i>
        </span>
      )}
      {renderInfo && <span className={styles.info}>{renderInfo()}</span>}
      {children}
    </div>
  );
};

TextInput.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  maxLength: PropTypes.string,
  direction: PropTypes.string,
  onChange: PropTypes.func,
  onInput: PropTypes.func,
  className: PropTypes.string,
};

export default TextInput;
