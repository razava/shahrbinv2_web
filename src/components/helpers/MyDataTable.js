import React, { useState } from "react";
import PropTypes from "prop-types";
import DataTable from "react-data-table-component";
import { dataTableProps, tableLightTheme } from "../../helperFuncs";
import NoData from "./NoData/NoData";

const MyDataTable = ({
  columns = [],
  data = [],
  title = "",
  totalRows = 100,
  loading,
  conditionalRowStyles = [],
  onPageChange = (f) => f,
  onRowsPageChange = (f) => f,
  onRowClicked = (f) => f,
  pagination = true,
  fixedHeaders = false,
  fixedHeaderScrollHeight = "300px",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  tableLightTheme();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handleRowsPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    onRowsPageChange(newPerPage);
  };

  return (
    <div className={`datatable ${pagination ? "withPagination" : ""}`}>
      <DataTable
        columns={columns}
        data={data}
        {...dataTableProps}
        pagination={pagination}
        theme={"light"}
        title={title}
        paginationDefaultPage={currentPage}
        paginationPerPage={perPage}
        paginationTotalRows={totalRows}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPageChange}
        progressPending={loading}
        conditionalRowStyles={conditionalRowStyles}
        onRowClicked={onRowClicked}
        fixedHeader={fixedHeaders}
        fixedHeaderScrollHeight={fixedHeaderScrollHeight}
        noDataComponent={!loading && <NoData />}
      />
    </div>
  );
};

MyDataTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  theme: PropTypes.object,
  title: PropTypes.string,
  totalRows: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPageChange: PropTypes.func,
};

export default MyDataTable;
