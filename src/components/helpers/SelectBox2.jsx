import React from "react";
import Select from "react-select";
import { components } from "react-select";
import useMakeRequest from "../hooks/useMakeRequest";
import styles from "../../stylesheets/input.module.css";
const modalRoot = document && document.getElementById("modal-root");
const SelectBox = ({
  staticData = false,
  handleChange = (f) => (f) => f,
  placeholder = "انتخاب کنید",
  value = "",
  options = [],
  caller = (f) => f,
  label = "",
  wrapperClassName = "",
  inputClassName = "",
  labelClassName = "",
  horizontal = true,
  name = "executive",
  handle = ["title"],
  selectStyle = {},
  wrapperStyle = {},
  labelStyle = {},
  disabled = false,
  defaultStyles = true,
}) => {
  const [data, loading] = useMakeRequest(
    caller,
    200,
    !staticData,
    null,
    (res) => {
      if (res.status === 200 && res.data.length === 1) {
        handleChange(name)(res.data[0]?.id);
      }
    }
  );
  console.log(value);
  const CustomOption = ({ children, ...props }) => {
    const handleOptionClick = (event) => {
      event.preventDefault();
      // Prevent event propagation
      event.stopPropagation();
    };

    return (
      <components.Option {...props} onClick={handleOptionClick}>
        {children}
      </components.Option>
    );
  };

  const CustomMenu = (props) => {
    const handleMenuClick = (event) => {
      // Prevent event propagation
      event.stopPropagation();
      // Handle menu click...
    };

    return <components.Menu {...props} onClick={handleMenuClick} />;
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "1px solid #000" : "1px solid #ccc",
      boxShadow: state.isFocused ? "0 0 3px rgba(0, 0, 0, 0.1)" : "none",
      "&:hover": {
        border: "1px solid #000",
      },
      zIndex: 200,
    }),
  };

  const selectOptions = staticData
    ? options.map((o) => ({
        value: o.id,
        label: handle.map((h) => o[h]).join(" "),
      }))
    : data.map((d) => ({
        value: d.id,
        label: handle.map((h) => d[h]).join(" "),
      }));

  return (
    <div
      className={[
        defaultStyles ? styles.inputWrapper : "",
        wrapperClassName,
      ].join(" ")}
      style={wrapperStyle}
    >
      {label && (
        <label
          className={[
            defaultStyles ? styles.inputLabel : "",
            labelClassName,
          ].join(" ")}
          style={labelStyle}
        >
          {label}
        </label>
      )}
      <Select
        value={selectOptions.find((option) => option.value === value.id)}
        options={selectOptions}
        onChange={(selectedOption) => handleChange(name)(selectedOption.value)}
        placeholder={placeholder}
        menuPortalTarget={modalRoot}
        onMenuOpen={(event) => {
          // event.stopPropagation();
        }}
        openMenuOnClick={(event) => {
          // event.stopPropagation();
        }}
        // components={{ Option: CustomOption, Menu: CustomMenu }}
        isDisabled={disabled}
        styles={customStyles}
      />
    </div>
  );
};

SelectBox.propTypes = {};

export default React.memo(SelectBox);
