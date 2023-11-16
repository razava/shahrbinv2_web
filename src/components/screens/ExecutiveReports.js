import React, { useRef, useState } from "react";
import Title from "../helpers/Title";
import layoutStyle from "../../stylesheets/layout.module.css";
import useMakeRequest from "../hooks/useMakeRequest";
import { ReportsAPI } from "../../apiCalls";
import MyDataTable from "../helpers/MyDataTable";
import DialogToggler from "../helpers/DialogToggler";
import { reportColumn, tableLightTheme } from "../../helperFuncs";
import ReportDialog from "../commons/dataDisplay/ReportDialog";
import Button from "../helpers/Button";

const modalRoot = document && document.getElementById("modal-root");

const ExecutiveReports = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dialog, setDialog] = useState(false);
  const [dialogId, setDialogId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data] = useMakeRequest(
    ReportsAPI.getRecentReports,
    200,
    page + limit,
    null,
    (res) => setLoading(false),
    page,
    limit
  );

  const toggleRef = useRef(null);

  const openDialog = (id) => (e) => {
    modalRoot.classList.add("active");
    setDialog(true);
    setDialogId(id);
  };

  const moreButton = {
    name: "بررسی",
    cell: (row) => (
      <>
        <Button
          title="بررسی"
          onClick={(e) => openDialog(row.id)(e)}
          outline={true}
        />
        <DialogToggler
          condition={dialog}
          dialogId={dialogId}
          data={row}
          setCondition={setDialog}
          toggleRef={toggleRef}
          width={600}
          height={600}
        >
          <ReportDialog data={row} />
        </DialogToggler>
      </>
    ),
  };
  const onPageChange = (page) => setPage(page);
  const onRowsPageChange = (newPerPage) => setLimit(newPerPage);

  return (
    <div className={layoutStyle.wrapper}>
      <Title title="درخواست های رسیدگی نشده" size={1} />
      <MyDataTable
        data={data}
        columns={[...reportColumn, moreButton]}
        theme={{ initializer: tableLightTheme, name: "light" }}
        onPageChange={onPageChange}
        onRowsPageChange={onRowsPageChange}
        setLoading={setLoading}
        loading={loading}
        filters={false}
      />
    </div>
  );
};

export default React.memo(ExecutiveReports);