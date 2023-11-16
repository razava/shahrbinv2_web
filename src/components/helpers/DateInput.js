import React from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker2";
import moment from "moment-jalaali";

const defaultWrapperClassName = "px1 py1 w90 fcs relative";
const defaultInputClassName =
  "flex-4 f12 no-outline border-light w100 py1 br2 text-center";
const defaultLabelClassName = "text-primary f15 ml1 flex-1 w100 text-right";

const DateInput = ({
  title = "",
  value = null,
  handleChange = (f) => f,
  name = "",
  wrapperClassName = "",
  inputClassName = "",
  labelClassName = "",
}) => {
  return (
    <div className={`${defaultWrapperClassName} ${wrapperClassName}`}>
      <label className={`${defaultLabelClassName} ${labelClassName}`}>
        {title}
      </label>
      <DatePicker
        isGregorian={false}
        timePicker={false}
        value={typeof value === "string" ? moment(new Date(value)) : value}
        onChange={(value) => handleChange(name)(value)}
        className={`${defaultInputClassName} ${inputClassName}`}
      />
    </div>
  );
};

DateInput.propTypes = {
  title: PropTypes.string,
  handleChange: PropTypes.func,
  name: PropTypes.string,
};

export default React.memo(DateInput);
