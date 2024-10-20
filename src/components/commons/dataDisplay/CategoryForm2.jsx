import React, { useEffect, useState } from "react";
import TextInput from "../../../components2/TextInput/TextInput";
import TextArea from "../../../components2/TextArea/TextArea";
import RadioGroup from "../../../components2/Radio/RadioGroup";
import Optional from "../../../components2/FormEditor/Elements/Optional";
import CheckBoxGroup from "../../../components2/CheckBox/CheckBoxGroup";
import Header from "../../../components2/Header/Header";
import DropZone from "../../../components2/FileDrop/DropZone";
import Message from "../../../components2/Message/Message";
import { getCategoryFormById } from "../../../api/commonApi";
import { useQuery } from "@tanstack/react-query";

export default function CategoryForm2({ data, onChange, readOnly = true }) {
  const defaultValues = JSON.parse(data?.comments.replace(/[\n\t\r]/g, ''))?.values;
  const formId = JSON.parse(data?.comments.replace(/[\n\t\r]/g, ''))?.formId;

  //queries
  const { data: categoryForm, isLoading } = useQuery({
    queryKey: ["CategoryForm", formId, defaultValues],
    queryFn: () => getCategoryFormById(formId),
  });

  let obj = {};
  const [values, setValues] = useState(obj);

  const handleChange = (e, name, index, element) => {
    console.log(e);
    const newValues = values.map((item) => {
      console.log(item.id, index);
      if (item.id === index) {
        return { ...item, value: e };
      }
      return item;
    });
    setValues(newValues);
    console.log(newValues);
    onChange({ formId: formId, values: newValues });
    if (element?.elementType == "dropzone") {
      console.log("dropzone");
    }
  };

  useEffect(() => {
    if (categoryForm) {
      const sortedElements = categoryForm?.elements.sort(
        (a, b) => a.order - b.order
      );

      const filteredElements = sortedElements?.filter(
        (item) => !["message", "header", "dropzone"].includes(item.elementType)
      );
      const allValues = filteredElements.map((item, idx) => {
        return { id: item.order, name: item.name, value: "" };
      });
      setValues(allValues);
    }
  }, [categoryForm]);

  console.log(defaultValues);
  const findValue = (order) => {
    const obj = defaultValues.find((item) => item.id == order);
    return obj.value.replace(/[\n\t\r]/g, '');
  };

  return (
    <div className="w-[95%] flex flex-col gap-2 mx-auto">
      {categoryForm?.elements.map((item, idx) => {
        const meta = JSON.parse(item.meta.replace(/[\n\t\r]/g, ''));
        if (item.elementType === "text") {
          return (
            <div style={{ order: item.order }} key={idx}>
              <TextInput
                defaultValue={findValue(item.order)}
                name={item.name}
                onChange={(e, name) => handleChange(e, name, item.order, item)}
                {...meta.props}
                editable={!readOnly}
              />
            </div>
          );
        } else if (item.elementType == "select") {
          return (
            <div style={{ order: item.order }} key={idx}>
              <Optional
                defaultSelecteds={findValue(item.order)}
                handleChange2={(e, name) =>
                  handleChange(e, name, item.order, item)
                }
                name={item.name}
                field={meta}
              />
            </div>
          );
        } else if (item.elementType == "textarea") {
          return (
            <div style={{ order: item.order }} key={idx}>
              <TextArea
                defaultValue={findValue(item.order)}
                name={item.name}
                onChange={(e, name) => handleChange(e, name, item.order, item)}
                readOnly={readOnly}
                {...meta.props}
              />
            </div>
          );
        } else if (item.elementType == "radio") {
          return (
            <div style={{ order: item.order }} key={idx}>
              <RadioGroup
                defaultValue={findValue(item.order)}
                onChange={(value) =>
                  handleChange(value, item.name, item.order, item)
                }
                {...meta.props}
                disabled={false}
              />
            </div>
          );
        } else if (item.elementType == "checkbox") {
          return (
            <div style={{ order: item.order }} key={idx}>
              <CheckBoxGroup
                defaults={findValue(item.order)}
                readOnly={!meta.props.editable}
                name={item.name}
                onChange={(e, name) => handleChange(e, name, item.order, item)}
                {...meta.props}
              />
            </div>
          );
        }
      })}
    </div>
  );
}
