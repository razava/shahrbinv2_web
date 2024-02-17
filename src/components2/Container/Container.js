import React, { useContext } from "react";
import DragnDrop from "../DragnDrop/DragnDrop";
import { v4 as uuid } from "uuid";
import { AppStore } from "../../formStore/store";
import useFields from "../../assets2/hooks/useFields";
import DropZone from "../DropZone/DropZone";
import styles from "./styles.module.css";
import { appActions } from "../../utils/constants";

const Container = ({
  props,
  id,
  items,
  handleDrop = (f) => f,
  renderInput = (f) => f,
}) => {
  // store
  const [store, dispatch] = useContext(AppStore);

  // variables
  const dragndropData = [
    {
      id: uuid(),
      items,
    },
  ];

  // functions
  const onSort = (newList) => {
    const payload = store.form.map((f) => {
      if (f.id === id) {
        f.children = newList;
        return f;
      } else return f;
    });
    dispatch({ type: appActions.UPDATE_LIST, payload });
  };
  return (
    <>
      <section className={styles.container}>
        {props.label && <span className={styles.label}>{props.label}</span>}
        {items.map((item) => renderInput(item))}
      </section>
    </>
  );
};

export default Container;
