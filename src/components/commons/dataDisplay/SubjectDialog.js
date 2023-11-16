import React, { useEffect, useState } from "react";
import { CommonAPI } from "../../../apiCalls";
import useMakeRequest from "../../hooks/useMakeRequest";
import { fixDigit } from "../../../helperFuncs";
import Loader from "../../helpers/Loader";

const modalRoot = document && document.getElementById("modal-root");

const SubjectDialog = ({
  setCategoryId,
  setDialog,
  multiple = false,
  selecteds,
  setSelecteds = (f) => f,
  onDelete = (f) => f,
  subject,
  setSubject = (f) => f,
  setCategoryTitle = (f) => f,
}) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState([]);
  const [selectBoxes, setSelectBoxes] = useState([
    { categories: [], level: 1 },
  ]);
  const [values, setValues] = useState([]);
  const [, loading] = useMakeRequest(
    CommonAPI.getSubjectGroups,
    200,
    true,
    null,
    (res) => {
      if (res.status === 200) {
        setSelectBoxes([
          {
            categories: res.data.categories,
            level: level,
            title: res.data.title,
          },
        ]);
        setData(res.data.categories);
        setLevel(++level);
      }
    }
  );

  const applyChanges = () => {
    const selecteds = subject;
    setSelecteds(selecteds);
    setDialog(false);
    if (modalRoot.children.length === 1) {
      modalRoot.classList.remove("active");
    }
  };

  useEffect(() => {
    const lastBox = selectBoxes.slice(-1)[0];
    if (lastBox.categories.length === 0 && lastBox.level !== 1) {
      setCategoryId(values.slice(-1)[0]);
    }
  }, [values.length]);

  const handleChange = (selectbox) => (e) => {
    if (level > selectbox.level) {
      if (level - selectbox.level === 1) {
        const value = e.target.value;
        let newValues = values;
        newValues[newValues.length - 1] = value;
        const newSeletBoxes = selectBoxes.filter(
          (s, i) => i + 1 <= selectbox.level
        );
        const currentData = newSeletBoxes.filter(
          (s, i) => s.level === selectbox.level
        )[0].categories;
        const selectedGroup = currentData.filter(
          (d, i) => d.id === parseInt(value)
        )[0];
        setSubject([...subject, { title: selectedGroup.title, id: value }]);
        setSelectBoxes([
          ...newSeletBoxes,
          {
            categories: selectedGroup.categories,
            level: selectbox.level + 1,
          },
        ]);
        setValues(newValues);
        setLevel(level);
      } else {
        const value = e.target.value;
        let newValues = values;
        newValues = newValues.filter((v, i) => i + 1 <= selectbox.level);
        newValues[newValues.length - 1] = value;
        const newSeletBoxes = selectBoxes.filter(
          (s, i) => i + 1 <= selectbox.level
        );
        const subjects = newSeletBoxes.map((selectBox) => selectBox.title);
        const currentData = newSeletBoxes.filter(
          (s, i) => s.level === selectbox.level
        )[0].categories;
        const selectedGroup = currentData.filter(
          (d, i) => d.id === parseInt(value)
        )[0];
        setSelectBoxes([
          ...newSeletBoxes,
          {
            categories: selectedGroup.categories,
            level: selectbox.level + 1,
          },
        ]);
        setValues(newValues);
        setLevel(selectbox.level + 1);
      }
      return;
    }
    if (level === selectbox.level) {
      const value = e.target.value;
      let newValues = [...values, value];
      setValues(newValues);
      const currentData = selectBoxes.filter((s, i) => s.level === level)[0]
        .categories;
      const selectedGroup = currentData.filter(
        (d, i) => d.id === parseInt(value)
      )[0];
      if (selectedGroup.categories.length === 0) {
        setSubject([...subject, { title: selectedGroup.title, id: value }]);
      }
      setSelectBoxes([
        ...selectBoxes,
        {
          categories: selectedGroup.categories,
          level: level + 1,
          title: selectedGroup.title,
        },
      ]);
      setLevel((level) => level + 1);
    }
  };

  return (
    <>
      {loading && <Loader absolute={true} />}
      <div className="fcc py4" style={{width: 400}}>
        <h1>انتخاب گروه موضوعی</h1>
        {selecteds.length > 0 &&
          (multiple ? (
            selecteds.map((s, i) => (
              <div className="flex-center-row">
                <span className="f3 pointer" onClick={() => onDelete(s.id)}>
                  &times;
                </span>
                <input value={s.title} readOnly={true} className={"select"} />
              </div>
            ))
          ) : (
            <div className="flex-center-row">
              <span
                className="f3 pointer"
                onClick={() => onDelete(selecteds.slice(-1)[0].id)}
              >
                &times;
              </span>
              <input
                value={selecteds.slice(-1)[0].title}
                readOnly={true}
                className={"select"}
              />
            </div>
          ))}
        {selectBoxes.map((select, i) => {
          return (
            select.categories.length > 0 && (
              <div className="select-group" key={i}>
                <label className="select-label bg-primary">
                  {fixDigit(select.level)}
                </label>
                <select
                  key={i}
                  value={
                    values[select.level - 1] === undefined
                      ? ""
                      : values[select.level - 1]
                  }
                  onChange={handleChange(select, select.level)}
                  className="select"
                >
                  <option value="">انتخاب کنید</option>
                  {select.categories.map((category, j) => (
                    <option key={j} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
            )
          );
        })}
        <div className="flex-row-center">
          <button
            type="button"
            className="btn"
            onClick={() => applyChanges(subject)}
          >
            اعمال
          </button>
        </div>
      </div>
    </>
  );
};

export default SubjectDialog;
