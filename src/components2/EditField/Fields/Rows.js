import React, { useState } from "react";
import useFields from "../../../assets2/hooks/useFields";
import TextInput from "../../TextInput/TextInput";
import styles from "../styles.module.css";

const Rows = ({ props = {} }) => {
  //   states
  const [rows, setRows] = useState(
    Math.floor(props?.style?.input?.minHeight / 25) || 3
  );

  // hooks
  const { addChange, store } = useFields();

  const handleChange = (value) => {
    setRows(value);
    addChange({
      style: {
        ...store.edit?.field?.props?.style,
        ...{
          input: {
            ...store.edit?.field?.props?.style.input,
            minHeight: Number(value) * 25,
          },
        },
      },
    });
  };
  return (
    <>
      <section className={styles.group}>
        <span className={styles.label}>تعداد ردیف‌ها</span>
        <TextInput
          type="number"
          placeholder="پیش‌فرض: 3"
          onChange={handleChange}
          defaultValue={rows}
        />
      </section>
    </>
  );
};

export default Rows;
