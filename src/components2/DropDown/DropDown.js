import React, { useEffect, useRef, useState } from "react";
import styles from "./dropdown.module.css";
import useClick from "../../components/hooks/useClick";
import DropDownBody from "./DropDownBody";
import DropDownItem from "./DropDownItem";

const DropDown = ({
  position = "bottom",
  scroll = false,
  scrollHeight = 120,
  classNames = {
    wrapper: "",
    toggle: "",
  },
  style = {
    wrapper: {},
    toggle: {},
  },
  renderToggle = (f) => f,
  onChange = (f) => f,
  animationType = "scale",
  activator = "click",
  options = [],
  defaultSelecteds = [],
  single = true,
  name = "",
  inDialog = false,
  multiple = false,
}) => {
  //   refrences
  const wrapperRef = useRef(null);
  const toggleRef = useRef(null);

  // states
  const [show, setShow] = useState(false);
  const [selecteds, setSelecteds] = useState(defaultSelecteds);
  const [dropdownStyle, setDropdownStyle] = useState({});

  //   hooks
  const [isClicked, setIsClicked] = useClick(wrapperRef);

  //   effects
  useEffect(() => {
    if (activator === "click") {
      if (isClicked) {
        setShow(true);
      } else {
        setShow(false);
      }
    }
  }, [isClicked]);

  //   functions
  const handleOutsideClick = (e) => {
    setIsClicked(!isClicked);
  };

  const onMouseOver = () => {
    if (activator === "hover") {
      setShow(true);
    }
  };

  const onMouseLeave = () => {
    if (activator === "hover") {
      setShow(false);
    }
  };
  console.log(options);
  const handleChange = (selected) => {
    let newSelected;
    if (single) {
      newSelected = [selected];
      onChange(newSelected[0], name);
    } else {
      const exists = selecteds.find((s) => s.value === selected.value);
      if (exists) {
        newSelected = selecteds.filter((s) => s.value !== selected.value);
      } else {
        newSelected = [...selecteds, selected];
      }
      onChange(newSelected, name);
    }
    setSelecteds(newSelected);
  };
  // useEffect(() => {
  //   console.log(selecteds);
  // }, [selecteds]);
  //   renders
  const renderToggleWrapper = () => {
    return (
      <div
        className={toggleClassName}
        data-toggle={true}
        ref={toggleRef}
        style={style.toggle}
      >
        {renderToggle(
          options.filter((option) =>
            selecteds.find((s) => s.value === option.value)
          )
        )}
      </div>
    );
  };

  //   classNames
  const wrapperClassName = [
    styles.wrapper,
    show ? styles.show : "",
    classNames.wrapper,
  ].join(" ");

  const toggleClassName = [styles.toggle, classNames.toggle].join(" ");

  // useEffect(() => {
  //   console.log(defaultSelecteds);
  //   if (defaultSelecteds) setSelecteds([defaultSelecteds]);
  // }, [defaultSelecteds]);

  useEffect(() => {
    if (inDialog) {
      const style = {
        position: "absolutey",
        zIndex: 10000,
      };
      const boundings = toggleRef.current.getBoundingClientRect();
      style.top = "76px";
      style.left = "0px";
      style.width = boundings.width;
      setDropdownStyle(style);
    }
  }, []);

  // options.map((option) => {
  //   console.log(selecteds);
  //   console.log(option.id);
  //   selecteds.map((s) => {
  //     console.log(s.id, option.id);
  //     if (s.id == option.id) {
  //       return 111;
  //     }
  //   });
  //   console.log(!!selecteds.find((s) => s.id === option.id));
  // });

  return (
    <>
      <section
        className={wrapperClassName}
        style={style.wrapper}
        onClick={handleOutsideClick}
        ref={wrapperRef}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        {renderToggleWrapper()}
        <DropDownBody
          position={position}
          scroll={scroll}
          scrollHeight={scrollHeight}
          classNames={classNames}
          animationType={animationType}
          toggler={toggleRef}
          style={dropdownStyle}
        >
          {options.map((option) => (
            <DropDownItem
              key={option.id}
              {...option}
              onClick={handleChange}
              isSelected={!!selecteds.find((s) => s.id === option.id)}
              single={single}
            />
          ))}
        </DropDownBody>
      </section>
    </>
  );
};

export default React.memo(DropDown);
