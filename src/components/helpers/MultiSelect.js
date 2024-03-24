import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { callAPI } from "../../helperFuncs";
import { AppStore } from "../../store/AppContext";
import useClick from "../hooks/useClick";
import useResize from "../hooks/useResize";
import TextInput from "./TextInput";

const defaultStrings = {
  choosePlaceholder: "انتخاب کنید.",
  label: "",
  allSelected: "همه گزینه‌ها انتخاب شده‌اند.",
  search: "جستجو",
};

const modalSelectListWrapper =
  document && document.getElementById("modal-selectlist");

const MultiSelect = ({
  nameKey = "name",
  valueKey = "id",
  staticData = [],
  isStatic = true,
  caller = (f) => new Promise((rs, rj) => rs()),
  requestArgs = [],
  strings = {},
  wrapperClassName = "",
  inputClassName = "",
  labelClassName = "",
  onChange = (f) => f,
  defaultSelecteds = [],
  singleSelect = false,
  defaultStyles = true,
  maxHeight = "auto",
  isInDialog = false,
  id = "",
}) => {
  //   references
  const clickRef = useRef(null);
  const selectListRef = useRef(null);

  // data states
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedText, setSelectedText] = useState("");

  //   other states

  //   flags
  const [loading, setLoading] = useState(false);

  const [isActive, setIsActive] = useClick(clickRef, "click", [selectListRef]);
  let flatData = [];
  const flat = (data) => {
    data.categories.map((item) => {
      flatData.push(item);
      if (item.categories) {
        flat(item);
      }
    });
  };
  const getFlatData = (Data) => {
    flat(Data);

    return flatData;
  };
  const getData = () => {
    setLoading(true);
    callAPI(
      {
        caller: caller,
        requestEnded: () => setLoading(false),
        successCallback: (res) => {
          console.log(res);
          if (id == "categories") {
            const flatData = getFlatData(res.data);
            console.log(flatData);
            setData(flatData);
          } else {
            setData(res.data);
          }
        },
        errorCallback: (res) => setOptions([]),
      },
      ...requestArgs
    );
  };

  const formatData = (data, shouldUpdate = true) => {
    const options = data.map((d, i) => {
      return { ...d, selected: false };
    });
    console.log(options, "ff");
    setOptions(options);
    if (shouldUpdate) {
      handleDefaultSelecteds(defaultSelecteds, options);
    }
    return options;
  };

  useEffect(() => {
    if (isStatic) {
      setTimeout(() => {
        setData(staticData);
      }, 500);
      // formatData(staticData);
    }
  }, [staticData]);

  useEffect(() => {
    if (!isStatic) {
      getData();
    }
  }, []);

  useEffect(() => {
    if (staticData.length > 0) {
      console.log(data);
      // formatData(data);
    }
  }, [data]);

  const onClick = (e) => {
    setIsActive(!isActive);
  };

  const handleDefaultSelecteds = (defaults, options) => {
    const newOptions = options;
    defaults.map((ds) => {
      const index = newOptions.findIndex((o) => o[valueKey] === ds[valueKey]);
      if (index !== -1) {
        newOptions[index].selected = true;
      }
    });
    setOptions(newOptions);

    formatSelectedStrings();
  };

  const handleChange = (item) => {
    let newOptions = [];
    if (singleSelect) {
      newOptions = options.map((s) => {
        if (item[valueKey] === s[valueKey]) {
          s.selected = !s.selected;
          return s;
        } else {
          s.selected = false;
          return s;
        }
      });
    } else {
      newOptions = options.map((s) => {
        if (item[valueKey] === s[valueKey]) {
          s.selected = !s.selected;
          return s;
        } else return s;
      });
    }
    const selecteds = newOptions.filter((o) => o.selected);
    onChange(selecteds);
    setOptions(newOptions);
    formatSelectedStrings();
  };

  useEffect(() => {
    formatSelectedStrings();
  }, [options]);

  const formatSelectedStrings = () => {
    const selecteds = options.filter((o) => o.selected);
    if (options.length !== 0 && selecteds.length === options.length) {
      setSelectedText(
        selecteds.length === 1
          ? selecteds[0][nameKey]
          : inputStrings.allSelected
      );
    } else {
      setSelectedText(selecteds.map((s) => s[nameKey]).join(", "));
    }
  };

  const clearSelecteds = (e) => {
    e.stopPropagation();
    const newOptions = data.map((o) => {
      o.selected = false;
      return o;
    });
    setOptions(newOptions);
    onChange([]);
  };

  const handleSearch = (name) => (e) => {
    const value = e.target.value;
    setSearchText(value);
    search(value);
  };

  const search = (value) => {
    if (value === "") {
      setOptions(formatData(data));
      return;
    }
    const results = data.filter((o) => String(o[nameKey]).includes(value));

    setOptions(results);
  };

  useEffect(() => {
    handleDefaultSelecteds(defaultSelecteds, options);
  }, [defaultSelecteds]);

  const inputStrings = { ...defaultStrings, ...strings };
  console.log(data);
  useEffect(() => {
    if (!isStatic) {
      formatData(data);
    }
  }, [data]);

  useEffect(() => {
    if (isStatic && staticData) {
      formatData(staticData);
    }
  }, [staticData]);
  return (
    <>
      <TextInput
        placeholder={inputStrings.choosePlaceholder}
        wrapperClassName={wrapperClassName}
        inputClassName={inputClassName + "pointer"}
        labelClassName={labelClassName}
        title={inputStrings.label}
        required={false}
        onClick={onClick}
        forwardInputRef={clickRef}
        name={"multiSelect" + new Date().getTime()}
        value={selectedText}
        defaultStyles={defaultStyles}
        onChange={handleSearch}
        readOnly={true}
      >
        {options.some((o) => o.selected) && (
          <span
            className="f12 absolute pointer"
            style={{ top: "50%", left: 20 }}
            onClick={clearSelecteds}
          >
            <i className="fas fa-times"></i>
          </span>
        )}
        <ul
          className={[
            isActive ? "fcs" : "d-none",
            "animate w100 bg-color absolute br1",
          ].join(" ")}
          style={{
            top: "100%",
            zIndex: 1000,
            maxHeight,
            overflow: "auto",
          }}
        >
          {/* {options.length > 0 && ( */}
          <SelectList
            options={options}
            onChange={handleChange}
            nameKey={nameKey}
            isInDialog={isInDialog}
            inputRef={clickRef}
            selectListRef={selectListRef}
            inputStrings={inputStrings}
            isActive={isActive}
            searchText={searchText}
            onSearch={handleSearch}
            defaultStyles={defaultStyles}
            maxHeight={maxHeight}
            id={id}
          />
          {/* )} */}
        </ul>
      </TextInput>
    </>
  );
};

