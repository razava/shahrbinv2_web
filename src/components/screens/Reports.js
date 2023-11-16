import React, { useRef, useState, useContext, useEffect } from "react";
import layoutStyle from "../../stylesheets/layout.module.css";
import { InfoAPI, ReportsAPI } from "../../apiCalls";
import MyDataTable from "../helpers/MyDataTable";
import {
  callAPI,
  constants,
  defaultFilters,
  getFromLocalStorage,
  hasRole,
  reportColumn,
  tableLightTheme,
} from "../../helperFuncs";
import ReportDialog from "../commons/dataDisplay/ReportDialog";
import Button from "../helpers/Button";
import NavigatableDialog from "../helpers/NavigatableDialog";
import { AppStore } from "../../store/AppContext";
import TableActions from "../commons/dataDisplay/TableActions";
import DialogToggler from "../helpers/DialogToggler";
import EditReportDialog from "../commons/dialogs/EditReportDialog";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import Filters from "../helpers/Filters";
import Excel from "../helpers/Excel/Excel";

const modalRoot = document && document.getElementById("modal-root");

const Reports = ({ match }) => {
  const [store, dispatch] = useContext(AppStore);

  // data states
  const [data, setData] = useState([]);

  // main states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [dialogData, setDialogData] = useState(null);

  // flags
  const [dialog, setDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const queries = {
    page,
    perPage: limit,
    ...store.filters,
  };

  useEffect(() => {
    getReports();
  }, [store.filters, page, limit]);

  useEffect(() => {
    if (store.refresh.page === match.path) {
      getReports();
    }

    return () => {
      dispatch({ type: "setFilters", payload: defaultFilters });
    };
  }, [store.refresh.call]);

  const getReports = () => {
    setLoading(true);
    callAPI(
      {
        caller: ReportsAPI.getReports,
        successCallback: (res) => {
          setData(res.data);
          if (res.headers["x-pagination"]) {
            const paginationData = JSON.parse(
              res.headers["x-pagination"]
            ).TotalCount;
            setTotalRows(paginationData);
          }
        },
        requestEnded: () => setLoading(false),
      },
      queries
    );
  };

  const openDialog = (row) => {
    modalRoot.classList.add("active");
    setDialog(true);
    setDialogData(row);
  };

  const openEditDialog = (row) => {
    setEditDialog(true);
    setDialogData(row);
  };

  const refresh = () => {
    getReports();
  };

  const moreButton = {
    name: "",
    cell: (row, index) => (
      <>
        <TableActions
          actions={tableActions}
          rowData={row}
          index={index}
          total={data.length}
          perPage={limit}
        />
      </>
    ),
  };
  const onPageChange = (page) => {
    setPage(page);
  };

  const onRowsPageChange = (newPerPage) => {
    setLimit(newPerPage);
  };

  const onEditDialogClose = () => {
    setEditDialog(false);
    modalRoot.classList.remove("active");
    refresh();
  };

  // renders
  const renderTableHeader = () => {
    return (
      <div className="w100 fre">
        <Filters excel />
      </div>
    );
  };

  // variables
  const userRoles = getFromLocalStorage(
    constants.SHAHRBIN_MANAGEMENT_USER_ROLES
  );
  const isOperator = hasRole(userRoles, ["Operator"]);

  const tableActions = [
    {
      id: "reports-1",
      icon: "fas fa-eye",
      title: "مشاهده",
      onClick: (row) => openDialog(row),
    },
    // {
    //   id: "comments-2",
    //   icon: "fas fa-edit",
    //   title: "ویرایش",
    //   onClick: (row) => openEditDialog(row),
    //   hide: !isOperator,
    // },
  ];
  return (
    <>
      <TableHeader renderHeader={renderTableHeader} />

      <LayoutScrollable clipped={(window.innerHeight * 3) / 48 + 10}>
        <div className={layoutStyle.wrapper}>
          <MyDataTable
            data={data}
            columns={[...reportColumn, moreButton]}
            theme={{ initializer: tableLightTheme, name: "light" }}
            onPageChange={onPageChange}
            onRowsPageChange={onRowsPageChange}
            setLoading={setLoading}
            loading={loading}
            filters={true}
            filterTypes={{
              from: true,
              to: true,
              query: true,
              chooseSubject: true,
              stages: false,
              priorities: false,
              regions: true,
              organs: true,
              scatterMap: true,
              category: true,
            }}
            totalRows={totalRows}
          />
        </div>
      </LayoutScrollable>

      <NavigatableDialog
        condition={dialog}
        dialogId={dialogData?.id}
        data={dialogData}
        setCondition={setDialog}
        width={900}
        height={600}
        Child={ReportDialog}
        childProps={{
          id: dialogData?.id,
          readOnly: true,
          setDialog: setDialog,
          refresh: refresh,
          caller: InfoAPI.getReportById,
        }}
        list={data}
      />

      {/* <DialogToggler
        condition={editDialog}
        setCondition={setEditDialog}
        data={dialogData}
        dialogId={dialogData?.id}
        width={700}
        outSideClick={false}
        id="edit-report"
      >
        <EditReportDialog report={dialogData} onClose={onEditDialogClose} />
      </DialogToggler> */}
    </>
  );
};

export default React.memo(Reports);
