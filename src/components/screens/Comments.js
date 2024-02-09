import React, { useContext, useEffect, useState } from "react";
import Title from "../helpers/Title";
import layoutStyle from "../../stylesheets/layout.module.css";
import useMakeRequest from "../hooks/useMakeRequest";
import Tabs from "../helpers/Tabs";
import Loader from "../helpers/Loader";
import { ReportsAPI, InfoAPI } from "../../apiCalls";
import MyDataTable from "../helpers/MyDataTable";
import {
  callAPI,
  defaultFilters,
  doesExist,
  tableLightTheme,
} from "../../helperFuncs";
import Avatar from "../commons/dataDisplay/Avatar";
import Button from "../helpers/Button";
import DialogToggler from "../helpers/DialogToggler";
import Textarea from "../helpers/Textarea";
import { toast } from "react-toastify";
import NoData from "../helpers/NoData/NoData";
import { AppStore } from "../../store/AppContext";
import ReportDialog from "../commons/dataDisplay/ReportDialog";
import TableActions from "../commons/dataDisplay/TableActions";
import TextInput from "../helpers/TextInput";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import Filters from "../helpers/Filters";
import DialogButtons from "../commons/dialogs/DialogButtons";

const modalRoot = document && document.getElementById("modal-root");

const Comments = ({ match }) => {
  const [store, dispatch] = useContext(AppStore);

  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [anwserText, setAnswerText] = useState("");
  const [answerDialog, setAnswerDialog] = useState(false);
  const [reportDialog, setReportDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [payload, setPayload] = useState(null);
  const [sendAnswerRequest, setSendAnwserRequest] = useState(false);
  const [deleteCommentRequest, setDeleteCommentRequest] = useState(false);
  const [loading, setLoading] = useState(true);

  const queries = {
    page,
    perPage,
    ...store.filters,
  };

  useEffect(() => {
    if (store.refresh.page === match.path) {
      getComments();
    }
  }, [store.refresh.call]);

  useEffect(() => {
    getComments();

    return () => {
      // dispatch({ type: "setFilters", payload: defaultFilters });
    };
  }, [store.filters, page, perPage]);

  const getComments = () => {
    setLoading(true);
    callAPI(
      {
        caller: ReportsAPI.getComments,
        successCallback: (res) => {
          setComments(res.data);
          const pagination = res.headers["x-pagination"];
          const totalRows = JSON.parse(pagination)?.TotalCount;
          setTotalRows(totalRows);
        },
        requestEnded: () => setLoading(false),
      },
      queries
    );
  };

  const openDialog = (data) => {
    modalRoot.classList.add("modal-root");
    setAnswerDialog(true);
    setDialogData(data);
  };

  const openReportDialog = (data) => {
    modalRoot.classList.add("modal-root");
    setReportDialog(true);
    setDialogData(data);
  };

  const closeDialog = () => {
    setReportDialog(false);
    modalRoot.classList.remove("modal-root");
  };

  const sendAnswer = (e) => {
    const payload = {
      comment: anwserText,
      // reportId: dialogData?.reportId,
      // isSeen: true,
      // isVerified: true,
    };
    setPayload(payload);
    setSendAnwserRequest(true);
  };

  const deleteComment = () => {
    setDeleteCommentRequest(true);
  };

  const [, sendLoading] = useMakeRequest(
    ReportsAPI.updateComment,
    200,
    sendAnswerRequest,
    payload,
    (res) => {
      setSendAnwserRequest(false);
      if (res && res.status === 200) {
        toast("پاسخ شما با موفقیت ارسال شد", { type: "success" });
        setAnswerDialog(false);
        setDialogData(null);
        setAnswerText("");
        modalRoot.classList.remove("active");
        getComments();
      }
    },
    dialogData?.id
  );

  const [, deleteLoading] = useMakeRequest(
    ReportsAPI.deleteComment,
    204,
    deleteCommentRequest,
    null,
    (res) => {
      setDeleteCommentRequest(false);
      if (res && res.status === 204) {
        toast("نظر کاربر با موفقیت حذف شد.", { type: "success" });
        setAnswerDialog(false);
        setDialogData(null);
        modalRoot.classList.remove("active");
        getComments();
      }
    },
    dialogData?.id
  );

  const tableActions = [
    {
      id: "comments-1",
      icon: "fas fa-search",
      title: "بررسی",
      onClick: (row) => openDialog(row),
    },
    {
      id: "comments-2",
      icon: "fas fa-eye",
      title: "مشاهده گزارش",
      onClick: (row) => openReportDialog(row),
    },
  ];

  const columns = [
    {
      name: "تصویر نمایه",
      cell: (row) => (
        <Avatar url={row?.user?.avatar?.url} placeholder={!row?.user?.avatar} />
      ),
    },
    {
      name: "نام و نام خانوادگی",
      cell: (row) => (
        <span>
          {doesExist(row?.user?.firstName) +
            " " +
            doesExist(row?.user?.lastName)}
        </span>
      ),
      grow: 2,
    },
    {
      name: "نام کاربری",
      cell: (row) => <span>{doesExist(row?.user?.userName)}</span>,
      grow: 2,
    },
    {
      name: "متن نظر",
      cell: (row) => <span>{doesExist(row.text)}</span>,
      grow: 6,
    },
    {
      name: "اقدام ها",
      cell: (row, index) => (
        <>
          <TableActions
            actions={tableActions}
            rowData={row}
            index={index}
            total={comments.length}
            perPage={comments.length}
          />
        </>
      ),
      grow: 3,
    },
  ];

  const onPageChange = (page) => {
    setPage(page);
  };

  const onRowsPageChange = (newPerPage) => {
    setPerPage(newPerPage);
  };

  // renders
  const renderTableHeader = () => {
    return (
      <div className="w100 fre">
        <Filters
          filterTypes={{ from: true, to: true, query: true, category: true }}
        />
      </div>
    );
  };

  return (
    <>
      <>
        {sendLoading && <Loader />}

        <TableHeader renderHeader={renderTableHeader} />

        <LayoutScrollable clipped={(window.innerHeight * 3) / 48 + 10}>
          <div className={[layoutStyle.wrapper].join(" ")}>
            <>
              <MyDataTable
                data={comments}
                columns={columns}
                theme={{ initializer: tableLightTheme, name: "light" }}
                loading={loading}
                pagination={true}
                totalRows={totalRows}
                onRowsPageChange={onRowsPageChange}
                onPageChange={onPageChange}
              />
            </>
          </div>
        </LayoutScrollable>
      </>

      <DialogToggler
        condition={answerDialog}
        setCondition={setAnswerDialog}
        data={dialogData}
        dialogId={dialogData?.id}
        width={500}
        id="answer-comment-dialog"
      >
        <Textarea
          readOnly
          value={dialogData?.text}
          title="نظر شهروند"
          wrapperClassName="w90 mxa"
          inputClassName="mh50"
        />
        <Textarea
          wrapperClassName="w90 mxa"
          inputClassName="mh100"
          value={anwserText}
          title="پاسخ به نظر شهروند"
          handleChange={(name) => (e) => setAnswerText(e.target.value)}
        />
        <DialogButtons
          primaryTitle="ارسال"
          onPrimaryClick={sendAnswer}
          secondaryTitle="حذف نظر"
          onSecondaryClick={deleteComment}
          primaryLoading={sendLoading}
          secondaryLoading={deleteLoading}
        />
      </DialogToggler>

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
  );
};

export default Comments;
