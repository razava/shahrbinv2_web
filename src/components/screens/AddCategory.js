import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CommonAPI, ConfigurationsAPI, ProcessesAPI } from "../../apiCalls";
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
import AddCategoryDialog from "../commons/dialogs/AddCategoryDialog";
import Button from "../helpers/Button";
import DialogToggler from "../helpers/DialogToggler";
import DropdownWrapper from "../helpers/DropdownWrapper";
import Filters from "../helpers/Filters";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import Loader from "../helpers/Loader";
import MyDataTable from "../helpers/MyDataTable";

const modalRoot = document && document.getElementById("modal-root");

const AddCategory = ({ match }) => {
  const [store, dispatch] = useContext(AppStore);

  // data states
  const [data, setData] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

  // other states
  const [dialogData, setDialogData] = useState(null);

  //   flags
  const [dialog, setDialog] = useState(false);
  const [addCategoryDialog, setAddCategoryDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const queries = {
    ...store.filters,
  };

  useEffect(() => {
    if (store.refresh.page === match.path) {
      getCategories();
    }

    return () => {
      dispatch({ type: "setFilters", payload: defaultFilters });
    };
  }, [store.refresh.call]);

  useEffect(() => {
    getCategories();
  }, [store.filters]);

  let flatData = [];
  const flat = (data) => {
    data.categories.map((item) => {
      flatData.push(item);
      if (item.categories) {
        flat(item);
      }
    });
  };
  const getFlatData = (Data) => {
    flat(Data);

    return flatData;
  };
  const getAllBranches = (item) => {
    const children = [];
    item.forEach((child) => {
      console.log(item);
      children.push(child);
      children.push(...getAllBranches(child));
    });
    return children;
  };

  function flatten(data) {
    let result = [];

    while (data.categories && data.categories.length != 0) {
      data.categories.map((item) => {
        result.push(item);
        data = item.categories;
      });
    }

    return result;
  }

  const getCategories = () => {
    console.log(queries);
    setLoading(true);
    callAPI(
      {
        caller: ConfigurationsAPI.getAllCategories,
        successCallback: (res) => {
          console.log(res.data);
          const flatData = getFlatData(res.data);
          console.log(flatData);
          setData(flatData);
        },
        requestEnded: () => setLoading(false),
      },
      queries
    );
  };
  console.log(data);
  //   open category details dialog

  const openDialog = (category) => {
    console.log(category);
    setCurrentCategory(category.category);
    setDialogData(category);
    setDialog(true);
  };

  const onCategoryCreated = () => {
    toast("دسته‌بندی جدید با موفقیت اضافه شد.", { type: "success" });
    setDialog(false);
    modalRoot.classList.remove("active");
    getCategories();
  };

  const onCategoryEdited = () => {
    toast("دسته‌بندی با موفقیت به‌روز شد.", { type: "success" });
    setDialog(false);
    modalRoot.classList.remove("active");
    getCategories();
  };

  const deleteCategory = (id) => {
    setDeleteLoading(true);
    callAPI({
      caller: ConfigurationsAPI.deleteCategory,
      successCallback: () => {
        toast("دسته‌بندی با موفقیت حذف شد.", { type: "success" });
        getCategories();
      },
      payload: id,
      successStatus: 204,
      requestEnded: () => setDeleteLoading(false),
    });
  };

  // renders
  const renderTableHeader = () => {
    return (
      <>
        <TableHeaderAction
          title="تعریف دسته‌بندی"
          icon="fas fa-stream"
          onClick={() => setAddCategoryDialog(true)}
        />
        <Filters filterTypes={{ query: true }} />
      </>
    );
  };

  const tableActions = [
    {
      id: `category-${1}`,
      title: "ویرایش",
      icon: "far fa-edit",
      onClick: (row) => openDialog(row),
    },
    {
      id: `category-${2}`,
      title: (row) => (row?.isDeleted ? "فعال کردن" : "غیر‌فعال کردن"),
      icon: (row) => (row?.isDeleted ? "fas fa-recycle" : "fas fa-times"),
      onClick: (row) => deleteCategory(row.id),
    },
  ];

  //   table columns
  const columns = [
    {
      name: "دسته بندی",
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
      when: (row) => row?.isDeleted,
      style: {
        backgroundColor: "#ddd",
        color: "#333",
      },
    },
  ];
  return (
    <>
      {deleteLoading && <Loader />}

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
        condition={addCategoryDialog}
        setCondition={setAddCategoryDialog}
        width={700}
        isUnique={false}
        id="add-category-dialog"
      >
        <AddCategoryDialog onSuccess={onCategoryCreated} mode={"create"} />
      </DialogToggler>

      <DialogToggler
        condition={dialog}
        setCondition={setDialog}
        width={700}
        isUnique={false}
        // loading={editLoading}
        id="edit-category-dialog"
      >
        <AddCategoryDialog
          onSuccess={onCategoryEdited}
          mode={"edit"}
          setLoading={setEditLoading}
          defaltValues={currentCategory}
          categoryId={dialogData?.id}
          category={currentCategory}
        />
      </DialogToggler>
    </>
  );
};

export default AddCategory;
