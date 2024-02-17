import React, { useState } from "react";
import useFields from "../../../assets2/hooks/useFields";
import TextInput from "../../TextInput/TextInput";
import styles from '../styles.module.css';

const TextField = ({ fieldName = "", fieldLabel = "", props = {} }) => {
  // state
  const [value, setValue] = useState(props[fieldName]);

  //   hooks
  const { addChange } = useFields();

  const handleChange = (value) => {
    setValue(value);
    addChange({ [fieldName]: value });
  };
  return (
    <>
      <form className={styles.group}>
        <span className={styles.label}>{fieldLabel}</span>
        <TextInput
          name={fieldName}
          value={value}
          onChange={handleChange}
          englishOnly={false}
        />
      </form>
    </>
  );
};

export default TextField;
