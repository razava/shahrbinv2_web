import React, { useState } from "react";
import TextInput from "../../../components2/TextInput/TextInput";
import TextArea from "../../../components2/TextArea/TextArea";
import RadioGroup from "../../../components2/Radio/RadioGroup";
import Optional from "../../../components2/FormEditor/Elements/Optional";
import CheckBoxGroup from "../../../components2/CheckBox/CheckBoxGroup";
import Header from "../../../components2/Header/Header";
import DropZone from "../../../components2/FileDrop/DropZone";
import Message from "../../../components2/Message/Message";

export default function CategoryForm2({ data, onChange, readOnly = true }) {
  console.log(data);
  let obj = {};
  const names = data.form.elements.map((item) => {
    if (item.elementType !== "message" || item.elementType !== "header")
      obj[item.name] = "";
  });
  const [values, setValues] = useState(obj);
  console.log(obj);
  console.log(values);
  const { category } = data;
  const handleChange = (e, name) => {
    console.log(e, name);
    setValues({ ...values, [name]: e });
    if (!readOnly) onChange({ ...values, [name]: e });
  };
  const defaultValues = JSON.parse(data.comments);
  console.log(defaultValues);
  console.log(defaultValues["عنوان 2"]);
  return (
    <div className="w-[95%] flex flex-col gap-2 mx-auto">
      {data?.form?.elements.map((item) => {
        const meta = JSON.parse(item.meta);
        if (item.elementType === "text") {
          return (
            <div
              //   style={{ order: item.order }}
              className={` order-${item.order}`}
            >
              <TextInput
                defaultValue={defaultValues[item.name]}
                name={item.name}
                onChange={handleChange}
                {...meta.props}
                editable={!readOnly}
              />
            </div>
          );
        } else if (item.elementType == "select") {
          return (
            <div
              //   style={{ order: item.order }}
              className={` order-${item.order}`}
            >
              <Optional
                defaultSelecteds={defaultValues[item.name]}
                handleChange2={handleChange}
                name={item.name}
                field={meta}
              />
            </div>
          );
        } else if (item.elementType == "textarea") {
          return (
            <div
              //   style={{ order: item.order }}
              className={` order-${item.order}`}
            >
              <TextArea
                defaultValue={defaultValues[item.name]}
                name={item.name}
                onChange={handleChange}
                readOnly={readOnly}
                {...meta.props}
              />
            </div>
          );
        } else if (item.elementType == "radio") {
          return (
            <div
              //   style={{ order: item.order }}
              className={` order-${item.order}`}
            >
              <RadioGroup
                defaultValue={defaultValues[item.name]}
                onChange={(value) => handleChange(value, item.name)}
                {...meta.props}
                disabled={false}
              />
            </div>
          );
        } else if (item.elementType == "checkbox") {
          return (
            <div
              //   style={{ order: item.order }}
              className={` order-${item.order}`}
            >
              <CheckBoxGroup
                defaults={defaultValues[item.name]}
                readOnly={true}
                // defaultSelecteds={[
                //   [
                //     {
                //       title: "گزینه 1",
                //       checked: true,
                //     },
                //     {
                //       title: "گزینه 2",
                //       checked: true,
                //     },
                //   ],
                // ]}
                name={item.name}
                onChange={handleChange}
                {...meta.props}
              />
            </div>
          );
        }
      })}
    </div>
  );
}
