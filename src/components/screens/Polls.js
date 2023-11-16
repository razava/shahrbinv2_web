import React, { useContext, useEffect, useState } from "react";
import { PollAPI } from "../../apiCalls";
import {
  convertserverTimeToDateString,
  tableLightTheme,
  mapPollStatus,
  callAPI,
  appRoutes,
  defaultFilters,
} from "../../helperFuncs";
import MyDataTable from "../helpers/MyDataTable";
import { toast } from "react-toastify";
import DialogToggler from "../helpers/DialogToggler";
import { useHistory } from "react-router-dom";
import Loader from "../helpers/Loader";
import Button from "../helpers/Button";
import CreatePoll from "../screens/CreatePoll";
import { AppStore } from "../../store/AppContext";
import TableActions from "../commons/dataDisplay/TableActions";
import TableHeaderAction from "../commons/dataDisplay/Table/TableHeaderAction";
import Filters from "../helpers/Filters";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import ConfirmDialog from "../commons/dialogs/ConfirmDialog";

const modalRoot = document && document.getElementById("modal-root");

const Polls = ({ match }) => {
  const [store, dispatch] = useContext(AppStore);

  const [data, setData] = useState([]);
  const [pollData, setPollData] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [createPollDialog, setCreatePollDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  const queries = {
    ...store.filters,
  };

  const history = useHistory();

  useEffect(() => {
    if (store.refresh.page === match.path) {
      getPolls();
    }

    return () => {
      dispatch({ type: "setFilters", payload: defaultFilters });
    };
  }, [store.refresh.call]);

  useEffect(() => {
    getPolls();
  }, [store.filters]);

  const getPolls = () => {
    setLoading(true);
    callAPI(
      {
        caller: PollAPI.getAllPolls,
        successCallback: (res) => setData(res.data),
        requestEnded: () => setLoading(false),
      },
      queries
    );
  };

  const openCreatePollDialog = () => {
    setPollData(null);
    setCreatePollDialog(true);
  };

  const onPollCreated = () => {
    setCreatePollDialog(false);
    modalRoot.classList.remove("active");
    getPolls();
  };

  const editPoll = (data) => {
    setPollData(data);
    setCreatePollDialog(true);
  };

  const tableActions = [
    {
      id: `poll-1`,
      title: "مشاهده",
      icon: "far fa-eye",
      onClick: (row) => history.push(appRoutes.poll.replace(/:id/, row.id)),
    },
    {
      id: `poll-2`,
      title: "ویرایش",
      icon: "far fa-edit",
      onClick: (row) => editPoll(row),
    },
    {
      id: `poll-3`,
      title: (row) =>
        row.status === 0
          ? "غیر‌فعال کردن"
          : row.status === 1
          ? "فعال کردن"
          : "",
      icon: (row) =>
        row.status === 0
          ? "fas fa-times"
          : row.status === 1
          ? "fas fa-recycle"
          : "",
      onClick: (row) =>
        changePollStatus(
          row.id,
          row.status === 0 ? 1 : row.status === 1 ? 0 : 0
        ),
    },
    {
      id: `poll-4`,
      title: "حذف",
      icon: "far fa-trash-alt",
      onClick: (row) => handleDialog("open", row),
    },
  ];

  const columns = [
    {
      name: "عنوان",
      selector: "title",
    },
    {
      name: "تاریخ ایجاد",
      cell: (row) => <span>{convertserverTimeToDateString(row.created)}</span>,
    },
    {
      name: "وضعیت",
      cell: (row) => <span>{mapPollStatus(row.status)}</span>,
    },
    {
      name: "اقدامات",
      cell: (row, index) => (
        <>
          <TableActions
            actions={tableActions}
            total={data.length}
            perPage={data.length}
            rowData={row}
            index={index}
          />
        </>
      ),
    },
  ];

  const handleDialog = (action, row) => {
    setDialogData(row);
    if (action === "open") {
      modalRoot.classList.add("active");
      setDialog(true);
    }
    if (action === "close") {
      modalRoot.classList.remove("active");
      setDialog(false);
    }
  };

  const changePollStatus = (id, action) => {
    setStatusLoading(true);
    callAPI(
      {
        caller: PollAPI.changePollStatus,
        payload: action,
        successStatus: 204,
        successCallback: (res) => {
          toast("عملیات با موفقیت انجام شد.", { type: "success" });
          getPolls();
        },
        requestEnded: () => {
          setDialog(false);
          modalRoot.classList.remove("active");
          setStatusLoading(false);
        },
      },
      id
    );
  };

  // renders
  const renderTableHeader = () => {
    return (
      <>
        <TableHeaderAction
          title="تعریف نظرسنجی"
          icon="fas fa-poll"
          onClick={openCreatePollDialog}
        />
        <Filters filterTypes={{ query: true, from: true, to: true }} />
      </>
    );
  };

  return (
    <>
      {statusLoading && <Loader />}

      <TableHeader renderHeader={renderTableHeader} />

      <LayoutScrollable clipped={(window.innerHeight * 3) / 48 + 10}>
        <MyDataTable
          columns={columns}
          data={data}
          loading={loading}
          setLoading={setLoading}
          theme={{ initializer: tableLightTheme, name: "light" }}
          pagination={false}
        />
      </LayoutScrollable>

      <DialogToggler
        condition={createPollDialog}
        setCondition={setCreatePollDialog}
        width={window.innerWidth}
        height={800}
        isUnique={false}
        id="create-poll-dialog"
      >
        <CreatePoll onPollCreated={onPollCreated} pollData={pollData} />
      </DialogToggler>

      <DialogToggler
        condition={dialog}
        setCondition={setDialog}
        dialogId={dialogData?.id}
        data={dialogData}
        width={350}
        isUnique={true}
        id="confirm-dialog"
      >
        <ConfirmDialog
          onConfirm={() => changePollStatus(dialogData?.id, 3)}
          onCancel={() => handleDialog("close", null)}
          message="آیا از انجام این عملیات اطمینان دارید؟"
        />
      </DialogToggler>
    </>
  );
};

export default Polls;
