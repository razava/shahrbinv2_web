import React, { useContext } from "react";
import useFields from "../../assets2/hooks/useFields";
import { AppStore } from "../../formStore/store";
import { appActions } from "../../utils/constants";
import styles from "./styles.module.css";

const Control = ({ control = {}, field = {} }) => {
  //   store
  const [store, dispatch] = useContext(AppStore);

  // hooks
  const { deleteField, cloneField, openEditDialog } = useFields();

  const runAction = () => {
    if (control.action === "delete") return deleteField(field);
    else if (control.action === "clone") return cloneField(field);
    else if (control.action === "open_edit") return openEditDialog(field);
  };
  return (
    <>
      <span className={styles.control} onClick={runAction}>
        <i className={control.icon}></i>
      </span>
    </>
  );
};

export default Control;
