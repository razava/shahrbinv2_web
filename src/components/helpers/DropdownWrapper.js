import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../stylesheets/dropdown.module.css";
import Dropdown from "./Dropdown";
import useClick from "../hooks/useClick";
// import useClick from "../hooks/useClick";

const DropDownWrapper = ({
  children,
  toggleElement = <div></div>,
  className = "",
  position = "right",
  theme = { background: "#000", color: "#fff" },
  scroll = false,
  scrollHeight = 120,
  toggleStyle = {},
  dropDownStyle = {},
  dropItemStyle = {},
  toggleClassName = "",
  dropDownClassName = "",
  dropItemClassName = "",
  index,
  total,
}) => {
  const [show, setShow] = useState(false);
  const [bounding, setBounding] = useState({});

  const wrapperRef = useRef(null);

  const [isClicked, setIsClicked] = useClick(wrapperRef);

  useEffect(() => {
    if (isClicked) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [isClicked]);

  const handleOutsideClick = (e) => {
    setIsClicked(!isClicked);
  };
  return (
    <>
      <div
        className={[
          styles.dropdownWrapper,
          className,
          show ? styles.show : "",
        ].join(" ")}
        onClick={handleOutsideClick}
        ref={wrapperRef}
      >
        <div
          className={[styles.toggle, styles[className], toggleClassName].join(
            " "
          )}
          data-toggle={true}
          style={toggleStyle}
        >
          {toggleElement}
        </div>
        <Dropdown
          position={position}
          theme={theme}
          scroll={scroll}
          scrollHeight={scrollHeight}
          dropDownStyle={dropDownStyle}
          dropItemStyle={dropItemStyle}
          dropDownClassName={dropDownClassName}
          dropItemClassName={dropItemClassName}
          upper={total < 3 ? false : index <= total - 3 ? true : false}
        >
          {children}
        </Dropdown>
      </div>
    </>
  );
};

DropDownWrapper.propTypes = {
  toggleElement: PropTypes.object,
  className: PropTypes.string,
  position: PropTypes.string,
  theme: PropTypes.object,
};

export default React.memo(DropDownWrapper);
