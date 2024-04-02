import React, { useState } from "react";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import TableHeaderAction from "../commons/dataDisplay/Table/TableHeaderAction";
import Filters from "../helpers/Filters";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import MyDataTable from "../helpers/MyDataTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editFAQ, getFAQ } from "../../api/StaffApi";
import { fixDigit, tableLightTheme } from "../../helperFuncs";
import TableActions from "../commons/dataDisplay/TableActions";
import DialogToggler from "../helpers/DialogToggler";
import AddFAQDialog from "../commons/dialogs/AddFAQDialog";
import { toast } from "react-toastify";

const modalRoot = document && document.getElementById("modal-root");
export default function FAQ() {
  const [dialogData, setDialogData] = useState(null);
  const [addFAQDialog, setAddFAQDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const queryClient = useQueryClient();
  const [mode, setMode] = useState("create");
  const { data, isLoading ,refetch } = useQuery({
    queryKey: ["FAQ"],
    queryFn: getFAQ,
  });
  const FAQMutation = useMutation({
    mutationKey: ["FAQ"],
    mutationFn: editFAQ,
    onSuccess: (res) => {
      toast("وضعیت سوال با موفقیت بروزرسانی شد.", { type: "success" });
      queryClient.invalidateQueries({ queryKey: ["FAQ"] });
    },
    onError: (err) => {},
  });
  const openDialog = (access, mode = "create") => {
    console.log(access);
    setMode(mode);
    setDialogData(access);
    setAddFAQDialog(true);
  };
  const onFAQcreated = () => {
    setAddFAQDialog(false);
    modalRoot.classList.remove("active");
    refetch()
    //
  };
  const renderTableHeader = () => {
    return (
      <>
        <TableHeaderAction
          title="تعریف سوال متداول "
          icon="fas fa-question-circle"
          onClick={() => openDialog(null, "create")}
        />
        <Filters filterTypes={{ query: true }} />
      </>
    );
  };
  const changeMode = (isDeleted, id) => {
    FAQMutation.mutate({ Data: { isDeleted: !isDeleted }, id: id });
  };
  const tableActions = [
    {
      id: `FAQ-1`,
      title: "ویرایش",
      icon: "far fa-edit",
      onClick: (row) => openDialog(row, "edit"),
    },
    {
      id: `FAQ-2`,
      title: (row) => (row.isDeleted ? "فعال کردن" : "غیرفعال کردن"),
      icon: (row) => (row.isDeleted ? "fas fa-check" : "fas fa-ban"),
      onClick: (row) => changeMode(row.isDeleted, row.id),
    },
  ];
  const columns = [
    {
      name: "سوال",
      cell: (row) => (
        <span className="text-right">{fixDigit(row.question)}</span>
      ),
    },
    //    {
    //      name: "ترتیب",
    //      cell: (row) => (
    //        <span className="text-right">{fixDigit(row.order)}</span>
    //      ),
    //    },
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
  const condStyle = [
    {
      when: (row) => row?.isDeleted,
      style: {
        backgroundColor: "#ddd",
        color: "#333",
      },
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
          conditionalRowStyles={condStyle}
        />
      </LayoutScrollable>

      <DialogToggler
        condition={addFAQDialog}
        setCondition={setAddFAQDialog}
        width={900}
        isUnique={false}
        loading={createLoading}
        id="add-quickaccess-dialog"
      >
        <AddFAQDialog
          //   setLoading={setCreateLoading}
          onSuccess={onFAQcreated}
          mode={mode}
          accessId={dialogData?.id}
          defaltValues={dialogData}
        />
      </DialogToggler>
    </div>
  );
}
