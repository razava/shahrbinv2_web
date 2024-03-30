import React, { useContext, useEffect, useState } from "react";
// import { getTickets } from "../../api/StaffApi";
import { useQuery } from "@tanstack/react-query";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import TableHeaderAction from "../commons/dataDisplay/Table/TableHeaderAction";
import { CommonAPI } from "../../apiCalls";
import { AppStore } from "../../store/AppContext";
import {
  appRoutes,
  callAPI,
  fixDigit,
  tableLightTheme,
} from "../../helperFuncs";
import TableActions from "../commons/dataDisplay/TableActions";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import MyDataTable from "../helpers/MyDataTable";
import DialogToggler from "../helpers/DialogToggler";
import AddTicketDialog from "../commons/dialogs/AddTicketDialog";
import { useHistory } from "react-router-dom";

const modalRoot = document && document.getElementById("modal-root");

export default function Tickets() {
  const [store, dispatch] = useContext(AppStore);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [dialogData, setDialogData] = useState(null);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  //hooks
  const history = useHistory();

  const queries = {
    page,
    perPage: limit,
    ...store.filters,
  };
  //   const { data, isLoading, refetch } = useQuery({
  //     queryKey: ["getTickets"],
  //     queryFn: () => getTickets(),
  //   });
  console.log(data);

  const getTickets = () => {
    setLoading(true);
    callAPI(
      {
        caller: CommonAPI.getTickets,
        successCallback: (res) => {
          console.log(res);
          setData(res.data);
          if (res.headers["x-pagination"]) {
            const paginationData = JSON.parse(
              res.headers["x-pagination"]
            ).TotalCount;
            setTotalRows(paginationData);
          }
        },
        requestEnded: () => setLoading(false),
      },
      queries
    );
  };

  useEffect(() => {
    getTickets();
  }, [store.filters, page, limit]);

  const tableActions = [
    {
      id: "tickets-1",
      icon: "fas fa-eye",
      title: "بررسی",
      onClick: (row) => history.push(appRoutes.ticket.replace(/:id/, row.id)),
    },
  ];

  const columns = [
    {
      name: "ردیف",
      cell: (row, idx) => <span className="text-right">{idx + 1}</span>,
    },
    {
      name: "دسته بندی",
      cell: (row) => (
        <span className="text-right">
          {fixDigit(row.category.categoryName)}
        </span>
      ),
    },
    {
      name: "وضعیت",
      cell: (row) => (
        <span className="text-right">
          {row.status ? "بسته" : "باز"}
        </span>
      ),
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

  const renderTableHeader = () => {
    return (
      <TableHeaderAction
        title="ثبت تیکت"
        icon="fas fa-ticket-alt"
        onClick={() => {
          setDialog(true);
        }}
      />
    );
  };

  const refresh = () => {
    getTickets();
    modalRoot.classList.remove("active");
    setDialog(false);
  };

  useEffect(() => {
    modalRoot.classList.remove("active");
    setDialog(false);
  }, []);

  return (
    <>
      {" "}
      <TableHeader renderHeader={renderTableHeader} />
      <LayoutScrollable clipped={(window.innerHeight * 3) / 48 + 10}>
        <MyDataTable
          data={data}
          columns={columns}
          theme={{ initializer: tableLightTheme, name: "light" }}
          loading={loading}
          pagination={false}
          // conditionalRowStyles={condStyle}
        />
      </LayoutScrollable>
      <DialogToggler
        condition={dialog}
        setCondition={setDialog}
        width={700}
        // height={800}
        isUnique={false}
        id="create-poll-dialog"
      >
        <AddTicketDialog refresh={refresh} />
      </DialogToggler>
    </>
  );
}
