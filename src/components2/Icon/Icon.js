import React from "react";

const Icon = ({
  type = "fa-solid",
  name = "",
  size = "",
  color = "",
  classNames = { icon: "" },
  onClick = (f) => f,
  style = {},
  tooltipId = "",
}) => {
  const iconStyle = {
    color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };
  if (color) style.color = color;
  if (size) style.fontSize = size;
  return (
    <>
      <span
        key={name}
        style={iconStyle}
        className={classNames.icon}
        onClick={onClick}
        data-tooltip-id={tooltipId}
      >
        <i className={`fas fa-${name}`}></i>
      </span>
    </>
  );
};

export default Icon;