export default React.memo(MultiSelect);

const SelectList = ({
  options = [],
  onChange = (f) => f,
  nameKey = "",
  isInDialog = false,
  inputRef = { current: null },
  inputStrings = {},
  isActive = false,
  searchText = "",
  onSearch = (f) => f,
  defaultStyles = false,
  maxHeight = 300,
  selectListRef = {},
  id = "",
}) => {
  const [store, dispatch] = useContext(AppStore);

  // refrences
  const wrapperRef = useRef(null);

  // state
  const [style, setStyle] = useState({});

  // window resize hook
  const { windowWidth, windowHeight } = useResize();

  // variables
  const uniqueId = "select-item-" + Math.random();

  // functions
  const handleRegular = () => {
    const style = {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      display: isActive ? "flex" : "none",
      // maxHeight,
      border: "1px solid var(--light)",
      boxShadow: "0 0 10px 1px rgba(0,0,0,0.1)",
      borderRadius: 5,
    };
    setStyle(style);
  };

  const handleInDialog = () => {
    const style = {
      position: "fixed",
      zIndex: 10000000,
      backgroundColor: "var(--white)",
      opacity: isActive ? 1 : 0,
      // transform: isActive ? `translateY(0)` : `translateY(-5px)`,
      pointerEvents: isActive ? "visible" : "none",
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "column",
      maxHeight,
      overflowY: "auto",
      border: "1px solid var(--light)",
      boxShadow: "0 2px 12px 0px rgba(0,0,0,0.1)",
      borderRadius: 5,
      transition: "opacity 0.3s, transform 0.3s",
    };
    const boundings = inputRef.current.getBoundingClientRect();
    style.top = boundings?.top + boundings?.height;
    style.left = boundings?.right - boundings.width;
    style.width = boundings.width;
    setStyle(style);
  };

  // effects
  useEffect(() => {
    if (isInDialog) {
      handleInDialog();
    } else {
      handleRegular();
    }
    if (isActive) {
      dispatch({
        type: "setModals",
        payload: [
          ...store.modals,
          {
            id,
            index: store.modals.length,
          },
        ],
      });
    } else {
      const newModals = store.modals.filter((m) => m.id !== id);
      dispatch({
        type: "setModals",
        payload: newModals,
      });
    }
  }, [
    inputRef.current,
    selectListRef.current,
    isActive,
    windowWidth,
    windowHeight,
  ]);

  const renderList = () => (
    <>
      <section style={style} className="scrollbar" ref={selectListRef}>
        {/* <TextInput
          placeholder={inputStrings.search}
          wrapperClassName={isActive ? "fcs w100" : "d-none"}
          inputClassName={"w100 py1 br1 no-outline text-center relative"}
          labelClassName={""}
          required={false}
          name="searchText"
          value={searchText}
          defaultStyles={defaultStyles}
          onChange={onSearch}
          autoFocus={true}
        /> */}
        {options.length > 0 ? (
          options.map((o, i) => (
            <label
              htmlFor={uniqueId + i}
              key={i}
              className="w100 frs hv-primary trans-1 pointer py1 px1 border-b-light text-dark"
            >
              <input
                type="checkbox"
                name={uniqueId + i}
                id={uniqueId + i}
                onChange={() => onChange(o)}
                checked={o.selected}
              />
              <span className="mx1 flex-1 h100">{o[nameKey]}</span>
            </label>
          ))
        ) : (
          <span className="w100 frc f15 py1 px1">گزینه‌ای وجود ندارد.</span>
        )}
      </section>
    </>
  );

  return isInDialog
    ? ReactDOM.createPortal(renderList(), modalSelectListWrapper)
    : renderList();
};
