import React from "react";

const CheckBox = ({
  checked = false,
  onChange = (f) => f,
  label = "",
  id = "",
  wrapperClassName = "",
  inputClassName = "",
  labelClassName = "",
}) => {
  return (
    <>
      <div className={[wrapperClassName].join(" ")}>
        <input
          type="checkbox"
          checked={checked}
          className={["sq15 ml1", inputClassName].join(" ")}
          onChange={(e) => onChange(e.target.checked, id)}
          id={id}
        />
        {label && (
          <label htmlFor={id} className={labelClassName}>
            {label}
          </label>
        )}
      </div>
    </>
  );
};

export default CheckBox;
