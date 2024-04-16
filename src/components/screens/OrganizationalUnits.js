import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { OrganizationalUnitAPI } from "../../apiCalls";
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
import AddOrganizationalUnit from "../commons/dialogs/AddOrganizationalUnit";
import Button from "../helpers/Button";
import DialogToggler from "../helpers/DialogToggler";
import DropdownWrapper from "../helpers/DropdownWrapper";
import Filters from "../helpers/Filters";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import MyDataTable from "../helpers/MyDataTable";
import { useMutation } from "@tanstack/react-query";
import { deleteOrganizationalUnit } from "../../api/AdminApi";

const modalRoot = document && document.getElementById("modal-root");

const OrganizationalUnits = ({ match }) => {
  const [store, dispatch] = useContext(AppStore);

  // data states
  const [data, setData] = useState([]);

  // other states
  const [currentUnit, setCurrentUnit] = useState(null);

  //   flags
  const [addUnitDialog, setAddUnitDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const queries = {
    ...store.filters,
  };

  useEffect(() => {
    if (store.refresh.page === match.path) {
      getAllOrgans();
    }

    return () => {
      dispatch({ type: "setFilters", payload: defaultFilters });
    };
  }, [store.refresh.call]);

  useEffect(() => {
    getAllOrgans();
  }, [store.filters]);

  const getAllOrgans = () => {
    setLoading(true);
    callAPI(
      {
        caller: OrganizationalUnitAPI.getAllOrgans,
        successCallback: (res) => setData(res.data),
        requestEnded: () => setLoading(false),
      },
      queries
    );
  };

  //   open category details dialog
  const openDialog = (unit) => {
    setDialogData(unit);
    setCurrentUnit(unit);
    setEditDialog(true);
  };

  const onUnitCreated = () => {
    setAddUnitDialog(false);
    modalRoot.classList.remove("active");
    getAllOrgans();
  };

  const onOrganizationEdited = () => {
    setEditDialog(false);
    modalRoot.classList.remove("active");
    setDialogData(null);
    getAllOrgans();
  };

  const getDisplayName = (row) => {
    return `${row.title} ${
      row?.user?.firstName ? `(${row.user.firstName} ${row.user.lastName})` : ""
    }`;
  };

  //queries
  const deleteMutation = useMutation({
    mutationKey: ["deleteOrg"],
    mutationFn: deleteOrganizationalUnit,
    onSuccess: (res) => {
      getAllOrgans();
    },
    onError: (err) => {
      console.log(err.response);
      if (err.response.status == 400) {
        toast(err.response.data.detail, { type: "error" });
      }
    },
  });

  // renders
  const renderTableHeader = () => {
    return (
      <>
        <TableHeaderAction
          title="تعریف واحد‌سازمانی"
          icon="fas fa-building"
          onClick={() => setAddUnitDialog(true)}
        />
        <Filters filterTypes={{ query: true }} />
      </>
    );
  };

  const tableActions = [
    {
      id: `orginaztion-1`,
      title: "ویرایش",
      icon: "far fa-edit",
      onClick: (row) => openDialog(row),
    },
    {
      id: `orginaztion-2`,
      title: "حذف",
      icon: "far fa-times",
      onClick: (row) => deleteMutation.mutate(row.id),
    },
  ];

  //   table columns
  const columns = [
    {
      name: "عنوان",
      cell: (row) => (
        <span className="text-right">{fixDigit(getDisplayName(row))}</span>
      ),
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
        />
      </LayoutScrollable>

      {/* create dialog */}
      <DialogToggler
        condition={addUnitDialog}
        setCondition={setAddUnitDialog}
        width={700}
        isUnique={false}
        loading={createLoading}
        id="add-OrganizationalUnit-dialog"
      >
        <AddOrganizationalUnit
          setLoading={setCreateLoading}
          onSuccess={onUnitCreated}
          mode={"create"}
        />
      </DialogToggler>

      {/* edit dialog */}
      <DialogToggler
        condition={editDialog}
        setCondition={setEditDialog}
        dialogId={dialogData?.id}
        data={dialogData}
        width={700}
        loading={createLoading}
        id="edit-OrganizationalUnit-dialog"
      >
        <AddOrganizationalUnit
          setLoading={setCreateLoading}
          onSuccess={onOrganizationEdited}
          mode={"edit"}
          defaltValues={currentUnit}
          organizationId={dialogData?.id}
        />
      </DialogToggler>
    </>
  );
};

export default OrganizationalUnits;
