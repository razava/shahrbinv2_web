import React, { useContext, useEffect, useState } from "react";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import TableHeaderAction from "../commons/dataDisplay/Table/TableHeaderAction";
import { callAPI, fixDigit, tableLightTheme } from "../../helperFuncs";
import TableActions from "../commons/dataDisplay/TableActions";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import MyDataTable from "../helpers/MyDataTable";
import { toast } from "react-toastify";
import { ComplaintsAPI } from "../../apiCalls";
import { AppStore } from "../../store/AppContext";
import DialogToggler from "../helpers/DialogToggler";
import AddComplaintCategoryDialog from "../commons/dialogs/AddComplaintCategoryDialog";

const modalRoot = document && document.getElementById("modal-root");

const ComplaintsCategories = ({ match }) => {
  const [store, dispatch] = useContext(AppStore);

  // data states
  const [data, setData] = useState([]);

  // other states
  const [currentUnit, setCurrentUnit] = useState(null);

  //   flags
  const [addUnitDialog, setAddCategoryDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (store.refresh.page === match.path) {
      getAllCategories();
    }
  }, [store.refresh.call]);

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = () => {
    setLoading(true);
    callAPI({
      caller: ComplaintsAPI.getComplaintsCategories,
      successCallback: (res) => setData(getFlatData(res.data)),
      requestEnded: () => setLoading(false),
    });
  };

  const getFlatData = (data) => {
    const flatData = [];
    data["children"].forEach((d) => {
      const branches = getAllBranches(d);
      flatData.push(d);
      flatData.push(...branches);
    });
    return flatData;
  };

  const getAllBranches = (item) => {
    const children = [];
    item["children"].forEach((child) => {
      children.push(child);
      children.push(...getAllBranches(child));
    });
    return children;
  };

  //   open category details dialog
  const openDialog = (unit) => {
    setDialogData(unit);
    setCurrentUnit(unit);
    setEditDialog(true);
  };

  const onCategoryCreated = () => {
    toast("واحد جدید با موفقیت اضافه شد.", { type: "success" });
    setAddCategoryDialog(false);
    modalRoot.classList.remove("active");
    getAllCategories();
  };

  const onCategoryEdited = () => {
    toast("دسته‌بندی با موفقیت ویرایش شد.", { type: "success" });
    setEditDialog(false);
    modalRoot.classList.remove("active");
    setDialogData(null);
    getAllCategories();
  };

  const getDisplayName = (row) => {
    return `${row.title} ${
      row?.user?.firstName ? `(${row.user.firstName} ${row.user.lastName})` : ""
    }`;
  };

  // renders
  const renderTableHeader = () => {
    return (
      <>
        <TableHeaderAction
          title="تعریف دسته‌بندی (شکایات)"
          icon="fas fa-stream"
          onClick={() => setAddCategoryDialog(true)}
        />
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
        setCondition={setAddCategoryDialog}
        width={700}
        isUnique={false}
        loading={createLoading}
        id="add-OrganizationalUnit-dialog"
      >
        <AddComplaintCategoryDialog
          setLoading={setCreateLoading}
          onSuccess={onCategoryCreated}
          mode={"create"}
          categories={data}
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
        <AddComplaintCategoryDialog
          setLoading={setCreateLoading}
          onSuccess={onCategoryCreated}
          categories={data}
          mode={"edit"}
          defaltValues={currentUnit}
          categoryId={dialogData?.id}
        />
      </DialogToggler>
    </>
  );
};

export default ComplaintsCategories;
