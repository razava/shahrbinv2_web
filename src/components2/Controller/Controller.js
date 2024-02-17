import React, { useContext } from "react";
import { AppStore } from "../../formStore/store";
import { cn } from "../../utils/functions";
import { controls } from "./constants";
import Control from "./Control";
import styles from "./styles.module.css";

const Controller = ({
  children,
  mode = "edit",
  field = {},
  classNames = { wrapper: "" },
  containerId,
}) => {
  // store
  const [store] = useContext(AppStore);

  //   renders
  const renderController = () => {
    return (
      <div
        className={cn(
          styles.controller,
          store.isDragging.state ? "" : styles.hoverable,
          containerId ? styles.isContainer : "",
          classNames.wrapper
        )}
        data-containerId={containerId}
      >
        {children}
        {
          <span className={styles.controls}>
            {controls.map((control) => (
              <Control key={control.id} control={control} field={field} />
            ))}
          </span>
        }
      </div>
    );
  };

  return mode === "edit" ? renderController() : children;
};

export default Controller;
