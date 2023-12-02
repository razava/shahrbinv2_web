import React, { useEffect, useState } from "react";
import MyDataTable from "../helpers/MyDataTable";
import { callAPI, complaintColumn, tableLightTheme } from "../../helperFuncs";
import { ComplaintsAPI } from "../../apiCalls";
import TableActions from "../commons/dataDisplay/TableActions";
import ComplaintDialog from "../commons/dataDisplay/ComplaintDialog";
import DialogToggler from "../helpers/DialogToggler";
import Tabs from "../helpers/Tabs";
import TabLabel from "../helpers/Tabs/TabLabel";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
const modalRoot = document && document.getElementById("modal-root");
const tabs = [
  {
    id: "new",
    title: "جدید",
    caller: ComplaintsAPI.getComplaints,
  },
  {
    id: "live",
    title: "در حال بررسی",
    caller: ComplaintsAPI.getLiveComplaints,
  },
  {
    id: "finished",
    title: "منقضی شده",
    caller: ComplaintsAPI.getFinishedComplaints,
  },
];

const Complaints = () => {
  // data states
  const [data, setData] = useState([]);

  // other states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dialogData, setDialogData] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  // flags
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  //   variables
  const isTime5 = (time) => {
    var now = dayjs().utc().format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
    if (!time) return false;
    const targetTime = new Date(time).getTime();
    const currentTime = new Date(now).getTime();
    const timeDiff = targetTime - currentTime;
    const diffDays = timeDiff / (1000 * 60);
    return diffDays > 0 && diffDays < 7200 ? true : false;
  };
  const isTimePassed = (time) => {
    var now = dayjs().utc().format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
    if (!time) return false;
    const targetTime = new Date(time).getTime();
    const currentTime = new Date(now).getTime();
    const timeDiff = targetTime - currentTime;
    return timeDiff < 0 ? true : false;
  };
  const conditionalRowStyles = [
    {
      when: (row) => isTimePassed(row.currentDeadline),
      style: {
        backgroundColor: "#fecaca",
        color: "var(--dark)",
        borderRight: "5px solid #FF0000",
      },
    },
    {
      when: (row) => isTime5(row.currentDeadline),
      style: {
        backgroundColor: "#f6c5078f",
        color: "var(--dark)",
        borderRight: "5px solid #f6c507",
      },
    },
  ];
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
  const getComplaints = (caller = tabs[0].caller) => {
    setLoading(true);
    callAPI(
      {
        caller: caller,
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

  const onTabChange = (tabId) => {
    const tab = tabs.find((t) => t.id === tabId);
    setCurrentTab(tab);
    getComplaints(tab.caller);
  };

  //   effects
  useEffect(() => {
    getComplaints(tabs[0].caller);
  }, []);
  return (
    <>
      <div className="w100 bg-white br1 mb2">
        <Tabs
          mainClass="report-tab"
          activeClass="active"
          onTabChange={onTabChange}
          wrapperClassName="scrollbar-h"
        >
          {tabs.map((tab) => (
            <div
              id={tab.id}
              label={<TabLabel tab={tab} activeTab={currentTab.id} />}
              key={tab.id}
            ></div>
          ))}
        </Tabs>
      </div>

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
        conditionalRowStyles={conditionalRowStyles}
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
          readOnly={currentTab.id === "live"}
        />
      </DialogToggler>
    </>
  );
};

export default Complaints;
