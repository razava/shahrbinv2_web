import React from "react";
import PropTypes from "prop-types";
import styles from "../../stylesheets/button.module.css";
import Indetermine from "../helpers/Loader/Indetermine";

const Button = ({
  type = "button",
  title = "",
  icon = "",
  onClick = (f) => f,
  outline = false,
  status = "normal",
  fullWidth = false,
  className = "",
  children,
  style,
  disabled = false,
  bounce = true,
  loading = false,
}) => {
  return (
    <button
      type={type}
      className={[
        styles.btn,
        icon ? styles.iconBtn : "",
        bounce ? styles.bounce : "",
        outline ? styles.btnOutline : "",
        fullWidth ? "w100 mx-a" : "",
        status === "confirm"
          ? styles.green
          : status === "reject"
          ? styles.red
          : "",
        className,
      ].join(" ")}
      onClick={onClick}
      style={style}
      disabled={disabled || loading}
    >
      <span>{title}</span>
      {icon && (
        <span>
          <i className={icon}></i>
        </span>
      )}
      {children}
      {loading && (
        <div className="w100 absolute t0 l0 br05">
          <Indetermine />
        </div>
      )}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  outline: PropTypes.bool,
  status: PropTypes.string,
};

export default Button;
