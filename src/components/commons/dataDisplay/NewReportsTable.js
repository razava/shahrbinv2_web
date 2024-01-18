import React, { useEffect, useState, useContext, useRef } from "react";
import { ReportsAPI } from "../../../apiCalls";
import MyDataTable from "../../helpers/MyDataTable";
import DialogToggler from "../../helpers/DialogToggler";
import {
  callAPI,
  defaultFilters,
  doesExist,
  getUserRoles,
  hasRole,
  isTimePassed,
  reportColumn,
  tableLightTheme,
} from "../../../helperFuncs";
import ReportDialog from "./ReportDialog";
import useSignalR from "../../hooks/useSignalR";
import ConfirmReportDialog from "./ConfirmReportDialog";
import NavigatableDialog from "../../helpers/NavigatableDialog";
import { AppStore } from "../../../store/AppContext";
import TableActions from "./TableActions";
import EditReportDialog from "../dialogs/EditReportDialog";
import NoData from "../../helpers/NoData/NoData";

const modalRoot = document && document.getElementById("modal-root");
const modalRoot2 = document && document.getElementById("modal2-root");

const NewReportsTable = ({ roleId = null, onRefer = (f) => f }) => {
  const userRoles = getUserRoles();
  const isConfirm = hasRole(["Operator"], userRoles) && !roleId;
  const isEditable = !!hasRole(["Operator"], userRoles) && !!roleId;
  const fromRoleId = useRef(roleId);

  // store
  const [store, dispatch] = useContext(AppStore);

  // data states
  const [data, setData] = useState([]);

  // other states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dialogData, setDialogData] = useState({});
  const [totalRows, setTotalRows] = useState(0);

  // flags
  const [dialog, setDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [loading, setLoading] = useState(roleId === "" ? false : true);

  const queries = {
    page,
    perPage: limit,
    ...store.filters,
  };

  useEffect(() => {
    fromRoleId.current = roleId;
    if (roleId || roleId === null) {
      getTasks(roleId);
    }

    return () => {
      // dispatch({ type: "setFilters", payload: defaultFilters });
    };
  }, [roleId, page, limit, store.filters]);
  console.log(data);
  const getTasks = (roleId) => {
    setLoading(true);
    callAPI(
      {
        caller: ReportsAPI.getTasks,
        payload: roleId,
        successCallback: (res) => {
          setData(res.data);
          const pagination = res.headers["x-pagination"];
          const totalRows = JSON.parse(pagination)?.TotalCount;
          setTotalRows(totalRows);
        },
        requestEnded: () => {
          setLoading(false);
          onRefer();
        },
      },
      queries
    );
  };

  const openDialog = (row) => {
    if (isConfirm) {
      modalRoot.classList.add("active");
      setConfirmDialog(true);
      setDialogData(row);
    } else {
      modalRoot.classList.add("active");
      setDialog(true);
      setDialogData(row);
    }
  };

  const openEditDialog = (row) => {
    modalRoot.classList.add("active");
    setEditDialog(true);
    setDialogData(row);
  };

  const verifiedCallBack = (row) => {
    modalRoot.classList.add("active");
    setDialog(true);
    setDialogData(row);
    onRefer();
  };

  const onEditDialogClose = ({ withRefer, report } = {}) => {
    setEditDialog(false);
    getTasks(roleId);
    if (withRefer) {
      setDialog(true);
      setDialogData(report);
      onRefer();
    } else {
      modalRoot.classList.remove("active");
    }
  };
  let categoryTitle;
  const findCategory = (row) => {
    const category = store.initials.categories.categories.map((item) => {
      if (item.id == row.categoryId) {
        categoryTitle = item.title;
        return item;
      } else {
        const a = item.categories.map((itm) => {
          if (itm.id == row.categoryId) {
            categoryTitle = itm.title;
          }
        });
      }
    });
    return categoryTitle;
  };
  reportColumn[1] = {
    name: "زیر‌گروه موضوعی",
    grow: 2,
    cell: (row) => <span>{doesExist(findCategory(row))}</span>,
  };
  // variables
  const conditionalRowStyles = [
    {
      when: (row) => isTimePassed(row.deadline),
      style: {
        backgroundColor: "#C78E8E",
        color: "var(--dark)",
        borderRight: "5px solid #FF0000",
      },
    },
    {
      when: (row) => isTimePassed(row.responseDeadline),
      style: {
        backgroundColor: "#f6c5078f",
        color: "var(--dark)",
        borderRight: "5px solid #f6c507",
      },
    },
    {
      when: (row) =>
        !isTimePassed(row.deadline) && !isTimePassed(row.responseDeadline),
      style: {
        // backgroundColor: "#e9e9e9",
        backgroundColor: "#fff",
      },
    },
  ];

  const tableActions = [
    {
      id: "new-reports-1",
      icon: "fas fa-eye",
      title: "بررسی",
      onClick: (row) => openDialog(row),
    },
    {
      id: "new-reports-2",
      icon: "fas fa-edit",
      title: "ویرایش",
      onClick: (row) => openEditDialog(row),
      hide: !isEditable,
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

  const closeDialog = () => {
    setDialog(false);
    modalRoot.classList.remove("active");
  };

  const onPageChange = (page) => {
    setPage(page);
  };

  const onRowsPageChange = (newPerPage) => {
    setLimit(newPerPage);
  };

  const refresh = () => {
    getTasks(roleId);
  };

  const onRowClicked = (row) => {
    openDialog(row);
  };

  const onNewReport = () => {
    getTasks(fromRoleId.current);
  };

  // eefects

  useSignalR(onNewReport);

  return (
    <>
      {!isConfirm && (
        <NavigatableDialog
          condition={dialog}
          dialogId={dialogData?.id}
          data={dialogData}
          setCondition={setDialog}
          width={900}
          height={600}
          list={data}
          Child={ReportDialog}
          childProps={{
            id: dialogData?.id,
            readOnly: false,
            setDialog: setDialog,
            refresh: refresh,
            caller: ReportsAPI.getTask,
          }}
          id="report-dialog"
        />
      )}

      {/* confirm dialog */}
      {isConfirm && (
        <DialogToggler
          condition={confirmDialog}
          dialogId={dialogData?.id}
          data={dialogData}
          setCondition={setConfirmDialog}
          width={800}
          node={modalRoot2}
          id="confirm-dialog"
        >
          <ConfirmReportDialog
            setDialog={setConfirmDialog}
            report={dialogData}
            verifiedCallBack={verifiedCallBack}
          />
        </DialogToggler>
      )}
      {isConfirm && (
        <DialogToggler
          condition={dialog}
          dialogId={dialogData?.id}
          data={dialogData}
          setCondition={setDialog}
          width={800}
          height={650}
          outSideClick={false}
          id={"confirm-report-dialog"}
        >
          <ReportDialog
            id={dialogData?.id}
            readOnly={false}
            setDialog={setDialog}
            refresh={refresh}
            caller={ReportsAPI.getTask}
            childData={dialogData}
            onNext={closeDialog}
          />
        </DialogToggler>
      )}
      {isEditable && (
        <DialogToggler
          condition={editDialog}
          setCondition={setEditDialog}
          data={dialogData}
          dialogId={dialogData?.id}
          width={700}
          outSideClick={false}
          id="edit-report"
        >
          <EditReportDialog report={dialogData} onSuccess={onEditDialogClose} />
        </DialogToggler>
      )}
      <MyDataTable
        data={data}
        columns={[...reportColumn, moreButton]}
        theme={{ initializer: tableLightTheme, name: "light" }}
        onPageChange={onPageChange}
        onRowsPageChange={onRowsPageChange}
        totalRows={totalRows}
        loading={loading}
        filters={true}
        filterTypes={{ query: true, from: true, to: true }}
        conditionalRowStyles={conditionalRowStyles}
        onRowClicked={onRowClicked}
        fixedHeaders={true}
        fixedHeaderScrollHeight={tableScrollable + "px"}
      />
    </>
  );
};

export default React.memo(NewReportsTable);
