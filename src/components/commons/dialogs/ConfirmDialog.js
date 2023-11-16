import React from "react";
import DialogButtons from "./DialogButtons";

const ConfirmDialog = ({
  message = "",
  onConfirm = (f) => f,
  onCancel = (f) => f,
}) => {
  return (
    <>
      <div className="w100 frc py1 px1">
        <span className="f15 text-dark">{message}</span>
      </div>

      <DialogButtons
        onPrimaryClick={onConfirm}
        onSecondaryClick={onCancel}
        primaryTitle="تایید"
        secondaryTitle="لغو"
      />
    </>
  );
};

export default ConfirmDialog;
