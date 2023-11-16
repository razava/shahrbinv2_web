import React, { useState } from "react";
import TextInput from "../../helpers/TextInput";

const TimeSelect = ({
  wrapperClassName = "",
  label = "",
  disabled = false,
  name = "",
  onChange = (f) => f,
}) => {
  // states
  const [values, setValues] = useState({
    day: 0,
    hour: 0,
    minute: 0,
  });

  //   functions
  const handleChange = (inputName) => (e) => {
    const value = e.target.value;
    const newValues = { ...values, [inputName]: Number(value) };
    setValues(newValues);
    onChange(name)(newValues);
  };

  const handleMaximum = (maximum, name) => {
    if (Number(values[name]) > Number(maximum))
      setValues({ ...values, [name]: maximum });
  };

  return (
    <>
      <div className={["fsc", wrapperClassName].join(" ")}>
        {label && <span className="f12 text-primary">{label}</span>}
        <div className="flex-1 frs">
          <TextInput
            inputClassName={"sq50 ml1 br1"}
            placeholder="روز"
            name="day"
            wrapperClassName="px0 w-auto"
            min={0}
            type="number"
            onChange={handleChange}
            value={values.day}
            disabled={disabled}
            title="روز"
            required={false}
          />
          <TextInput
            inputClassName={"sq50 ml1 br1"}
            placeholder="ساعت"
            name="hour"
            wrapperClassName="px0 w-auto"
            min={0}
            max={23}
            type="number"
            onChange={handleChange}
            value={values.hour}
            onBlur={() => handleMaximum(23, "hour")}
            disabled={disabled}
            title="ساعت"
            required={false}
          />
          <TextInput
            inputClassName={"sq50 ml1 br1"}
            placeholder="دقیقه"
            name="minute"
            wrapperClassName="px0 w-auto"
            min={0}
            max={59}
            type="number"
            onChange={handleChange}
            value={values.minute}
            onBlur={() => handleMaximum(59, "minute")}
            disabled={disabled}
            title="دقیقه"
            required={false}
          />
        </div>
      </div>
    </>
  );
};

export default TimeSelect;
