import React, { useState, useContext, useEffect } from "react";
import { AuthenticateAPI, UserInfoAPI } from "../../apiCalls";
import {
  callAPI,
  defaultFilters,
  doesExist,
  hasRole,
  tableLightTheme,
} from "../../helperFuncs";
import Avatar from "../commons/dataDisplay/Avatar";
import DropdownWrapper from "../helpers/DropdownWrapper";
import MyDataTable from "../helpers/MyDataTable";
import dropdownStyles from "../../stylesheets/dropdown.module.css";
import DialogToggler from "../helpers/DialogToggler";
import RolesDialog from "../commons/dialogs/RolesDialog";
import ChangePasswordDialog from "../commons/dialogs/ChangePasswordDialog";
import RegisterForm from "../commons/submission/RegisterForm";
import Button from "../helpers/Button";
import RegionsDialog from "../commons/dialogs/RegionsDialog";
import { AppStore } from "../../store/AppContext";
import TableActions from "../commons/dataDisplay/TableActions";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import Filters from "../helpers/Filters";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import TableHeaderAction from "../commons/dataDisplay/Table/TableHeaderAction";

const modalRoot = document && document.getElementById("modal-root");

const ManageUsers = ({ match }) => {
  const [store, dispatch] = useContext(AppStore);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [roles, setRoles] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [rolesDialog, setRolesDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [regionsDialog, setRegionsDialog] = useState(null);
  const [userDialog, setUserDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [loading, setLoading] = useState(true);

  const queries = {
    page: currentPage,
    perPage,
    ...store.filters,
  };

  const tableActions = [
    {
      id: `manageUser-${1}`,
      title: "ویرایش",
      icon: "far fa-edit",
      onClick: (row) => handlePortalClick("edit", row),
    },
    {
      id: `manageUser-${2}`,
      title: "نقش‌ها",
      icon: "far fa-user",
      onClick: (row) => handlePortalClick("roles", row),
    },
    {
      id: `manageUser-${3}`,
      title: "مناطق",
      icon: "far fa-map",
      onClick: (row) => handlePortalClick("regions", row),
    },
    {
      id: `manageUser-${4}`,
      title: "تغییر رمز عبور",
      icon: "fas fa-key",
      onClick: (row) => handlePortalClick("password", row),
    },
  ];

  const columns = [
    {
      cell: (row) => (
        <Avatar url={row.avatar?.url3} placeholder={!row.avatar} />
      ),
    },
    {
      name: "نام",
      cell: (row) => doesExist(row.firstName),
    },
    {
      name: "نام خانوادگی",
      cell: (row) => doesExist(row.lastName),
    },
    {
      name: "عنوان",
      cell: (row) => doesExist(row.title),
    },
    {
      name: "نام کاربری",
      cell: (row) => doesExist(row.userName),
    },
    {
      name: "تلفن همراه",
      cell: (row) => doesExist(row.phoneNumber),
    },
    {
      cell: (row, index) => (
        <>
          <TableActions
            actions={tableActions}
            rowData={row}
            total={data.length}
            perPage={perPage}
            index={index}
          />
        </>
      ),
    },
  ];

  const handlePortalClick = (dialog, dialogData) => {
    modalRoot.classList.add("active");
    setDialogData(dialogData);
    if (dialog === "roles") {
      setRolesDialog(true);
    }
    if (dialog === "regions") {
      setRegionsDialog(true);
    }
    if (dialog === "password") {
      setPasswordDialog(true);
    }
    if (dialog === "create") {
      setEditDialog(false);
      setUserDialog(true);
    }
    if (dialog === "edit") {
      setEditDialog(true);
      setUserDialog(true);
    }
  };

  const makeQueryRequset = (payload) => {
    setQuery(payload.query);
    setRoles(payload.roles.map((role) => role.roleName));
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const onRowsPageChange = (newPerPage) => {
    setPerPage(newPerPage);
  };

  useEffect(() => {
    if (store.refresh.page === match.path) {
      getAllUsers();
    }
    return () => {
      dispatch({ type: "setFilters", payload: defaultFilters });
    };
  }, [store.refresh.call]);

  useEffect(() => {
    getAllUsers();
  }, [store.filters, currentPage, perPage]);

  const getAllUsers = () => {
    setLoading(true);
    callAPI(
      {
        caller: UserInfoAPI.getAllUsers,
        successCallback: (res) => {
          setData(res.data);
          if (res.headers["x-pagination"]) {
            const paginationData = JSON.parse(res.headers["x-pagination"]);
            setTotalRows(paginationData.TotalCount);
          }
        },
        requestEnded: () => setLoading(false),
      },
      queries
    );
  };

  // renders
  const renderTableHeader = () => {
    return (
      <>
        <TableHeaderAction
          title="تعریف کاربر"
          icon="fas fa-user-plus"
          onClick={() => handlePortalClick("create")}
        />
        <Filters
          filterTypes={{
            from: true,
            to: true,
            query: true,
            regions: true,
            roles: true,
          }}
        />
      </>
    );
  };

  const fields = editDialog
    ? ["firstName", "lastName", "title"]
    : [
        "firstName",
        "lastName",
        "userName",
        "regions",
        "roles",
        "password",
        "title",
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
          setLoading={setLoading}
          filters={true}
          filterTypes={{ query: true, roles: true }}
          makeQueryRequset={makeQueryRequset}
          onPageChange={onPageChange}
          onRowsPageChange={onRowsPageChange}
          totalRows={totalRows}
        />
      </LayoutScrollable>

      {/* roles dialog */}
      <DialogToggler
        condition={rolesDialog}
        setCondition={setRolesDialog}
        dialogId={dialogData?.id}
        data={dialogData}
        width={500}
        height={300}
        id="roles-dialog"
      >
        <RolesDialog userId={dialogData?.id} setCondition={setRolesDialog} />
      </DialogToggler>

      {/* change password dialog */}
      <DialogToggler
        condition={passwordDialog}
        data={dialogData}
        setCondition={setPasswordDialog}
        dialogId={dialogData?.id}
        width={400}
        height={200}
        fixedDimension={false}
        id="change-password-dialog"
      >
        <ChangePasswordDialog
          id={dialogData?.id}
          setCondition={setPasswordDialog}
        />
      </DialogToggler>

      <DialogToggler
        condition={regionsDialog}
        data={dialogData}
        setCondition={setRegionsDialog}
        dialogId={dialogData?.id}
        width={500}
        height={300}
        fixedDimension={false}
        id="regions-dialog"
      >
        <RegionsDialog
          userId={dialogData?.id}
          setCondition={setRegionsDialog}
        />
      </DialogToggler>
      <DialogToggler
        condition={userDialog}
        setCondition={setUserDialog}
        isUnique={false}
        width={editDialog ? 400 : 700}
        id="register-form-dialog"
      >
        <RegisterForm
          setCondition={setUserDialog}
          fields={fields}
          caller={
            editDialog
              ? UserInfoAPI.updateUserById
              : AuthenticateAPI.registerWithRoles
          }
          edit={editDialog}
          values={dialogData}
          successCallback={getAllUsers}
        />
      </DialogToggler>
    </>
  );
};

export default ManageUsers;
