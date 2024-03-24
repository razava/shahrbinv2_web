import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { QuickAccessAPI } from "../../apiCalls";
import {
  callAPI,
  defaultFilters,
  fixDigit,
  tableLightTheme,
} from "../../helperFuncs";
import { AppStore } from "../../store/AppContext";
import Avatar from "../commons/dataDisplay/Avatar";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import TableHeaderAction from "../commons/dataDisplay/Table/TableHeaderAction";
import TableActions from "../commons/dataDisplay/TableActions";
import AddQuickAccessDialog from "../commons/dialogs/AddQuickAccessDialog";
import DialogToggler from "../helpers/DialogToggler";
import Filters from "../helpers/Filters";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import MyDataTable from "../helpers/MyDataTable";

const modalRoot = document && document.getElementById("modal-root");

const QuickAccess = ({ match }) => {
  const [store, dispatch] = useContext(AppStore);

  // data states
  const [data, setData] = useState([]);

  // others
  const [dialogData, setDialogData] = useState(null);

  //   flags
  const [addAccessDialog, setAddAccessDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [mode, setMode] = useState("create");
  const [loading, setLoading] = useState(true);

  const queries = {
    ...store.filters,
  };

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
        caller: QuickAccessAPI.getAccesses,
        successCallback: (res) => setData(res.data),
        requestEnded: () => setLoading(false),
      },
      queries
    );
  };

  //   open category details dialog
  const openDialog = (access, mode = "create") => {
    setMode(mode);
    setDialogData(access);
    setAddAccessDialog(true);
  };

  const onAccessCreated = () => {
    setAddAccessDialog(false);
    modalRoot.classList.remove("active");
    getPolls();
  };

  const deleteAccess = (accessId, isDeleted) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("isDeleted", !isDeleted);
    callAPI(
      {
        caller: QuickAccessAPI.editAccess,
        successStatus: 204,
        payload: formData,
        successCallback: () => {
          toast("عملیات با موفقیت انجام شد.", { type: "success" });
          getPolls();
        },
        requestEnded: () => setLoading(false),
      },
      accessId
    );
  };

  // renders
  const renderTableHeader = () => {
    return (
      <>
        <TableHeaderAction
          title="تعریف دسترسی‌سریع"
          icon="fas fa-star"
          onClick={() => openDialog(null, "create")}
        />
        <Filters filterTypes={{ query: true }} />
      </>
    );
  };

  const tableActions = [
    {
      id: `quickaccess-1`,
      title: "ویرایش",
      icon: "far fa-edit",
      onClick: (row) => openDialog(row, "edit"),
    },
    {
      id: `quickaccess-2`,
      title: (row) => (row.isDeleted ? "بازیابی" : "حذف"),
      icon: (row) => (row.isDeleted ? "fas fa-recycle" : "fas fa-times"),
      onClick: (row) => deleteAccess(row.id, row.isDeleted),
    },
  ];

  //   table columns
  const columns = [
    {
      name: "تصویر",
      cell: (row) => (
        <Avatar url={row?.media?.url3} placeholder={!row?.media?.url3} />
      ),
    },
    {
      name: "عنوان",
      cell: (row) => <span className="text-right">{fixDigit(row.title)}</span>,
    },
    {
      name: "ترتیب",
      cell: (row) => <span className="text-right">{fixDigit(row.order)}</span>,
    },
    {
      name: "عملیات",
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
    <>
      <TableHeader renderHeader={renderTableHeader} />

      <LayoutScrollable clipped={(window.innerHeight * 3) / 48 + 10}>
        <MyDataTable
          data={data}
          columns={columns}
          theme={{ initializer: tableLightTheme, name: "light" }}
          loading={loading}
          pagination={false}
          conditionalRowStyles={condStyle}
        />
      </LayoutScrollable>

      <DialogToggler
        condition={addAccessDialog}
        setCondition={setAddAccessDialog}
        width={500}
        isUnique={false}
        loading={createLoading}
        id="add-quickaccess-dialog"
      >
        <AddQuickAccessDialog
          setLoading={setCreateLoading}
          onSuccess={onAccessCreated}
          mode={mode}
          accessId={dialogData?.id}
          defaltValues={dialogData}
        />
      </DialogToggler>
    </>
  );
};

export default QuickAccess;
