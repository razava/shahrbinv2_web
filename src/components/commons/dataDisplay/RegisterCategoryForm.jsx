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
export default function RegisterCategoryForm({
  data,
  onChange,
  addAttachment,
}) {
  console.log(data.category.form.elements);
  let obj = {};
  const { category } = data;

  const sortedElements = category?.form?.elements.sort(
    (a, b) => a.order - b.order
  );

  const filteredElements = sortedElements.filter(
    (item) => !["message", "header", "dropzone"].includes(item.elementType)
  );
  console.log(filteredElements);
  const allValues = filteredElements.map((item, idx) => {
    return { id: item.order, name: item.name, value: "" };
  });

  useEffect(() => {
    onChange(allValues);
  }, []);

  console.log(allValues);
  const [values, setValues] = useState(allValues);
  // console.log(name[]);

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
    onChange(newValues);
    if (element?.elementType == "dropzone") {
      console.log("dropzone");
      addAttachment(e);
    }
  };

  console.log(sortedElements);

  return (
    <div className="w-full flex flex-col gap-2">
      {sortedElements.map((item, index) => {
        const meta = JSON.parse(item.meta);
        if (item.elementType === "text") {
          return (
            <div
              style={{ order: item.order }}
              // className={` order-${item.order} `}
            >
              <TextInput
                name={item.name}
                onChange={(e, name) => handleChange(e, name, item.order, item)}
                {...meta.props}
              />
            </div>
          );
        } else if (item.elementType == "select") {
          return (
            <div
              style={{ order: item.order }}
              // className={` order-${item.order}`}
            >
              <Optional
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
            <div
              style={{ order: item.order }}
              // className={` order-${item.order} `}
            >
              <TextArea
                name={item.name}
                onChange={(e, name) => handleChange(e, name, item.order, item)}
                {...meta.props}
              />
            </div>
          );
        } else if (item.elementType == "radio") {
          return (
            <div
              style={{ order: item.order }}
              // className={` order-${item.order}`}
            >
              <RadioGroup
                onChange={(value) =>
                  handleChange(value, item.name, item.order, item)
                }
                {...meta.props}
              />
            </div>
          );
        } else if (item.elementType == "checkbox") {
          return (
            <div
              style={{ order: item.order }}
              // className={` order-${item.order}`}
            >
              <CheckBoxGroup
                name={item.name}
                onChange={(e, name) => handleChange(e, name, item.order, item)}
                defaultSelecteds={[]}
                {...meta.props}
              />
            </div>
          );
        } else if (item.elementType == "header") {
          return (
            <div
              style={{ order: item.order }}
              // className={` order-${item.order}`}
            >
              <Header {...meta.props} />
            </div>
          );
        } else if (item.elementType == "dropzone") {
          return (
            <div
              style={{ order: item.order }}
              className={` order-${item.order}`}
            >
              <DropZone
                onChange={(value) =>
                  handleChange(value, item.name, item.order, item)
                }
                {...meta.props}
              />
            </div>
          );
        } else if (item.elementType == "message") {
          return (
            <div
              style={{ order: item.order }}
              // className={` order-${item.order}`}
            >
              <Message {...meta.props} />
            </div>
          );
        }
      })}
    </div>
  );
}
