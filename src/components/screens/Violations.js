import React, { useState, useEffect, useContext } from "react";
import { InfoAPI, ViolationAPI } from "../../apiCalls";
import {
  convertserverTimeToDateString,
  doesExist,
  tableLightTheme,
  callAPI,
  defaultFilters,
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

  const queries = {
    page,
    perPage,
    ...store.filters,
  };

  useEffect(() => {
    if (store.refresh.page === match.path) {
      getViolations();
    }
  }, [store.refresh.call]);

  useEffect(() => {
    getViolations();

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
          const reportViolations = res.data.filter((v) => v.reportId);
          const commentViolations = res.data.filter((v) => v.commentId);
          setReportViolations(reportViolations);
          setCommentViolations(commentViolations);
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

  const columns = [
    {
      name: "نوع تخلف",
      cell: (row) => <span>{doesExist(row?.violationType?.title)}</span>,
    },
    {
      name: "تاریخ",
      cell: (row) => (
        <span>{doesExist(convertserverTimeToDateString(row?.dateTime))}</span>
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

  const onPageChange = (page) => {
    setPage(page);
  };

  const onRowsPageChange = (newPerPage) => {
    setPerPage(newPerPage);
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
      badge: reportViolations.length,
      title: "گزارش‌ها",
      data: reportViolations,
    },
    {
      id: "violation-tab-2",
      badge: commentViolations.length,
      title: "نظر‌ها",
      data: commentViolations,
    },
  ];

  const tableData = activeTab ? tabs.find((t) => t.id === activeTab)?.data : [];

  const actions = [
    {
      id: "violations-1",
      icon: "fas fa-search",
      title: "بررسی",
      onClick: (row) => openDialog(row),
    },
    {
      id: "violations-2",
      icon: "fas fa-eye",
      title: "مشاهده گزارش",
      onClick: (row) => openReportDialog(row),
    },
  ];

  const total =
    activeTab === "reports"
      ? reportViolations.length
      : commentViolations.length;

  const moreButton = {
    name: "",
    cell: (row, index) => (
      <>
        <TableActions
          actions={actions}
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
          width={500}
          loading={submitLoading}
          id="violation-dialog"
        >
          <ViolationDialog
            dialogData={dialogData}
            onSuccess={onSuccess}
            setLoading={setSubmitLoading}
            type={dialogData.reportId ? "report" : "comment"}
          />
        </DialogToggler>

        <TableHeader renderHeader={renderViolationsHeader} />

        <MyDataTable
          data={tableData}
          columns={[...columns, moreButton]}
          theme={{ initializer: tableLightTheme, name: "light" }}
          loading={loading}
          pagination={false}
          totalRows={tableData.length}
          onRowsPageChange={onRowsPageChange}
          onPageChange={onPageChange}
        />

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
            childData={{ id: dialogData?.reportId }}
            onNext={closeDialog}
          />
        </DialogToggler>
      </>
    </>
  );
};

export default Violations;
