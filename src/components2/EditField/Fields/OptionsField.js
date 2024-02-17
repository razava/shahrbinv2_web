import React, { useState } from "react";
import useFields from "../../../assets2/hooks/useFields";
import { cn } from "../../../utils/functions";
import Icon from "../../Icon/Icon";
import TextInput from "../../TextInput/TextInput";
import styles from "../styles.module.css";

const OptionsField = ({
  fieldName = "",
  fieldLabel = "",
  values = [],
  props = {},
}) => {
  // states
  const [options, setOptions] = useState(values);

  // hooks
  const { addChange } = useFields();

  // functions
  const handleChange = (value, name, option) => {
    const newOptions = options.map((o) => {
      if (o.id === option.id) {
        o[name] = value;
        return o;
      } else return o;
    });
    setOptions(newOptions);
  };

  const cloneOption = (option) => (e) => {
    e.stopPropagation();
    let newOptions = options.slice();
    const index = newOptions.findIndex((o) => o.id === option.id);
    const newOption = {
      ...option,
    };

    newOptions.splice(index + 1, 0, newOption);
    newOptions = newOptions.map((o, i) => ({ ...o, id: `dropdown-item-${i}` }));
    setOptions(newOptions);
    addChange({ [fieldName]: newOptions });
  };

  const removeOption = (option) => (e) => {
    e.stopPropagation();
    const newOptions = options.slice().filter((o) => o.id !== option.id);
    setOptions(newOptions);
    addChange({ [fieldName]: newOptions });
  };
  return (
    <>
      <section className={styles.group}>
        {options.map((option) => (
          <div key={option.id} className={styles.option}>
            <Icon
              name="times-circle"
              classNames={{ icon: cn(styles.optionInputIcon, styles.close) }}
              onClick={removeOption(option)}
            />
            <Icon
              name="clone"
              classNames={{ icon: cn(styles.optionInputIcon, styles.clone) }}
              onClick={cloneOption(option)}
            />
            <TextInput
              value={option.value}
              name="value"
              placeholder="مقدار"
              onChange={(value, name) => handleChange(value, name, option)}
              classNames={{ input: styles.optionInput }}
            />
            <TextInput
              value={option.title}
              name="title"
              placeholder="عنوان"
              onChange={(value, name) => handleChange(value, name, option)}
              classNames={{ input: styles.optionInput }}
            />
          </div>
        ))}
      </section>
    </>
  );
};

export default OptionsField;
