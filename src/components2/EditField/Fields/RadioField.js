import React from "react";
import useFields from "../../../assets2/hooks/useFields";
import RadioGroup from "../../Radio/RadioGroup";
import styles from "../styles.module.css";

const RadioField = ({
  fieldName = "",
  fieldLabel = "",
  options = [],
  props = {},
}) => {
  // hooks
  const { addChange } = useFields();

  const handleChange = (option) => {
    addChange({ [fieldName]: option.value });
  };
  return (
    <>
      <section className={styles.group}>
        <RadioGroup
          label={fieldLabel}
          nameKey="title"
          valueKey="value"
          options={options}
          row={false}
          defaultValue={options.find((t) => t.value === props[fieldName])}
          onChange={handleChange}
        />
      </section>
    </>
  );
};

export default RadioField;
