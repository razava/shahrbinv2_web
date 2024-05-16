import React, { useRef } from "react";
import PropTypes from "prop-types";
import styles from "../../stylesheets/dropdown.module.css";

const Dropdown = ({
  children,
  className = "",
  position,
  theme,
  scroll,
  scrollHeight,
  dropItemStyle = {},
  dropItemClassName = "",
  dropDownClassName = "",
  upper = true,
}) => {
  let posStyle = {};
  if (position === "top") {
    posStyle = {
      left: "50%",
      top: "-100%",
      transform: "translate(-50%, -50%)",
    };
  }

  if (position === "right") {
    if (upper) {
      posStyle = {
        left: "100%",
        top: "50%",
        transform: "translateY(-50%)",
      };
    } else {
      posStyle = {
        left: "100%",
        bottom: "50%",
      };
    }
  }

  if (position === "bottom") {
    posStyle = {
      left: "50%",
      top: "100%",
      transform: "translateX(-50%)",
    };
  }

  if (position === "left") {
    posStyle = {
      left: "-100%",
      top: "100%",
      transform: "translate(-75%, -50%)",
    };
  }
  if (position === "bottom right" || position === "right bottom") {
    posStyle = {
      left: "100%",
      top: "100%",
    };
  }
  if (position === "top right" || position === "right top") {
    posStyle = {
      left: "50%",
      transform: "translateY(-100%)",
    };
  }

  if (position === "center bottom" || position === "bottom center") {
    posStyle = {
      right: "0%",
      top: "100%",
    };
  }
  if (position === "left bottom" || position === "bottom left") {
    posStyle = {
      left: "0%",
      top: "100%",
    };
  }

  return (
    <>
      <div
        className={[
          styles.dropdown,
          styles.dropdownAnimated,
          className,
          dropItemClassName,
          scroll ? "scrollbar" : "",
          dropDownClassName,
        ].join(" ")}
        style={{
          ...posStyle,
          ...theme,
          overflowY: scroll ? "auto" : "",
          maxHeight: scroll ? scrollHeight : "",
          ...dropItemStyle,
          transformOrigin: upper ? "top center" : "bottom center",
        }}
      >
        {children}
      </div>
    </>
  );
};

Dropdown.propTypes = {
  className: PropTypes.string,
  position: PropTypes.string,
  theme: PropTypes.object,
};

export default React.memo(Dropdown);
