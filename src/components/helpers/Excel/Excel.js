import React from "react";
import TableHeaderAction from "../../commons/dataDisplay/Table/TableHeaderAction";

const Excel = ({ onClick }) => {
  return (
    <>
      <TableHeaderAction
        onClick={onClick}
        title="خروجی اکسل"
        icon="far fa-file-excel"
      />
    </>
  );
};

export default Excel;
