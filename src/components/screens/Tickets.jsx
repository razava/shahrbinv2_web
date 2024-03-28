import React, { useContext, useEffect, useState } from "react";
// import { getTickets } from "../../api/StaffApi";
import { useQuery } from "@tanstack/react-query";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import TableHeaderAction from "../commons/dataDisplay/Table/TableHeaderAction";
import { CommonAPI } from "../../apiCalls";
import { AppStore } from "../../store/AppContext";
import { callAPI, fixDigit, tableLightTheme } from "../../helperFuncs";
import TableActions from "../commons/dataDisplay/TableActions";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import MyDataTable from "../helpers/MyDataTable";

export default function Tickets() {
  const [store, dispatch] = useContext(AppStore);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [dialogData, setDialogData] = useState(null);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setData(res);
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
      id: `forms-1`,
      title: "ویرایش",
      icon: "far fa-edit",
      onClick: (row) => {
        // setDialogData(row);
        // dispatch({ type: appActions.UPDATE_LIST, payload: row.elements.meta });
        // history.push("/newForm");
      },
    },
    {
      id: `forms-2`,
      title: "حذف",
      icon: "fas fa-ban",
      onClick: (row) => {},
    },
  ];

  const columns = [
    {
      name: "عنوان",
      cell: (row) => <span className="text-right">{fixDigit(row.title)}</span>,
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
        title="تعریف تیکت جدید"
        icon="fas fa-ticket-alt"
        onClick={() => {
          //   history.push("/newForm");
        }}
      />
    );
  };

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
    </>
  );
}
