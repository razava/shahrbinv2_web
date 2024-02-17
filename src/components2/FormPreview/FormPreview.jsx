import React, { useContext } from "react";
import { AppStore } from "../../formStore/store";
import DropZone from "../FileDrop/DropZone";
import Message from "../Message/Message";

function FormPreview() {
  const [store, dispatch] = useContext(AppStore);
  console.log(store.form);
  const isChecked = (arr, title) => {
    console.log(title);
    console.log(arr);
    const data = arr.find((item) => item?.title == title);
    return data ? true : false;
  };
  return (
    <div>
      {store.form.map((item) => {
        if (item.elementType == "text") {
          return (
            <div className="mb-6">
              <label
                for="default-input"
                className="block mb-2  font-medium text-gray-900"
              >
                {item.props.label}
              </label>
              <input
                type="text"
                id="default-input"
                autoFocus={false}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4  "
                placeholder={item.props.placeholder}
              />
            </div>
          );
        } else if (item.elementType == "select") {
          return (
            <>
              <label
                for="countries"
                class="block mb-2 font-medium text-gray-900"
              >
                {item.props.label}
              </label>
              <select
                id="countries"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
              >
                <option selected>{item.props.placeholder}</option>
                {item.props.options.map((item) => {
                  return <option value={item.value}>{item.title}</option>;
                })}
              </select>
            </>
          );
        } else if (item.elementType == "textarea") {
          return (
            <>
              <label for="message" class="block mb-2 font-bold text-gray-900">
                {item.props.label}
              </label>
              <textarea
                id="message"
                rows="4"
                autoFocus={false}
                class="block p-4 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder={item.props.placeholder}
              ></textarea>
            </>
          );
        } else if (item.elementType == "radio") {
          return (
            <>
              <div
                for="default-radio-1"
                className="ml-2 text-gray-900 my-1 font-bold"
              >
                {item.props.label}
              </div>
              <div className=" flex gap-2">
                {item.props.options.map((item) => {
                  return (
                    <div className="flex items-center mb-4">
                      <input
                        id="default-radio-1"
                        type="radio"
                        value=""
                        name="default-radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                      />
                      <label
                        for="default-radio-1"
                        className="mr-2 font-medium text-gray-900 "
                      >
                        {item.title}
                      </label>
                    </div>
                  );
                })}
              </div>
            </>
          );
        } else if (item.elementType == "checkbox") {
          return (
            <>
              <div className=" text-gray-900 my-1 font-bold">
                {item.props.label}
              </div>
              <div className=" flex gap-2">
                {item.props.options.map((Item) => {
                  return (
                    <div class="flex items-center mb-4">
                      <input
                        id="default-checkbox"
                        type="checkbox"
                        value=""
                        checked={isChecked(
                          item.props.defaultSelecteds,
                          Item.title
                        )}
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
                      />
                      <label
                        for="default-checkbox"
                        class="mr-2 font-medium text-gray-900 "
                      >
                        {Item.title}
                      </label>
                    </div>
                  );
                })}
              </div>
            </>
          );
        } else if (item.elementType == "header") {
          return (
            <>
              <div className=" font-bold text-xl mt-2">{item.props.title}</div>
              <div className=" text-gray-700 mb-2">{item.props.subTitle}</div>
            </>
          );
        } else if (item.elementType == "dropzone") {
          return (
            <div className=" mt-5">
              <DropZone />
            </div>
          );
        } else if (item.elementType == "message") {
          return (
            <>
              <Message {...item.props} />
            </>
          );
        }
      })}
    </div>
  );
}

export default FormPreview;
