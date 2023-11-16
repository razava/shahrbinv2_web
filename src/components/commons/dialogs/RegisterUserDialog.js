import React, { useState } from "react";
import Button from "../../helpers/Button";
import DialogToggler from "../../helpers/DialogToggler";
import RegisterForm from "../submission/RegisterForm";

const modalRoot = document && document.getElementById("modal-root");

const RegisterUserDialog = () => {
  const [dialog, setDialog] = useState(false);

  const openDialog = (e) => {
    modalRoot.classList.add("active");
    setDialog(true);
  };
  return (
    <>
      <div className="w90 my-2 mx-a flex-row-between">
        <Button title="تعریف کاربر" icon="fas fa-plus" onClick={openDialog} />
      </div>
      <DialogToggler
        condition={dialog}
        setCondition={setDialog}
        width={600}
        height={600}
        isUnique={false}
      >
        <RegisterForm setCondition={setDialog} />
      </DialogToggler>
    </>
  );
};

export default RegisterUserDialog;
