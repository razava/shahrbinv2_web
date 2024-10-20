import React, { useEffect, useState } from "react";
import DropDown from "../../DropDown/DropDown";
import TextInput from "../../TextInput/TextInput";

const Optional = ({
  field = {},
  defaultSelecteds = [],
  readOnly = false,
  handleChange2,
  name,
}) => {
  const [selecteds, setSelecteds] = useState([defaultSelecteds]);

  const handleChange = (selecteds) => {
    if (!readOnly) {
      setSelecteds(selecteds);
      handleChange2(selecteds, name);
    }
  };
  console.log(defaultSelecteds);
  console.log(selecteds);
  useEffect(() => {
    if (defaultSelecteds) {
      setSelecteds([defaultSelecteds]);
    }
  }, []);

  return (
    <>
      <DropDown
        {...field.props}
        position="bottom"
        animationType="rotate-x"
        defaultSelecteds={selecteds}
        inDialog
        renderToggle={(selecteds = [], removeSelecteds = (f) => f) => (
          <TextInput
            {...field.props}
            // placeholder={field.props.placeholder}
            icon={
              selecteds && selecteds.length > 0
                ? field.props.clearable
                  ? "times"
                  : ""
                : "caret-down"
            }
            value={selecteds.map((s) => s.title).join(", ")}
            onIconClick={
              selecteds && selecteds && field.props.clearable
                ? removeSelecteds
                : undefined
            }
          />
        )}
        options={field.props.options}
        onChange={handleChange}
        name={field.name}
      />
    </>
  );
};

export default Optional;
