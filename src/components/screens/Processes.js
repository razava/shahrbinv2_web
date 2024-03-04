import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ConfigurationsAPI } from "../../apiCalls";
import {
  callAPI,
  defaultFilters,
  fixDigit,
  tableLightTheme,
} from "../../helperFuncs";
import { AppStore } from "../../store/AppContext";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import TableHeaderAction from "../commons/dataDisplay/Table/TableHeaderAction";
import TableActions from "../commons/dataDisplay/TableActions";
import AddProcessDialog from "../commons/dialogs/AddProcessDialog";
import Button from "../helpers/Button";
import DialogToggler from "../helpers/DialogToggler";
import DropdownWrapper from "../helpers/DropdownWrapper";
import Filters from "../helpers/Filters";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import MyDataTable from "../helpers/MyDataTable";
import { deleteProcess } from "../../api/AdminApi";
import { useMutation } from "@tanstack/react-query";

const modalRoot = document && document.getElementById("modal-root");

const Processes = ({ match }) => {
  const [store, dispatch] = useContext(AppStore);

  // data states
  const [data, setData] = useState([]);

  // other states
  const [dialogData, setDialogData] = useState(null);

  //   flags
  const [dialog, setDialog] = useState(false);
  const [addProcessDialog, setAddProcessDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const queries = {
    ...store.filters,
  };

  useEffect(() => {
    if (store.refresh.page === match.path) {
      getProccesses();
    }

    return () => {
      dispatch({ type: "setFilters", payload: defaultFilters });
    };
  }, [store.refresh.call]);

  useEffect(() => {
    getProccesses();
  }, [store.filters]);

  const getProccesses = () => {
    setLoading(true);
    callAPI(
      {
        caller: ConfigurationsAPI.getProcesses,
        successCallback: (res) => setData(res.data),
        requestEnded: () => setLoading(false),
      },
      queries
    );
  };

  //   open category details dialog
  const openDialog = (process) => {
    setDialogData(process);
    setDialog(true);
  };

  const onProcessCreated = () => {
    toast("فرآیند جدید با موفقیت اضافه شد.", { type: "success" });
    setDialog(false);
    modalRoot.classList.remove("active");
    getProccesses();
  };

  const onProccessUpdated = () => {
    toast("فرآیند با موفقیت ویرایش شد.", { type: "success" });
    setDialog(false);
    modalRoot.classList.remove("active");
    getProccesses();
  };
  //queries
  const deleteMutation = useMutation({
    mutationKey: ["deleteProcess"],
    mutationFn: deleteProcess,
    onSuccess: (res) => {
      getProccesses();
    },
    onError: (err) => {
      if (err.response.status == 400) {
        toast("فرایند، دسته بندی وابسته دارد.", { type: "error" });
      }
    },
  });

  // renders
  const renderTableHeader = () => {
    return (
      <>
        <TableHeaderAction
          title="تعریف فرآیند"
          icon="fas fa-tasks"
          onClick={() => setAddProcessDialog(true)}
        />
        <Filters filterTypes={{ query: true }} />
      </>
    );
  };

  const tableActions = [
    {
      id: `proccess-${1}`,
      title: "ویرایش",
      icon: "far fa-edit",
      onClick: (row) => openDialog(row),
    },
    {
      id: `proccess-${2}`,
      title: "حذف",
      icon: "far fa-times",
      onClick: (row) => deleteMutation.mutate(row.id),
    },
  ];

  //   table columns
  const columns = [
    {
      name: "فرآیند",
      cell: (row) => <span className="text-right">{fixDigit(row.title)}</span>,
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
      when: (row) => row?.category?.isDeleted,
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
        condition={addProcessDialog}
        setCondition={setAddProcessDialog}
        width={600}
        isUnique={false}
        loading={createLoading}
        id="add-proccess-dialog"
      >
        <AddProcessDialog
          setLoading={setCreateLoading}
          onSuccess={onProcessCreated}
          mode={"create"}
        />
      </DialogToggler>

      {/* edit dialog */}
      <DialogToggler
        condition={dialog}
        setCondition={setDialog}
        dialogId={dialogData?.id}
        data={dialogData}
        width={800}
        loading={createLoading}
        id="edit-proccess-dialog"
      >
        <AddProcessDialog
          setLoading={setCreateLoading}
          onSuccess={onProccessUpdated}
          mode={"edit"}
          processId={dialogData?.id}
        />
      </DialogToggler>
    </>
  );
};

export default Processes;
