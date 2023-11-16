import React, { useState } from "react";
import CheckBox from "../../helpers/CheckBox/CheckBox";

const TreeItem = ({
  item = {},
  treeKey = "",
  nameKey = "",
  findParent = (f) => f,
  handleSelecting = (f) => f,
  isSelected = (f) => f,
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
      />
    ));
  };

  return (
    <>
      <article className="w90 mxa">
     
        <div className="w100 frs relative">
          {item[treeKey].length > 0 ? (
            expanded ? (
              <span
                key="minus"
                onClick={onExpand}
                className="pointer ml1 sq15 bg-primary text-white frc"
              >
                <i className="fas fa-minus"></i>
              </span>
            ) : (
              <span
                key="plus"
                onClick={onExpand}
                className="pointer ml1 sq15 bg-primary text-white frc"
              >
                <i className="fas fa-plus"></i>
              </span>
            )
          ) : (
            <span className="sq15 ml1"></span>
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
          />
          <span className="text-color f15 treeItem">{item[nameKey]}</span>
          {findParent(item) && (
            <span className="treeItemInfo frc px2 text-center bg-primary text-white f12 absolute l0 b0 t0">
              {findParent(item)[nameKey]}
            </span>
          )}
        </div>
        {expanded && showElements(item)}
      </article>
    </>
  );
};

export default TreeItem;
