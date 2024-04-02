import React, { useState } from "react";
import TableHeaderAction from "../commons/dataDisplay/Table/TableHeaderAction";
import Filters from "../helpers/Filters";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import MyDataTable from "../helpers/MyDataTable";
import { useQuery } from "@tanstack/react-query";
import { getAllNotes } from "../../api/StaffApi";
import TableActions from "../commons/dataDisplay/TableActions";
import { fixDigit, tableLightTheme } from "../../helperFuncs";
import ReportDialog from "../commons/dataDisplay/ReportDialog";
import { InfoAPI } from "../../apiCalls";
import DialogToggler from "../helpers/DialogToggler";
import EditNoteDialog from "../commons/dialogs/EditNoteDialog";

const modalRoot = document && document.getElementById("modal-root");

export default function Notes() {
  const [reportDialog, setReportDialog] = useState(false);
  const [noteDialog, setNoteDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [noteData, setNoteData] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: getAllNotes,
  });

  const openReportDialog = (data) => {
    modalRoot.classList.add("modal-root");
    setReportDialog(true);
    setDialogData(data);
  };

  const closeDialog = () => {
    setReportDialog(false);
    modalRoot.classList.remove("modal-root");
  };

  const renderTableHeader = () => {
    return (
      <>
        {/* <TableHeaderAction
          title="تعریف سوال متداول "
          icon="fas fa-question-circle"
          onClick={() => openDialog(null, "create")}
        /> */}
        <div></div>
        <Filters filterTypes={{ query: true }} />
      </>
    );
  };

  const openNoteDialog = (row) => {
    setNoteData(row);
    setNoteDialog(true);
  };
  const tableActions = [
    {
      id: `FAQ-1`,
      title: "ویرایش",
      icon: "far fa-edit",
      onClick: (row) => openNoteDialog(row),
    },
    {
      id: "notes-2",
      icon: "fas fa-eye",
      title: "مشاهده گزارش",
      onClick: (row) => openReportDialog(row),
    },
  ];

  const columns = [
    {
      name: "یادداشت",
      cell: (row) => (
        <span className="text-right truncate w-64">{fixDigit(row.text)}</span>
      ),
    },
    {
      id: "comments-2",
      icon: "fas fa-eye",
      title: "مشاهده گزارش",
      onClick: (row) => openReportDialog(row),
    },
    {
      name: "عملیات",
      cell: (row, index) => (
        <>
          <TableActions
            actions={tableActions}
            total={data?.length}
            perPage={data?.length}
            rowData={row}
            index={index}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <TableHeader renderHeader={renderTableHeader} />
      <LayoutScrollable clipped={(window.innerHeight * 3) / 48 + 10}>
        <MyDataTable
          data={data}
          columns={columns}
          theme={{ initializer: tableLightTheme, name: "light" }}
          loading={isLoading}
          pagination={false}
          //   conditionalRowStyles={condStyle}
        />
      </LayoutScrollable>
      <DialogToggler
        condition={noteDialog}
        setCondition={setNoteDialog}
        width={900}
        isUnique={false}
        // loading={createLoading}
        id="add-quickaccess-dialog"
      >
        <EditNoteDialog noteData={noteData} />
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
    </div>
  );
}
