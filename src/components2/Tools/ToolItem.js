import React, { useContext } from "react";
import useFields from "../../assets2/hooks/useFields";
import { AppStore } from "../../formStore/store";
import { appActions } from "../../utils/constants";
import Icon from "../Icon/Icon";
import styles from "./styles.module.css";

const ToolItem = ({ tool = {} }) => {
  // store
  const [store, dispatch] = useContext(AppStore);

  // hooks
  const { addField } = useFields();

  const handleDragStart = (e) => {
    dispatch({
      type: appActions.SET_DRAGGING,
      payload: { state: true, tool },
    });
  };

  const handleDragEnd = (e) => {
    dispatch({
      type: appActions.SET_DRAGGING,
      payload: { state: false, tool: null },
    });
  };

  const handleDrop = (ev) => {
    ev.preventDefault();
  };
  return (
    <>
      <div
        onClick={() => addField(tool)}
        className={styles.toolItem}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
      >
        <span
          className={styles.toolIcon}
          style={{
            background: tool.color + "20",
            color: tool.color,
          }}
        >
          <Icon name={tool.icon} />
        </span>
        <span className={styles.toolTitle}>{tool.title}</span>
      </div>
    </>
  );
};

export default ToolItem;
