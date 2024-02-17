import React, { useContext, useEffect, useRef, useState } from "react";
import { AppStore } from "../../formStore/store";
import { appActions } from "../../utils/constants";
import { cn, createId } from "../../utils/functions";
import DropZone from "../DropZone/DropZone";
import styles from "./styles.module.css";
import DragItem from "./DragItem";

const dropZoneItem = {
  id: "drop-zone-item",
  type: "dropzone",
};

const DragnDrop = ({
  data = [],
  classNames = { dragndrop: "", dnd_group: "", drag_item: "", dragging: "" },
  id = "",
  renderItem = (f) => f,
  onDrop = (f) => f,
  onSort = (f) => f,
}) => {
  // store
  const [store, dispatch] = useContext(AppStore);

  // refs
  const dragItem = useRef();
  const dragNode = useRef();
  const dropZonePosition = useRef(undefined);
  const listRef = useRef([]);

  // states
  const [list, setList] = useState(data);
  const [dragging, setDragging] = useState(false);

  // variables
  const { isDragging, form } = store;

  //   functions
  const handleDragStart = (e, params) => {
    e.stopPropagation();
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    dragItem.current = params;
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.stopPropagation();
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    dragNode.current = null;
    dragItem.current = null;
    setDragging(false);
    onSort(listRef.current[0].items);
  };

  const getDraggingClassName = (params) => {
    if (
      params.grpI === dragItem?.current?.grpI &&
      params.itemI === dragItem?.current?.itemI
    ) {
      // return cn(styles.dragging, classNames.dragging);
      return "";
    } else return "";
  };

  const handleDragEnter = (e, params) => {
    e.stopPropagation();
    e.preventDefault();
    if (dragItem.current) handleInnerDragging(e, params);
    else handleOuterDragging(e, params);
  };

  const handleInnerDragging = (e, params) => {
    e.stopPropagation();
    if (e.currentTarget === dragNode.current) return;
    const currentItem = dragItem.current;
    let newList = JSON.parse(JSON.stringify(list));
    newList[params.grpI].items.splice(
      params.itemI,
      0,
      newList[params.grpI].items.splice(currentItem.itemI, 1)[0]
    );
    setList(newList);
    listRef.current = newList;
    dragItem.current = params;
  };

  const checkPosition = (e) => {
    const { top, height } = e.target.getBoundingClientRect();
    return e.clientY > top + height / 2 + 5
      ? "bottom"
      : e.clientY < top + height / 2 - 5
      ? "top"
      : "none";
  };

  const getPositionIndex = (position, params) => {
    return position === "top"
      ? params.itemI - 1 < 0
        ? 0
        : params.itemI - 1
      : position === "bottom"
      ? params.itemI + 1
      : null;
  };

  const handleOuterDragging = (e, params) => {
    e.stopPropagation();
    const position = checkPosition(e);
    if (position === "none") {
      return;
    }
    dropZonePosition.current = getPositionIndex(position, params);
    if (
      dropZonePosition.current !== 0 &&
      dropZonePosition.current !== list[0].items.length
    ) {
      showDropZoneAt(dropZonePosition.current);
    }
  };

  const handleDragOver = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const origin = dragItem.current ? "inner" : "outer";
    const destination = id || "root";
    console.log("index: ", dropZonePosition.current);
    console.log("id: ", id);
    console.log("dragitem: ", dragItem.current);
    onDrop(e, dropZonePosition.current, id);
  };

  const showDropZoneAt = (index) => {
    let newList = JSON.parse(JSON.stringify(list));
    newList[0].items = newList[0].items.filter(
      (item) => item.type !== "dropzone"
    );
    newList?.[0].items.splice(index, 0, dropZoneItem);
    setList(newList);
    listRef.current = newList;
  };

  // effects
  useEffect(() => {
    setList(data);
    listRef.current = data;
  }, [data, setList]);

  useEffect(() => {
    setDragging(isDragging.state);
  }, [isDragging]);

  // renders
  const renderDragItem = (item, itemI, grpI) => {
    if (item.type === "dropzone")
      return <DropZone key={item.id} onDrop={handleDrop} id={"dragndrop"} />;
    else
      return (
        <div
          key={item.id}
          id={item.id}
          draggable
          data-dragitem={JSON.stringify({ grpI, itemI, item })}
          className={cn(
            styles.drag_item,
            classNames.drag_item,
            getDraggingClassName({ itemI, grpI })
          )}
          onDragStart={(e) => handleDragStart(e, { grpI, itemI, item })}
          onDragEnter={
            dragging ? (e) => handleDragEnter(e, { itemI, grpI, item }) : null
          }
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {
            item.items.length > 0 ? (
              <section className={styles.innerContainer}>
                <DragnDrop
                  data={[
                    {
                      id: createId(),
                      items: item.items,
                    },
                  ]}
                  renderItem={renderItem}
                  onDrop={handleDrop}
                  onSort={onSort}
                />
              </section>
            ) : (
              renderItem(item)
            )
            // <DragItem item={item} renderItem={renderItem} />
          }
        </div>
      );
  };
  return (
    <>
      <section className={cn(styles.dragndrop, classNames.dragndrop)}>
        {list[0].items.filter((item) => item.type !== "dropzone").length >
          1 && <DropZone onDrop={handleDrop} id={"dragndrop"} />}
        {list.map((grp, grpI) => (
          <div
            key={grp.id}
            className={cn(styles.dnd_group, classNames.dnd_group)}
          >
            {grp.items.map((item, itemI) => renderDragItem(item, itemI, grpI))}
          </div>
        ))}
        <DropZone onDrop={handleDrop} />
      </section>
    </>
  );
};

export default React.memo(DragnDrop);
