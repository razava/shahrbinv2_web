import React, { useEffect, useState } from "react";
import MyDataTable from "../helpers/MyDataTable";
import { callAPI, complaintColumn, tableLightTheme } from "../../helperFuncs";
import { ComplaintsAPI } from "../../apiCalls";
import TableActions from "../commons/dataDisplay/TableActions";
import ComplaintDialog from "../commons/dataDisplay/ComplaintDialog";
import DialogToggler from "../helpers/DialogToggler";

const modalRoot = document && document.getElementById("modal-root");

const AllComplaints = () => {
  // data states
  const [data, setData] = useState([]);

  // other states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dialogData, setDialogData] = useState({});
  const [totalRows, setTotalRows] = useState(0);

  // flags
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  //   variables
  const queries = {
    page,
    perPage: limit,
  };
  const tableActions = [
    {
      id: "new-complaints-1",
      icon: "fas fa-eye",
      title: "بررسی",
      onClick: (row) => openDialog(row),
    },
  ];

  const moreButton = {
    name: "",
    cell: (row, index) => (
      <TableActions
        actions={tableActions}
        rowData={row}
        index={index}
        total={data.length}
        perPage={limit}
      />
    ),
  };

  const tableScrollable = (window.innerHeight * 21) / 24 - 200;

  //   functions
  const getComplaints = () => {
    setLoading(true);
    callAPI(
      {
        caller: ComplaintsAPI.getAllComplaints,
        successCallback: (res) => {
          setData(res.data);
          const pagination = res.headers["x-pagination"];
          const totalRows = JSON.parse(pagination)?.TotalCount;
          setTotalRows(totalRows);
        },
        requestEnded: () => {
          setLoading(false);
        },
      },
      queries
    );
  };

  const onPageChange = (page) => {
    setPage(page);
  };

  const onRowsPageChange = (newPerPage) => {
    setLimit(newPerPage);
  };

  const openDialog = (row) => {
    modalRoot.classList.add("active");
    setDialog(true);
    setDialogData(row);
  };

  const closeDialog = () => {
    setDialog(false);
    modalRoot.classList.remove("active");
  };

  const refresh = () => {
    getComplaints();
  };

  const onRowClicked = (row) => {
    openDialog(row);
  };

  //   effects
  useEffect(() => {
    getComplaints();
  }, []);
  return (
    <>
      <MyDataTable
        data={data}
        columns={[...complaintColumn, moreButton]}
        theme={{ initializer: tableLightTheme, name: "light" }}
        onPageChange={onPageChange}
        onRowsPageChange={onRowsPageChange}
        totalRows={totalRows}
        loading={loading}
        // filters={true}
        // filterTypes={{ query: true, from: true, to: true }}
        onRowClicked={onRowClicked}
        fixedHeaders={true}
        fixedHeaderScrollHeight={tableScrollable + "px"}
      />

      <DialogToggler
        condition={dialog}
        dialogId={dialogData?.id}
        data={dialogData}
        setCondition={setDialog}
        width={800}
        node={modalRoot}
        id="complaint-dialog"
      >
        <ComplaintDialog
          caller={ComplaintsAPI.getComplaintById}
          childData={{ id: dialogData?.id }}
          setDialog={setDialog}
          refresh={refresh}
          readOnly={true}
        />
      </DialogToggler>
    </>
  );
};

export default AllComplaints;
