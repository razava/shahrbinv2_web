import React, { useContext } from "react";
import { AppStore } from "../../../formStore/store";
import TextField from "../Fields/TextField";
import RadioField from "../Fields/RadioField";
import CheckBoxField from "../Fields/CheckBoxField";
import OptionsField from "../Fields/OptionsField";
import TreeField from "../Fields/TreeField";

const GeneralTab = ({ tab }) => {
  //   store
  const [store] = useContext(AppStore);

  // variables
  const { edit = {} } = store;
  const { field } = edit;
  const editFields = tab.fields[field.elementType] || [];
  return (
    <>
      {editFields.map((ef) => {
        const {
          type,
          name: fieldName,
          label: fieldLabel,
          options,
          values,
          dataKey,
          treeKey,
        } = ef;
        if (type === "text")
          return (
            <TextField
              fieldName={fieldName}
              fieldLabel={fieldLabel}
              {...field}
            />
          );
        else if (type === "radio")
          return (
            <RadioField
              fieldName={fieldName}
              fieldLabel={fieldLabel}
              options={options}
              {...field}
            />
          );
        else if (type === "checkbox")
          return (
            <CheckBoxField
              fieldName={fieldName}
              fieldLabel={fieldLabel}
              options={options}
              {...field}
            />
          );
        else if (type === "options")
          return (
            <OptionsField
              fieldName={fieldName}
              fieldLabel={fieldLabel}
              values={values}
              {...field}
            />
          );
        else if (type === "tree")
          return (
            <TreeField
              fieldName={fieldName}
              fieldLabel={fieldLabel}
              dataKey={dataKey}
              treeKey={treeKey}
              {...field}
            />
          );
      })}
    </>
  );
};

export default GeneralTab;
