import React, { useState } from "react";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import Filters from "../helpers/Filters";
import TableHeaderAction from "../commons/dataDisplay/Table/TableHeaderAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editNews, getNews } from "../../api/AdminApi";
import DialogToggler from "../helpers/DialogToggler";
import AddNewsDialog from "../commons/dialogs/AddNewsDialog";
import TableActions from "../commons/dataDisplay/TableActions";
import { fixDigit, tableLightTheme } from "../../helperFuncs";
import { toast } from "react-toastify";
import Avatar from "../commons/dataDisplay/Avatar";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import MyDataTable from "../helpers/MyDataTable";

const modalRoot = document && document.getElementById("modal-root");
export default function News() {
  const [dialogData, setDialogData] = useState(null);
  const [addNewsDialog, setAddNewsDialog] = useState(false);
  const [mode, setMode] = useState("create");
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["News"],
    queryFn: getNews,
  });

  const NewsMutation = useMutation({
    mutationKey: ["News"],
    mutationFn: editNews,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["News"] });
    },
    onError: (err) => {},
  });

  const onNewsCreated = () => {
    setAddNewsDialog(false);
    modalRoot.classList.remove("active");
    //
  };

  const changeDeleteMode = (isDeleted, id) => {
    const formData = new FormData();
    formData.append("isDeleted", !isDeleted);
    NewsMutation.mutate({ Data: formData, id: id });
    refetch();
  };
  const openDialog = (access, mode = "create") => {
    console.log(access);
    setMode(mode);
    setDialogData(access);
    setAddNewsDialog(true);
  };
  const renderTableHeader = () => {
    return (
      <>
        <TableHeaderAction
          title="تعریف خبر جدید"
          icon="fas fa-newspaper"
          onClick={() => openDialog(null, "create")}
        />
        <Filters filterTypes={{ query: true }} />
      </>
    );
  };

  const tableActions = [
    {
      id: `News-1`,
      title: "ویرایش",
      icon: "far fa-edit",
      onClick: (row) => openDialog(row, "edit"),
    },
    {
      id: `News-2`,
      title: (row) => (row.isDeleted ? "فعال کردن" : "غیرفعال کردن"),
      icon: (row) => (row.isDeleted ? "fas fa-check" : "fas fa-ban"),
      onClick: (row) => changeDeleteMode(row.isDeleted, row.id),
    },
  ];

  const columns = [
    {
      name: "تصویر",
      cell: (row) => (
        <Avatar
          url={row?.imageFile?.url3}
          placeholder={!row?.imageFile?.url3}
        />
      ),
    },
    {
      name: "عنوان",
      cell: (row) => <span className="text-right">{fixDigit(row.title)}</span>,
    },
    // {
    //   name: "ترتیب",
    //   cell: (row) => <span className="text-right">{fixDigit(row.order)}</span>,
    // },
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
        condition={addNewsDialog}
        setCondition={setAddNewsDialog}
        width={800}
        isUnique={false}
        // loading={createLoading}
        id="add-quickaccess-dialog"
      >
        <AddNewsDialog
          //   setLoading={setCreateLoading}
          onSuccess={onNewsCreated}
          mode={mode}
          accessId={dialogData?.id}
          defaltValues={dialogData}
        />
      </DialogToggler>
    </div>
  );
}
