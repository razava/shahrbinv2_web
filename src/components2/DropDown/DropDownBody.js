import React from "react";
import styles from "./dropdown.module.css";

const getPosition = (position) => {
  let posStyle = {};
  if (position === "top") {
    posStyle = {
      left: "0",
      bottom: "100%",
      transformOrigin: "bottom center",
    };
  }

  if (position === "right") {
    posStyle = {
      left: "100%",
      top: "0",
    };
  }

  if (position === "bottom") {
    posStyle = {
      left: "0%",
      top: "100%",
      transformOrigin: "top center",
    };
  }

  if (position === "left") {
    posStyle = {
      right: "100%",
      top: "0",
    };
  }

  if (position === "bottom right" || position === "right bottom") {
    posStyle = {
      left: "100%",
      top: "100%",
    };
  }

  if (position === "left bottom" || position === "bottom left") {
    posStyle = {
      right: "100%",
      top: "100%",
    };
  }

  if (position === "top right" || position === "right top") {
    posStyle = {
      bottom: "100%",
      left: "100%",
      transformOrigin: "bottom center",
    };
  }

  if (position === "left top" || position === "top left") {
    posStyle = {
      right: "100%",
      bottom: "100%",
      transformOrigin: "bottom center",
    };
  }

  if (position === "center top" || position === "top center") {
    posStyle = {
      right: "-75%",
      left: "-75%",
      bottom: " 100%",
      transformOrigin: " center bottom",
    };
  }

  if (position === "center bottom" || position === "bottom center") {
    posStyle = {
      right: "-75%",
      left: "-75%",
      top: " 100%",
      transformOrigin: "top bottom",
    };
  }

  if (position === "center right" || position === "right center") {
    posStyle = {
      top: "-150%",
      left: "100%",
    };
  }

  if (position === "center left" || position === "left center") {
    posStyle = {
      bottom: "-150%",
      right: "100%",
    };
  }

  return posStyle;
};

const getAnimationClassName = (animationType) => {
  switch (animationType) {
    case "scale-down":
      return "animated-1";

    case "rotate-x":
      return "animated-2";

    case "translatez":
      return "animated-3";

    case "scale":
      return "animated-4";

    case "rotate-y":
      return "animated-5";

    default:
      return "animated-1";
  }
};

const DropdownBody = ({
  children,
  classNames = {
    dropdown: "",
  },
  position,
  scroll,
  scrollHeight,
  animationType = "",
  style = {},
}) => {
  //   classNames
  const animationClassName = getAnimationClassName(animationType);
  const dropdownBodyClassName = [
    styles.dropdown,
    styles.dropdownAnimated,
    styles[animationClassName],
    scroll ? "scrollbar" : "",
    classNames.dropdown,
  ].join(" ");

  //   styles
  const posStyle = getPosition(position) || {};

  const dropdownBodyStyle = {
    ...posStyle,
    overflowY: scroll ? "auto" : "",
    maxHeight: scroll ? scrollHeight : "",
    ...style,
  };
  return (
    <>
      <div className={dropdownBodyClassName} style={dropdownBodyStyle}>
        {children}
      </div>
    </>
  );
};

export default React.memo(DropdownBody);
