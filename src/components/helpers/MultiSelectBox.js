import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import inputStyles from "../../stylesheets/input.module.css";
import MultiSelect from "react-multi-select-component";
import useMakeRequest from "../hooks/useMakeRequest";
import { fixDigit, overrideStrings } from "../../helperFuncs";

const defaultWrapperClassName = "px1 py1 w90 fcs relative";
const defaultInputClassName =
  "flex-4 f12 no-outline border-light w100 br2 text-center";
const defaultLabelClassName = "text-primary f15 ml1 flex-1 w100 text-right";

const MultiSelectBox = ({
  label = "",
  caller = (f) => f,
  className = "input",
  selecteds = [], 
  setSelected,
  isStatic = false,
  data = [],
  handle = "name",
  selectStyle = {},
  wrapperStyle = {},
  labelStyle = {},
  wrapperClassName = "",
  inputClassName = "",
  labelClassName = "",
}) => {
  const [options, setOptions] = useState(data);

  useEffect(() => {
    if (data.length > 0) {
      setOptions(data);
    }
  }, [data]);

  const [, loading] = useMakeRequest(caller, 200, !isStatic, null, (res) => {
    if (res.status === 200) {
      let options;
      if (typeof res.data[0] === "object" && res.data[0] !== null) {
        options = res.data.map((d, i) => {
          return { label: fixDigit(d[handle]), value: d.id };
        });
      } else {
        options = res.data.map((option, i) => {
          return { label: option, value: option };
        });
      }
      setOptions(options);
    }
  });

  return (
    <div
      className={[defaultWrapperClassName, wrapperClassName].join(" ")}
      style={wrapperStyle}
    >
      <label
        className={[defaultLabelClassName, labelClassName].join(" ")}
        style={labelStyle}
      >
        {label}
      </label>
      <MultiSelect
        options={options}
        value={selecteds}
        onChange={setSelected}
        isLoading={loading}
        overrideStrings={overrideStrings}
        className={[
          defaultInputClassName,
          inputClassName,
          "customMultiSelect",
        ].join(" ")}
      />
    </div>
  );
};

MultiSelectBox.propTypes = {};

export default MultiSelectBox;
