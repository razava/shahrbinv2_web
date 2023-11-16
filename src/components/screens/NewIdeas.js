import React, { useState } from "react";
import Title from "../helpers/Title";
import layoutStyle from "../../stylesheets/layout.module.css";
import useMakeRequest from "../hooks/useMakeRequest";
import { ReportsAPI } from "../../apiCalls";
import MyDataTable from "../helpers/MyDataTable";
import { ideaColumn, tableLightTheme } from "../../helperFuncs";

const NewIdeas = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [data] = useMakeRequest(
    ReportsAPI.getRecentIdeas,
    200,
    page + limit,
    null,
    (res) => setLoading(false),
    page,
    limit
  );

  const moreButton = {
    name: "بررسی",
    cell: (row) => (
      <button className="btn" type="button">
        بررسی
      </button>
    ),
  };
  const onPageChange = (page) => setPage(page);
  const onRowsPageChange = (newPerPage) => setLimit(newPerPage);

  return (
    <div className={layoutStyle.wrapper}>
      <Title title="ایده های جدید" size={1} />
      <MyDataTable
        data={data}
        columns={[...ideaColumn, moreButton]}
        theme={{ initializer: tableLightTheme, name: "light" }}
        onPageChange={onPageChange}
        onRowsPageChange={onRowsPageChange}
        setLoading={setLoading}
        loading={loading}
      />
    </div>
  );
};

export default NewIdeas;
