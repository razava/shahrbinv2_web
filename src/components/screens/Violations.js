import React, { useState, useEffect, useContext } from "react";
import { InfoAPI, ViolationAPI } from "../../apiCalls";
import {
  convertserverTimeToDateString,
  doesExist,
  tableLightTheme,
  callAPI,
  defaultFilters,
  reportColumn,
} from "../../helperFuncs";
import ViolationDialog from "../commons/dialogs/ViolationDialog";
import Button from "../helpers/Button";
import DialogToggler from "../helpers/DialogToggler";
import MyDataTable from "../helpers/MyDataTable";
import Tabs from "../helpers/Tabs";
import { AppStore } from "../../store/AppContext";
import TableActions from "../commons/dataDisplay/TableActions";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import TabLabel from "../helpers/Tabs/TabLabel";
import Filters from "../helpers/Filters";
import ReportDialog from "../commons/dataDisplay/ReportDialog";
import CommentViolationsDialog from "../commons/dialogs/CommentViolationsDialog";

const modalRoot = document && document.getElementById("modal-root");

const Violations = ({ match }) => {
  const [store, dispatch] = useContext(AppStore);

  const [reportViolations, setReportViolations] = useState([]);
  const [commentViolations, setCommentViolations] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [dialog, setDialog] = useState(false);
  const [reportDialog, setReportDialog] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("violation-tab-1");
  const [totalRows, setTotalRows] = useState(0);
  const [totalRows2, setTotalRows2] = useState(0);
  const tableScrollable = (window.innerHeight * 21) / 24 - 200;

  const queries = {
    page,
    perPage,
    ...store.filters,
  };

  useEffect(() => {
    if (store.refresh.page === match.path) {
      getViolations();
      getCommentViolations();
    }
  }, [store.refresh.call]);

  useEffect(() => {
    getViolations();
    getCommentViolations();
    return () => {
      dispatch({ type: "setFilters", payload: defaultFilters });
    };
  }, [page, perPage, store.filters]);

  const getViolations = () => {
    setLoading(true);
    callAPI(
      {
        caller: ViolationAPI.getViolations,
        successCallback: (res) => {
          console.log(res);
          const reportViolations = res.data.filter((v) => v.reportId);
          const commentViolations = res.data.filter((v) => v.commentId);
          setReportViolations(res.data);
          const pagination = res.headers["x-pagination"];
          const totalRows = JSON.parse(pagination)?.TotalCount;
          console.log(totalRows);
          setTotalRows(totalRows);
        },
        requestEnded: () => setLoading(false),
      },
      queries
    );
  };

  const getCommentViolations = () => {
    setLoading(true);
    callAPI(
      {
        caller: ViolationAPI.getCommentViolations,
        successCallback: (res) => {
          console.log(res);
          const reportViolations = res.data.filter((v) => v.reportId);
          const commentViolations = res.data.filter((v) => v.commentId);
          setReportViolations(res.data);
          setCommentViolations(res.data);
          const pagination = res.headers["x-pagination"];
          const totalRows = JSON.parse(pagination)?.TotalCount;
          console.log(totalRows);
          setTotalRows2(totalRows);
        },
        requestEnded: () => setLoading(false),
      },
      queries
    );
  };

  const openDialog = (row) => {
    modalRoot.classList.add("modal-root");
    setDialog(true);
    setDialogData(row);
  };

  const openReportDialog = (row) => {
    modalRoot.classList.add("modal-root");
    setReportDialog(true);
    setDialogData(row);
  };

  const openCommentDialog = (row) => {
    modalRoot.classList.add("modal-root");
    setDialog(true);
    setDialogData(row);
  };

  const columns = [
    {
      name: "کاربر",
      cell: (row) => (
        <span>
          {doesExist(row?.user?.firstName)} {doesExist(row?.user?.lastName)}
        </span>
      ),
    },
    {
      name: "متن",
      cell: (row) => (
        <span className=" max-w-[11em] truncate">{doesExist(row?.text)}</span>
      ),
    },
  ];

  const closeDialog = () => {
    setDialog(false);
    setReportDialog(false);
    modalRoot.classList.remove("active");
  };

  const onSuccess = () => {
    closeDialog();
    getViolations();
  };

  const onTabChange = (tabId) => setActiveTab(tabId);
  // useEffect(() => {
  //   getViolations();
  //   getCommentViolations();
  // }, [activeTab]);

  const onPageChange = (page) => {
    setPage(page);
  };

  const onRowsPageChange = (newPerPage) => {
    setPerPage(newPerPage);
  };

  const refresh = () => {
    getViolations();
    getCommentViolations();
  };

  const renderViolationsHeader = () => {
    return (
      <>
        <Tabs
          mainClass="report-tab"
          activeClass="active"
          onTabChange={onTabChange}
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              label={<TabLabel key={tab.id} tab={tab} activeTab={activeTab} />}
              id={tab.id}
            ></div>
          ))}
        </Tabs>

        <Filters
          filterTypes={{ from: true, to: true, query: true, category: true }}
        />
      </>
    );
  };

  const tabs = [
    {
      id: "violation-tab-1",
      badge: totalRows,
      title: "گزارش‌ها",
      data: reportViolations,
    },
    {
      id: "violation-tab-2",
      badge: totalRows2,
      title: "نظر‌ها",
      data: commentViolations,
    },
  ];

  const tableData = activeTab ? tabs.find((t) => t.id === activeTab)?.data : [];
  console.log(tableData);
  const actions = [
    {
      id: "violations-2",
      icon: "fas fa-eye",
      title: "مشاهده گزارش",
      onClick: (row) => openReportDialog(row),
    },
  ];

  const commentActions = [
    {
      id: "violations-1",
      icon: "fas fa-eye",
      title: "مشاهده",
      onClick: (row) => openCommentDialog(row),
    },
  ];

  console.log();
  const total =
    activeTab === "reports"
      ? reportViolations.length
      : commentViolations.length;

  const moreButton = {
    name: "",
    cell: (row, index) => (
      <>
        <TableActions
          actions={activeTab == "violation-tab-1" ? actions : commentActions}
          rowData={row}
          index={index}
          total={total}
          perPage={total}
        />
      </>
    ),
  };
  return (
    <>
      <>
        <DialogToggler
          condition={dialog}
          setCondition={setDialog}
          data={dialogData}
          dialogId={dialogData?.id}
          width={600}
          height={500}
          loading={submitLoading}
          id="violation-dialog"
        >
          <CommentViolationsDialog
            setDialog={setDialog}
            readOnly={true}
            childData={{ id: dialogData?.id, data: dialogData }}
            onNext={closeDialog}
            refresh={refresh}
            defTab={"violations"}
          />
        </DialogToggler>

        <TableHeader renderHeader={renderViolationsHeader} />
        {activeTab == "violation-tab-1" ? (
          <MyDataTable
            data={reportViolations}
            columns={[...reportColumn, moreButton]}
            theme={{ initializer: tableLightTheme, name: "light" }}
            loading={loading}
            totalRows={totalRows}
            onRowsPageChange={onRowsPageChange}
            onPageChange={onPageChange}
            fixedHeaders={true}
            fixedHeaderScrollHeight={tableScrollable + "px"}
          />
        ) : (
          <MyDataTable
            data={commentViolations}
            columns={[...columns, moreButton]}
            theme={{ initializer: tableLightTheme, name: "light" }}
            loading={loading}
            totalRows={totalRows2}
            onRowsPageChange={onRowsPageChange}
            onPageChange={onPageChange}
            fixedHeaders={true}
            fixedHeaderScrollHeight={tableScrollable + "px"}
          />
        )}

        <DialogToggler
          condition={reportDialog}
          setCondition={setReportDialog}
          width={800}
          height={650}
          dialogId={dialogData?.id}
          data={dialogData}
          id="report-dialog"
        >
          <ReportDialog
            setDialog={setReportDialog}
            readOnly={true}
            caller={InfoAPI.getReportById}
            childData={{ id: dialogData?.id, data: tableData }}
            onNext={closeDialog}
            refresh={refresh}
            defTab={"ReportViolations"}
          />
        </DialogToggler>
      </>
    </>
  );
};

export default Violations;
