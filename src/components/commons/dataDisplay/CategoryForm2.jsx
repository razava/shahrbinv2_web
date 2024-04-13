import React, { useState } from "react";
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
  console.log(data);
  let obj = {};
  const [values, setValues] = useState(obj);
  console.log(obj);
  console.log(values);
  
  const handleChange = (e, name) => {
    console.log(e, name);
    setValues({ ...values, [name]: e });
    if (!readOnly) onChange({ ...values, [name]: e });
  };

  const defaultValues = JSON.parse(data?.comments)?.values;
  const formId = JSON.parse(data?.comments)?.formId;

  //queries
  const { data: categoryForm, isLoading } = useQuery({
    queryKey: ["CategoryForm", formId],
    queryFn: () => getCategoryFormById(formId),
  });
  console.log(categoryForm);

  const findValue = (order) => {
    console.log(order);
    const obj = defaultValues.find((item) => item.id == order);
    return obj.value;
  };

  return (
    <div className="w-[95%] flex flex-col gap-2 mx-auto">
      {categoryForm?.elements.map((item,idx) => {
        console.log(item);
        const meta = JSON.parse(item.meta);
        if (item.elementType === "text") {
          return (
            <div
              style={{ order: item.order }}
              // className={` order-${item.order}`}
              key={idx}
            >
              <TextInput
                defaultValue={findValue(item.order)}
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
              style={{ order: item.order }}
              // className={` order-${item.order}`}
              key={idx}
            >
              <Optional
                defaultSelecteds={findValue(item.order)}
                handleChange2={handleChange}
                name={item.name}
                field={meta}
              />
            </div>
          );
        } else if (item.elementType == "textarea") {
          return (
            <div
              style={{ order: item.order }}
              // className={` order-${item.order}`}
              key={idx}
            >
              <TextArea
                defaultValue={findValue(item.order)}
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
              style={{ order: item.order }}
              // className={` order-${item.order}`}
              key={idx}
            >
              <RadioGroup
                defaultValue={findValue(item.order)}
                onChange={(value) => handleChange(value, item.name)}
                {...meta.props}
                disabled={false}
              />
            </div>
          );
        } else if (item.elementType == "checkbox") {
          return (
            <div
              style={{ order: item.order }}
              // className={` order-${item.order}`}
              key={idx}
            >
              <CheckBoxGroup
                defaults={findValue(item.order)}
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
