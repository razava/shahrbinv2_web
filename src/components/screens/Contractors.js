import React, { useRef, useState } from "react";
import layoutStyle from "../../stylesheets/layout.module.css";
import useMakeRequest from "../hooks/useMakeRequest";
import { AuthenticateAPI, UserInfoAPI } from "../../apiCalls";
import MyDataTable from "../helpers/MyDataTable";
import DialogToggler from "../helpers/DialogToggler";
import {
  doesExist,
  serverError,
  tableLightTheme,
  unKnownError,
} from "../../helperFuncs";
import Avatar from "../commons/dataDisplay/Avatar";
import RegisterForm from "../commons/submission/RegisterForm";
import Button from "../helpers/Button";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import TableHeaderAction from "../commons/dataDisplay/Table/TableHeaderAction";
import Filters from "../helpers/Filters";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";

const modalRoot = document && document.getElementById("modal-root");

const Contractors = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [dialogId, setDialogId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [query, setQuery] = useState("");
  const [makeRequest, setMakeRequest] = useState(1);
  const [contractorDialog, setContractorDialog] = useState(false);

  const [data] = useMakeRequest(
    UserInfoAPI.getContractors,
    200,
    makeRequest,
    null,
    (res) => {
      setLoading(false);
      if (res.status === 201 || res.status === 200) {
        if (res.headers["x-pagination"]) {
          const paginationData = JSON.parse(
            res.headers["x-pagination"]
          ).TotalCount;
          setTotalRows(paginationData);
        }
      } else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    },
    { page, perPage: limit, query, roles: ["Contractor"], toDate, fromDate }
  );

  const toggleRef = useRef(null);

  const openDialog = (id) => (e) => {
    modalRoot.classList.add("active");
    setDialog(true);
    setDialogId(id);
  };

  const userColumn = [
    {
      name: "تصویر نمایه",
      cell: (row) => <Avatar url={row.avatar} placeholder={!row.avatar} />,
    },
    {
      name: "نام",
      cell: (row) => <span>{doesExist(row.firstName)}</span>,
    },
    {
      name: "نام خانوادگی",
      cell: (row) => <span>{doesExist(row.lastName)}</span>,
    },
    {
      name: "شرکت",
      cell: (row) => <span>{doesExist(row.organization)}</span>,
    },
    {
      name: "نام کاربری",
      cell: (row) => <span>{doesExist(row.userName)}</span>,
    },
  ];
  const onPageChange = (page) => {
    setPage(page);
    setLoading(true);
    setMakeRequest((prev) => prev + 1);
  };

  const onRowsPageChange = (newPerPage) => {
    setLimit(newPerPage);
    setLoading(true);
    setMakeRequest((prev) => prev + 1);
  };

  const makeQueryRequset = (payload) => {
    setQuery(payload.query);
    setLoading(true);
    setMakeRequest((prev) => prev + 1);
  };

  const successCallback = () => {
    setLoading(true);
    setMakeRequest((prev) => prev + 1);
  };

  // renders
  // renders
  const renderTableHeader = () => {
    return (
      <>
        <TableHeaderAction
          title="تعریف پیمانکار"
          icon="fas fa-certificate"
          onClick={() => setContractorDialog(true)}
        />
        {/* <Filters filterTypes={{ query: true }} /> */}
      </>
    );
  };

  return (
    <>
      <TableHeader renderHeader={renderTableHeader} />

      <LayoutScrollable clipped={(window.innerHeight * 3) / 48 + 10}>
        <MyDataTable
          data={data}
          columns={userColumn}
          theme={{ initializer: tableLightTheme, name: "light" }}
          onPageChange={onPageChange}
          onRowsPageChange={onRowsPageChange}
          setLoading={setLoading}
          loading={loading}
          filters={true}
          filterTypes={{
            query: true,
          }}
          totalRows={totalRows}
          makeQueryRequset={makeQueryRequset}
        />
      </LayoutScrollable>

      <DialogToggler
        condition={contractorDialog}
        setCondition={setContractorDialog}
        width={500}
        // height={220}
        isUnique={false}
      >
        <RegisterForm
          setCondition={setContractorDialog}
          fields={[
            "phoneNumber",
            "firstName",
            "lastName",
            "organization",
            "title",
          ]}
          caller={AuthenticateAPI.registerContractor}
          successCallback={successCallback}
        />
      </DialogToggler>
    </>
  );
};

export default Contractors;
