import React, { useContext, useEffect, useState } from "react";
import { AppStore } from "../../../../store/AppContext";
import Button from "../../../helpers/Button";
import AddAttachment from "./AddAttachment";
import styles from "./style.module.css";

const modalRoot = document && document.getElementById("modal-root");

const AttachmentToggle = ({
  onAddAttachment = (f) => f,
  reset = false,
  clearAttachments,
}) => {
  const [store] = useContext(AppStore);

  const [dialog, setDialog] = useState(false);
  const [attachCount, setAttachCount] = useState(0);

  //   functions
  const toggleDialog = () => {
    if (store.modals.length === 1 && dialog) {
      modalRoot.classList.remove("active");
    }
    setDialog(!dialog);
  };

  const onAdd = (attachs) => {
    setAttachCount(attachs.length);
    onAddAttachment(attachs);
    toggleDialog();
  };

  const clear = () => {
    setAttachCount(0);
  };

  // effects
  useEffect(() => {
    if (reset) {
      clear();
    }
  }, [reset]);
  return (
    <>
      <Button outline className="f12" onClick={toggleDialog}>
        <span className="ml1">پیوست‌ها</span>
        <span>
          <i className="fas fa-paperclip"></i>
        </span>
        {attachCount ? (
          <span className={styles.attachCount}>{attachCount}</span>
        ) : null}
      </Button>

      <AddAttachment
        open={dialog}
        reset={reset}
        setOpen={setDialog}
        onAdd={onAdd}
        clearAttachments={clearAttachments}
      />
    </>
  );
};

export default AttachmentToggle;
