import React from "react";

const Icon = ({ icon = "", className = "", size = 3, onClick = (f) => f }) => {
  const x = 5;

  return (
    <>
      <span
        className={className}
        style={{
          fontSize: x * size,
        }}
        onClick={onClick}
      >
        <i className={icon}></i>
      </span>
    </>
  );
};

export default Icon;
