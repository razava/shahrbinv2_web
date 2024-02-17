import React, { useState } from "react";
import useFields from "../../../assets2/hooks/useFields";
import TextInput from "../../TextInput/TextInput";
import styles from "../styles.module.css";

const FontSize = ({ props = {} }) => {
  //   states
  const [fontSize, setFontSize] = useState(props?.style?.input?.fontSize || 14);

  // hooks
  const { addChange, store } = useFields();

  const handleChange = (value) => {
    setFontSize(value);
    addChange({
      style: {
        ...store.edit?.field?.props?.style,
        ...{
          input: {
            ...store.edit?.field?.props?.style.input,
            fontSize: Number(value),
          },
        },
      },
    });
  };
  return (
    <>
      <section className={styles.group}>
        <span className={styles.label}>اندازه متن</span>
        <TextInput
          type="number"
          placeholder="پیش‌فرض: 10"
          onChange={handleChange}
          defaultValue={fontSize}
        />
      </section>
    </>
  );
};

export default FontSize;
