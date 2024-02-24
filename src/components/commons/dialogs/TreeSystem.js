import React, { useEffect, useRef, useState } from "react";
import Button from "../../helpers/Button";
import DialogToggler from "../../helpers/DialogToggler";
import TextInput from "../../helpers/TextInput";
import useMakeRequest from "../../hooks/useMakeRequest";
import DialogButtons from "./DialogButtons";
import TreeItem from "./TreeItem";

const modalRoot = document && document.getElementById("modal-root");

const buttonsStyle = {
  bottom: 0,
  right: 0,
  left: 0,
  transition: "all 0.3s",
};

const TreeSystem = ({
  caller = new Promise((resolve) => resolve([])),
  isStatic = false,
  staticData = [],
  children,
  condition,
  setCondition = (f) => f,
  treeKey = "categories",
  nameKey = "title",
  valuekey = "id",
  onChange = (f) => f,
  defaultSelecteds = [],
  singleSelect = false,
  onClose,
  renderToggler = (f) => f,
  reset = false,
  mode,
}) => {
  // refs
  const searchInputRef = useRef(null);

  // data states
  const [data, setData] = useState(isStatic ? staticData : []);
  const [allData, setAllData] = useState(isStatic ? staticData : []);
  const [flatData, setFlatData] = useState([]);
  const [displayedData, setDisplayedData] = useState(
    isStatic ? staticData[treeKey] : []
  );
  const [selecteds, setSelecteds] = useState(defaultSelecteds);
  const [confirmedSelecteds, setConfirmedSelecteds] = useState([]);
  const [searchText, setSearchText] = useState("");

  // let loading;

  const [, loading] = useMakeRequest(caller, 200, !isStatic, null, (res) => {
    if (res.status === 200) {
      setData(res.data);
      setAllData(res.data);
      setDisplayedData(res.data[treeKey]);
      const flatData = getFlatData(res.data);
      setFlatData(flatData);
    }
  });

  // useEffect(() => {
  //   if (condition) {
  //     setSelecteds(confirmedSelecteds);
  //   }
  // }, [condition]);
  useEffect(() => {
    if (defaultSelecteds.length > 0) {
      setSelecteds(defaultSelecteds)
    }
  },[defaultSelecteds])
  console.log(selecteds);
  console.log(defaultSelecteds);
  useEffect(() => {
    // setSelecteds(defaultSelecteds);
    if (isStatic) {
      const flatData = getFlatData(staticData);
      setFlatData(flatData);
    }
  }, []);

  // *********************temporary***************
  // useEffect(() => {
  //   setSelecteds((prev) => {
  //     return defaultSelecteds;
  //   });
  // }, [defaultSelecteds]);
  // *********************temporary***************

  const getFlatData = (data) => {
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
      console.log(item);
      const children = getAllBranches(item);
      // console.log(children);
      const isNode = !children.length;
      if (isNode) {
        if (value) {
          console.log(value);
          setSelecteds([item]);
        } else {
          setSelecteds([item]);
        }
      }
      if (mode == "Add") {
        setSelecteds([item]);
      }
    } else {
      console.log("111");
      const children = getAllBranches(item);
      if (value) {
        setSelecteds([...selecteds, ...children, item]);
      } else {
        const parent = findParent(item);
        const shouldParentDeselect =
          parent &&
          parent[treeKey].filter((a) => selecteds.some((s) => s.id === a.id))
            .length === 1;
        if (shouldParentDeselect) {
          setSelecteds(
            selecteds.filter(
              (s) => ![...children, item, parent].find((a) => a.id === s.id)
            )
          );
        } else {
          setSelecteds(
            selecteds.filter(
              (s) => ![...children, item].find((a) => a.id === s.id)
            )
          );
        }
      }
    }
  };

  const isSelected = (item) => {
    // console.log(item);
    const children = getAllBranches(item);
    if (mode == "Add") {
      return !!selecteds.find((s) => s.id === item.id);
    }
    return children.length > 0
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

  const closeDialog = () => {
    setCondition(false);
    modalRoot.classList.remove("active");
  };

  const onConfirmClick = (e) => {
    e.stopPropagation();
    onChange(selecteds);
    setConfirmedSelecteds(selecteds);
    if (onClose) onClose();
    else closeDialog();
  };

  const onRemoveClick = (e) => {
    e.stopPropagation();
    setSelecteds([]);
    setConfirmedSelecteds([]);
    onChange([]);
    if (onClose) onClose();
    else closeDialog();
  };

  const onSearch = (name) => (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value === "") {
      setDisplayedData(allData[treeKey]);
      return;
    }
    const newData = flatData.filter((d) => d[nameKey].includes(value));
    // newData.map((d) => {
    //   if(!findParent(d)) {

    //   } else return d;
    // })
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
    if (condition) {
      searchInputRef.current.focus();
    }
  }, [condition, searchInputRef.current]);
  return (
    <>
      {renderToggler(selecteds, flatData)}
      <DialogToggler
        condition={condition}
        setCondition={setCondition}
        isUnique={false}
        width={600}
        height={600}
        loading={loading}
        id="treesystem"
      >
        <section
          className="d-flex fdc w100 of-auto-y pb5 scrollbar"
          style={{ maxHeight: 500 }}
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
            />
          ))}
        </section>

        <DialogButtons
          primaryTitle="تایید"
          secondaryTitle="پاک‌کردن"
          onPrimaryClick={onConfirmClick}
          onSecondaryClick={onRemoveClick}
          wrapperClassName="absolute b0"
        />
      </DialogToggler>
    </>
  );
};

export default React.memo(TreeSystem);
