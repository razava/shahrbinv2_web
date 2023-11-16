import React from "react";

const TableHeaderAction = ({ onClick = (f) => f, title = "", icon = "" }) => {
  return (
    <>
      <div
        className="frc text-primary f15 fw7 mr1 pointer hv-text"
        onClick={onClick}
      >
        <span className="">
          <i className={icon}></i>
        </span>
        <span className="mr05">{title}</span>
      </div>
    </>
  );
};

export default TableHeaderAction;
