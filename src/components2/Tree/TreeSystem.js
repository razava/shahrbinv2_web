import React, { useEffect, useRef, useState } from "react";
import Dialog from "../Dialog/Dialog";
import TextInput from "../TextInput/TextInput";
import TreeItem from "./TreeItem";
import styles from "./styles.module.css";
import { createId } from "../../utils/functions";

const TreeSystem = ({
  treeKey = "child_categories",
  nameKey = "title",
  valuekey = "id",
  title = "",
  onChange = (f) => f,
  defaultSelecteds = [],
  singleSelect = false,
  onClose,
  reset = false,
  name = "",
  data = {},
  style = {},
  placeholder = "",
  label = "",
  renderToggle,
  edit = false,
}) => {
  // refs
  const searchInputRef = useRef(null);

  // data states
  const [flatData, setFlatData] = useState([]);
  const [allData, setAllData] = useState({});
  const [displayedData, setDisplayedData] = useState(data[treeKey] || []);
  const [selecteds, setSelecteds] = useState(defaultSelecteds);
  const [searchText, setSearchText] = useState("");
  const [addItemTitle, setAddItemTitle] = useState("");
  const [categoryD, setCategoryD] = useState(false);
  const [addD, setAddD] = useState({ dialog: false, data: null, mode: "" });

  useEffect(() => {
    setSelecteds(defaultSelecteds);
    const flatData = getFlatData(data);
    setFlatData(flatData);
    setAllData(JSON.parse(JSON.stringify(data)));
  }, [data, defaultSelecteds]);

  const getFlatData = (data) => {
    if (!data[treeKey]) return [];
    const flatData = [];
    data[treeKey].forEach((d) => {
      const branches = getAllBranches(d);
      flatData.push(d);
      flatData.push(...branches);
    });
    return flatData;
  };

  const handleSelecting = ({ value, item }) => {
    if (singleSelect) {
      const children = getAllBranches(item);
      const isNode = !children.length;
      // if (isNode) {
      if (value) {
        setSelecteds([item]);
      } else {
        setSelecteds([]);
      }
      // }
    } else {
      const children = getAllBranches(item);
      if (value) {
        setSelecteds([...selecteds, item]);
      } else {
        setSelecteds(selecteds.filter((s) => s.id !== item.id));
        // const parent = findParent(item);
        // const shouldParentDeselect =
        //   parent &&
        //   parent[treeKey].filter((a) => selecteds.some((s) => s.id === a.id))
        //     .length === 1;
        // if (shouldParentDeselect) {
        //   setSelecteds(
        //     selecteds.filter(
        //       (s) => ![...children, item, parent].find((a) => a.id === s.id)
        //     )
        //   );
        // } else {
        //   setSelecteds(
        //     selecteds.filter(
        //       (s) => ![...children, item].find((a) => a.id === s.id)
        //     )
        //   );
        // }
      }
    }
  };

  const isSelected = (item) => {
    const children = getAllBranches(item);
    return singleSelect
      ? !!selecteds.find((s) => s.id === item.id)
      : children.length > 0
      ? children.some((c) => selecteds.find((s) => s.id === c.id))
      : !!selecteds.find((s) => s.id === item.id);
  };

  const getAllBranches = (item) => {
    const children = [];
    item[treeKey].forEach((child) => {
      children.push(child);
      children.push(...getAllBranches(child));
    });
    return children;
  };

  const findParent = (item) => {
    const allNodes = getAllBranches(data);
    let parent;
    for (let i = 0; i < allNodes.length; i++) {
      const node = allNodes[i];
      if (node[treeKey].some((n) => n.id === item.id)) {
        parent = node;
        break;
      }
    }
    return parent;
  };

  const onAddItem = (item) => {
    setAddD({ dialog: true, data: item, mode: "create" });
  };

  const onEditItem = (item) => {
    setAddD({ dialog: true, data: item, mode: "edit" });
    setAddItemTitle(item[nameKey]);
  };

  const addItem = () => {
    const item = addD.data;
    const { mode } = addD;
    let newDisPlayedData = {
      [treeKey]: JSON.parse(JSON.stringify(displayedData)),
    };
    if (mode === "create") findAndAdd(newDisPlayedData, item);
    if (mode === "edit") findAndEdit(newDisPlayedData, item);
    setDisplayedData(newDisPlayedData[treeKey]);
    closeAddDialog();
  };

  const findAndAdd = (data = {}, parent) => {
    if (data[valuekey] === parent[valuekey]) {
      const itemToAdd = {
        [nameKey]: addItemTitle,
        [treeKey]: [],
        [valuekey]: createId(),
      };
      data[treeKey].push(itemToAdd);
    } else {
      for (let i = 0; i < data[treeKey].length; i++) {
        findAndAdd(data[treeKey][i], parent);
      }
    }
  };

  const findAndEdit = (data = [], item) => {
    if (data[valuekey] === item[valuekey]) {
      data[nameKey] = addItemTitle;
    } else {
      for (let i = 0; i < data[treeKey].length; i++) {
        findAndEdit(data[treeKey][i], item);
      }
    }
  };

  const closeDialog = () => {
    setCategoryD(false);
  };

  const closeAddDialog = () => {
    setAddD({ dialog: false, data: null, mode: "" });
    setAddItemTitle("");
  };

  const onConfirmClick = (e) => {
    e.stopPropagation();
    if (edit) onChange({ ...data, [treeKey]: displayedData }, name);
    else onChange(selecteds, name);
    if (onClose) onClose();
    else closeDialog();
  };

  const onRemoveClick = (e) => {
    e.stopPropagation();
    setSelecteds([]);
    if (edit) onChange(data, name);
    else onChange([], name);
    if (onClose) onClose();
    else closeDialog();
  };

  const onSearch = (name) => (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value === "") {
      setDisplayedData(data[treeKey]);
      return;
    }
    const newData = flatData.filter((d) => d[nameKey].includes(value));
    setDisplayedData(newData);
  };

  const clear = () => {
    setSelecteds([]);
    setSearchText("");
  };

  // effects
  useEffect(() => {
    if (reset) {
      clear();
    }
  }, [reset]);

  useEffect(() => {
    if (categoryD) {
      searchInputRef?.current?.focus();
      setDisplayedData(data[treeKey]);
    } else {
      setDisplayedData([]);
    }
  }, [categoryD, searchInputRef.current]);
  return (
    <>
      {renderToggle ? (
        renderToggle(setCategoryD)
      ) : (
        <TextInput
          editable={false}
          classNames={{ input: styles.toggleInput }}
          onClick={() => setCategoryD(true)}
          placeholder={placeholder}
          label={label}
        />
      )}
      <Dialog
        visible={categoryD}
        onClose={closeDialog}
        classNames={{ container: styles.categoryD }}
        id="treesystem"
        title={edit ? "ویرایش" : title}
        buttons={[
          {
            id: "treesystem-btn-2",
            title: "پاک کردن",
            onClick: onRemoveClick,
            type: "error",
          },
          {
            id: "treesystem-btn-1",
            title: "تایید",
            onClick: onConfirmClick,
            type: "primary",
          },
        ]}
      >
        <section
          className={styles.treeSystem}
          style={{ maxHeight: 500, ...style }}
        >
          <TextInput
            name="searchText"
            value={searchText}
            onChange={onSearch}
            placeholder="جستجو کنید"
            wrapperClassName="mxa"
            forwardInputRef={searchInputRef}
          />
          {displayedData.map((item) => (
            <TreeItem
              key={item.id}
              item={item}
              treeKey={treeKey}
              nameKey={nameKey}
              valuekey={valuekey}
              selecteds={selecteds}
              handleSelecting={handleSelecting}
              isSelected={isSelected}
              findParent={findParent}
              onAddItem={onAddItem}
              onEditItem={onEditItem}
              edit={edit}
            />
          ))}
        </section>
      </Dialog>

      <Dialog
        visible={addD.dialog}
        onClose={closeAddDialog}
        classNames={{ container: styles.addD }}
        id="addItemToTree"
        title={"عنوان"}
        buttons={[
          {
            id: "add-item-to-tree-btn-2",
            title: "انصراف",
            onClick: closeAddDialog,
            type: "error",
          },
          {
            id: "add-item-to-tree-btn-1",
            title: "تایید",
            onClick: addItem,
            type: "primary",
          },
        ]}
      >
        <TextInput
          placeholder="عنوان گزینه"
          value={addItemTitle}
          onChange={(value) => setAddItemTitle(value)}
        />
      </Dialog>
    </>
  );
};

export default React.memo(TreeSystem);
