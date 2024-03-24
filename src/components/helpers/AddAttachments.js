import React, { useRef } from "react";
import TextInput from "./TextInput";

const AddAttachments = ({
  handleChange,
  title = "پیوست",
  wrapperClassName = "",
  inputClassName = "",
  attachments = [],
  toggle,
  toggleWrapperClassName = "",
}) => {
  const fileInputRef = useRef(null);

  const openPicker = () => fileInputRef?.current.click();

  return (
    <>
      <input
        type="file"
        onChange={handleChange}
        style={{ display: "none" }}
        id="fileAttachment"
        accept="image/*"
        ref={fileInputRef}
      />
      {toggle ? (
        <div onClick={openPicker} className={toggleWrapperClassName}>
          {toggle}
        </div>
      ) : (
        <TextInput
          placeholder={title}
          wrapperClassName={wrapperClassName}
          inputClassName={inputClassName}
          onClick={openPicker}
          readOnly={true}
        />
      )}
      {attachments.length > 0 && (
        <span className="f2 mx-1">{attachments.length} فایل اضافه شد.</span>
      )}
    </>
  );
};

export default AddAttachments;
