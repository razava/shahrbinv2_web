import React, { useEffect, useState } from "react";
import DialogToggler from "../helpers/DialogToggler";
import SubjectDialog from "../commons/dataDisplay/SubjectDialog";
import TextInput from "./TextInput";

const modalRoot = document && document.getElementById("modal-root");

const ChooseSubject = ({
  placeholder = "انتخاب کنید.",
  label = "گروه موضوعی",
  wrapperClassName = "",
  inputClassName = "",
  setCategoryId = (f) => f,
  categoryId = null,
  multiple = false,
  setCategoryTitle = (f) => f,
  categoryTitle = "",
  toggler = false,
  children,
}) => {
  const [dialog, setDialog] = useState(false);
  const [selecteds, setSelecteds] = useState([]);
  const [subject, setSubject] = useState([]);

  const handleClick = (e) => {
    modalRoot.classList.add("active");
    setDialog(true);
  };

  const removeSelecteds = (id) => {
    const newSelecteds = selecteds.filter((a) => a.id !== id);
    setSelecteds(newSelecteds);
    setSubject(newSelecteds);
    setCategoryId(id, "remove");
    setCategoryTitle("");
  };

  useEffect(() => {
    if (selecteds.length > 0) {
      setCategoryTitle(selecteds.slice(-1)[0].title);
    }
  }, [selecteds]);
  return (
    <>
      {toggler ? (
        <div onClick={handleClick} className="pointer">
          {toggler}
        </div>
      ) : (
        <TextInput
          readOnly={true}
          wrapperClassName={wrapperClassName}
          inputClassName={inputClassName}
          placeholder={placeholder}
          title={label}
          required={false}
          onClick={handleClick}
          value={categoryTitle}
          inputClassName="text-primary pointer"
        />
      )}
      <DialogToggler
        condition={dialog}
        setCondition={setDialog}
        isUnique={false}
        width={500}
        height={500}
        outSideClick={false}
      >
        <SubjectDialog
          setCategoryId={setCategoryId}
          setCategoryTitle={setCategoryTitle}
          setDialog={setDialog}
          categoryId={categoryId}
          setSelecteds={setSelecteds}
          selecteds={selecteds}
          setSubject={setSubject}
          subject={subject}
          onDelete={removeSelecteds}
          multiple={multiple}
        />
      </DialogToggler>
    </>
  );
};

ChooseSubject.propTypes = {};

export default ChooseSubject;
