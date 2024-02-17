import React from "react";
import styles from './styles.module.css';

const DragItem = ({ renderItem = (f) => f, item }) => {
  return (
    <>
      {renderItem(item)}
    </>
  );
};

export default DragItem;
