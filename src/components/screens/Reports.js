import React, { useRef, useState, useContext, useEffect } from "react";
import layoutStyle from "../../stylesheets/layout.module.css";
import { InfoAPI, ReportsAPI } from "../../apiCalls";
import MyDataTable from "../helpers/MyDataTable";
import {
  callAPI,
  constants,
  defaultFilters,
  doesExist,
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
import { useQuery } from "@tanstack/react-query";
import { getFilters } from "../../api/commonApi";
import { Tooltip } from "react-tooltip";
import SearchInput from "../helpers/SearchInput";

const filterTypes = {
  // query: true,
  from: true,
  to: true,
  statuses: true,
  geometry: true,
  category: true,
  reportsToInclude: true,
  satisfactionValues: true,
  priorities: true,
  executives: true,
  regions: true,
};

const modalRoot = document && document.getElementById("modal-root");

const Reports = ({ match }) => {
  const [store, dispatch] = useContext(AppStore);
  // data states
  console.log(store);
  const [data, setData] = useState([]);

  // main states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [dialogData, setDialogData] = useState(null);
  const [query, setQuery] = useState("");
  const [isQuery, setIsQuery] = useState(true);

  // flags
  const [dialog, setDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log(reportColumn);

  const queries = {
    page,
    perPage: limit,
    ...store.filters,
  };

  //getFilters
  const { data: filtersData, isLoading } = useQuery({
    queryKey: ["filters"],
    queryFn: () => getFilters(),
  });

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

  // reportColumn[1] = {
  //   name: "زیر‌گروه موضوعی",
  //   grow: 2,
  //   cell: (row) => <span>{doesExist(findCategory(row))}</span>,
  // };

  const openDialog = (row) => {
    modalRoot.classList.add("active");
    setDialog(true);
    setDialogData(row);
  };

  const closeDialog = () => {
    setDialog(false);
    modalRoot.classList.remove("active");
    // setConfirmDialog(false);
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

  const exportToExcel = () => {
    const instanceId = getFromLocalStorage(
      constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID
    );
    ReportsAPI.getExcel(queries, instanceId).then((res) => {
      // setExcelLoading(false);
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        const filename = new Date().getTime() + ".xlsx";
        link.setAttribute("download", filename);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
      }
    });
  };

  useEffect(() => {
    if (store.filters.query == "") {
      setQuery("");
    }
  }, [store.filters]);

  // renders
  const renderTableHeader = () => {
    return (
      <div className="w100 fre flex items-center gap-2">
        <SearchInput
          isQuery={isQuery}
          setIsQuery={setIsQuery}
          filters={store.filters}
          setQuery={setQuery}
          query={query}
        />
        <span
          data-tooltip-id="excel"
          className=" cursor-pointer"
          onClick={exportToExcel}
        >
          <span>
            <i className="far fa-file-excel text-4xl text-primary"></i>
          </span>
        </span>
        <Tooltip
          style={{ fontSize: "10px", zIndex: 100 }}
          id="excel"
          place="bottom"
          content="خروجی excel"
        />
        <Filters filterTypes={filterTypes} filtersData={filtersData} />
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

  const onRowClicked = (row) => {
    openDialog(row);
  };

  const tableScrollable = (window.innerHeight * 21) / 24 - 200;

  return (
    <>
      <TableHeader renderHeader={renderTableHeader} />

      {/* <LayoutScrollable clipped={(window.innerHeight * 3) / 48 + 10}> */}
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
            priorities: true,
            regions: true,
            organs: true,
            scatterMap: true,
            category: true,
            reportsToInclude: true,
            satisfactionValues: true,
          }}
          totalRows={totalRows}
          onRowClicked={onRowClicked}
          fixedHeaders={true}
          fixedHeaderScrollHeight={tableScrollable + "px"}
        />
      </div>
      {/* </LayoutScrollable> */}

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
          onNext: closeDialog,
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
