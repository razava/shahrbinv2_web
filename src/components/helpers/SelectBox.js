import React from "react";
import useMakeRequest from "../hooks/useMakeRequest";
import styles from "../../stylesheets/input.module.css";

const defaultWrapperClassName = "px1 py05 w90 d-flex fdc al-s ju-c relative";
const defaultInputClassName =
  "f15 no-outline w100 py1 bg-white text-dark br05 text-center border-light";
const defaultLabelClassName =
  "bg-white text-color f12 mr2 w-auto text-right mb-1 d-flex z1 px1";

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

  return (
    <>
      {horizontal ? (
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
          <select
            value={value?.id ? value.id : value}
            disabled={disabled}
            onChange={handleChange(name)}
            className={[defaultStyles ? styles.input : "", inputClassName].join(
              " "
            )}
            style={selectStyle}
          >
            <option value={""}>{placeholder}</option>
            {staticData &&
              options.map((o, i) => (
                <option key={i} value={o.id} style={{backgroundColor: o?.level ? o.level == "up" ? "#87D37C" : "#f55353" : "white"}}>
                  {handle.map((h, i) => o[h]).join(" ")}
                </option>
              ))}
            {!staticData &&
              data.length > 0 &&
              data.map((d, i) => (
                <option key={i} value={d.id}>
                  {handle.map((h, i) => d[h]).join(" ")}
                </option>
              ))}
          </select>
        </div>
      ) : (
        <div
          className={[defaultWrapperClassName, wrapperClassName].join(" ")}
          style={wrapperStyle}
        >
          {label && (
            <label
              className={[defaultLabelClassName, labelClassName].join(" ")}
            >
              {label}
            </label>
          )}
          <select
            value={value.id ? value.id : value}
            onChange={handleChange(name)}
            className={[defaultInputClassName, inputClassName].join(" ")}
            style={selectStyle}
          >
            <option value={""}>{placeholder}</option>
            {staticData &&
              options.length > 0 &&
              options.map((o, i) => (
                <option key={i} value={o.id}>
                  {handle.map((h, i) => o[h]).join(" ")}
                </option>
              ))}
            {!staticData &&
              data.length > 0 &&
              data.map((d, i) => (
                <option key={i} value={d.id}>
                  {handle.map((h, i) => d[h]).join(" ")}
                </option>
              ))}
          </select>
        </div>
      )}
    </>
  );
};

SelectBox.propTypes = {};

export default React.memo(SelectBox);
