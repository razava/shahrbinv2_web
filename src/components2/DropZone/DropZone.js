import React from "react";
import { cn } from "../../utils/functions";
import styles from "./styles.module.css";

const DropZone = ({
  onDrop = (f) => f,
  id = "",
  classNames = { wrapper: "" },
}) => {
  const onDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onDrop(e);
  };
  return (
    <>
      <section
        className={cn(styles.dropZone, classNames.wrapper)}
        onDragOver={onDragOver}
        onDrop={handleDrop}
        data-id={id}
      >
        <span>
          <i className="fas fa-plus"></i>
        </span>
      </section>
    </>
  );
};

export default DropZone;
