import React, { useState } from "react";
import CheckBox from "../CheckBox/CheckBox";
import Icon from "../Icon/Icon";
import styles from "./styles.module.css";

const TreeItem = ({
  item = {},
  treeKey = "",
  nameKey = "",
  edit = false,
  findParent = (f) => f,
  handleSelecting = (f) => f,
  isSelected = (f) => f,
  onAddItem = (f) => f,
  onEditItem = (f) => f,
}) => {
  const [expanded, setExpanded] = useState(false);

  const onExpand = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const showElements = (item) => {
    return item[treeKey].map((e) => (
      <TreeItem
        key={e.id}
        item={e}
        treeKey={treeKey}
        nameKey={nameKey}
        expanded={false}
        handleSelecting={handleSelecting}
        isSelected={isSelected}
        findParent={findParent}
        onAddItem={onAddItem}
        onEditItem={onEditItem}
        edit={edit}
      />
    ));
  };

  return (
    <>
      <article className={styles.treeItem}>
        <div className={styles.treeItemContent}>
          {item[treeKey].length > 0 ? (
            expanded ? (
              <Icon
                name="minus"
                classNames={{ icon: styles.treeItemToggle }}
                onClick={onExpand}
              />
            ) : (
              <Icon
                name="plus"
                classNames={{ icon: styles.treeItemToggle }}
                onClick={onExpand}
              />
            )
          ) : (
            <span className={styles.space}></span>
          )}
          <CheckBox
            onChange={(value) => {
              handleSelecting({ value, item });
              if (value) {
                setExpanded(true);
              }
            }}
            checked={isSelected(item)}
            id={item.id}
            disabled={edit}
          />
          <span className={styles.treeItemTitle}>{item[nameKey]}</span>
          {edit && (
            <>
              <Icon
                name="plus"
                classNames={{ icon: styles.addIcon }}
                onClick={() => onAddItem(item)}
              />
              <Icon
                name="pen"
                classNames={{ icon: styles.addIcon }}
                onClick={() => onEditItem(item)}
              />
            </>
          )}
        </div>
        {expanded && showElements(item)}
      </article>
    </>
  );
};

export default TreeItem;
