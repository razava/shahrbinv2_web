import React, { useContext, useEffect, useState } from "react";
import TableHeaderAction from "../commons/dataDisplay/Table/TableHeaderAction";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import { useHistory } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getForms } from "../../api/AdminApi";
import MyDataTable from "../helpers/MyDataTable";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import { fixDigit, tableLightTheme } from "../../helperFuncs";
import TableActions from "../commons/dataDisplay/TableActions";
import { AppStore } from "../../formStore/store";
import { appActions } from "../../utils/constants";
import DialogToggler from "../helpers/DialogToggler";
import AddFormDialog from "../commons/dialogs/AddFormsDialog";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
const modalRoot = document && document.getElementById("modal-root");

function Forms() {
  const history = useHistory();
  const [dialogData, setDialogData] = useState(null);
  const [store, dispatch] = useContext(AppStore);
  const [addFormDialog, setAddFormDialog] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["getForms"],
    queryFn: getForms,
  });

  //   let subtitle;
  //  const [modalIsOpen, setIsOpen] = React.useState(false);

  //   const [isOpen, setIsOpen] = useState(false);

  //   const openModal = () => {
  //     setIsOpen(true);
  //   };

  //   const closeModal = () => {
  //     setIsOpen(false);
  //   };
  console.log(data);
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const onFormEdited = () => {
    setAddFormDialog(false);
    modalRoot.classList.remove("active");
    //
  };

  const tableActions = [
    {
      id: `forms-1`,
      title: "ویرایش",
      icon: "far fa-edit",
      onClick: (row) => {
        setDialogData(row);
        setAddFormDialog(true);
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
            total={data.length}
            perPage={data.length}
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
        title="تعریف فرم"
        icon="fab fa-wpforms"
        onClick={() => history.push("/newForm")}
      />
    );
  };


  return (
    <>
      <TableHeader renderHeader={renderTableHeader} />
      <LayoutScrollable clipped={(window.innerHeight * 3) / 48 + 10}>
        <MyDataTable
          data={data}
          columns={columns}
          theme={{ initializer: tableLightTheme, name: "light" }}
          loading={isLoading}
          pagination={false}
          // conditionalRowStyles={condStyle}
        />
      </LayoutScrollable>
      <DialogToggler
        condition={addFormDialog}
        setCondition={setAddFormDialog}
        width={900}
        isUnique={false}
        loading={isLoading}
        id="add-quickaccess-dialog"
      >
        <AddFormDialog
          //   setLoading={setCreateLoading}
          onSuccess={onFormEdited}
          // mode={mode}
          formId={dialogData?.id}
          // defaltValues={dialogData}
        />
      </DialogToggler>
      {/* <button
        className=" bg-[--yellow] p-2 text-[--blue] rounded-lg flex items-center"
        onClick={() => history.push("/newForm")}
      >
        <i class="fas fa-plus"></i>
        <i class="fas fa-sticky-note"></i>
        <p> ساخت فرم جدید</p>
      </button> */}
      {/* <button onClick={openModal}>Open Modal</button> */}
      {/* <div>
        <button onClick={openModal}>Open Modal</button>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
          <button onClick={closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>
      </div> */}
    </>
  );
}

export default Forms;
