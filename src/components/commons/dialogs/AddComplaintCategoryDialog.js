import React, { useEffect, useRef, useState } from "react";
import {
  constants,
  getFromLocalStorage,
  serverError,
  unKnownError,
} from "../../../helperFuncs";
import useMakeRequest from "../../hooks/useMakeRequest";
import { ComplaintsAPI } from "../../../apiCalls";
import Button from "../../helpers/Button";
import TreeSystem from "./TreeSystem";
import TextInput from "../../helpers/TextInput";
import MultiSelect from "../../helpers/MultiSelect";
import SelectBox from "../../helpers/SelectBox";

const AddComplaintCategoryDialog = ({
  onSuccess = (f) => f,
  mode = "create",
  defaltValues,
  categoryId,
  category,
  categories = {},
}) => {
  const isEditMode = mode === "edit";

  // data states
  const [values, setValues] = useState({
    title: "",
    parentId: "",
  });
  const [processes, setProcesses] = useState([]);
  const [parents, setParents] = useState([]);
  const [categoryDialog, setCategoryDialog] = useState(false);

  const parentId = useRef(null);

  // main states
  const [payload, setPayload] = useState(null);

  // flags
  const [createRequest, setCreateRequest] = useState(false);

  const fillInputs = () => {
    parentId.current = defaltValues.parentId;
    setValues({
      title: defaltValues.title,
      parentId: defaltValues.parentId,
    });
  };

  useEffect(() => {
    if (isEditMode) {
      fillInputs();
    }
  }, []);

  const onParentChange = (name) => (e) => {
    parentId.current = e.target.value;
    setValues({...values, parentId: e.target.value})
  };

  const handleChange =
    (name, options = {}) =>
    (e) => {
      let value = e?.target ? e.target.value : e;
      if (options?.onlyDigits) {
        value = String(value).replace(/\D/g, "");
      }
      setValues({ ...values, [name]: value });
    };

  const createCategory = () => {
    const payload = {
      ...values,
    };
    setPayload(payload);
    setCreateRequest(true);
  };

  const [, loading] = useMakeRequest(
    isEditMode
      ? ComplaintsAPI.updateCategoryComplaint
      : ComplaintsAPI.createCategoryComplaint,
    isEditMode ? 200 : 201,
    createRequest,
    payload,
    (res) => {
      setCreateRequest(false);
      const status = isEditMode ? 200 : 201;
      if (res && res.status === status) {
        onSuccess();
      } else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    },
    categoryId
  );
  return (
    <>
      <form className="w100 mx-a relative">
        <div className="w100 mxa row">
          <TextInput
            value={values.title}
            title="عنوان"
            wrapperClassName="col-md-6 col-sm-12"
            inputClassName=""
            name="title"
            onChange={handleChange}
            required={false}
          />
          {/* <MultiSelect
            staticData={categories}
            strings={{ label: "پدر" }}
            isStatic={true}
            wrapperClassName={"col-md-6 col-sm-12"}
            nameKey="title"
            valueKey="id"
            maxHeight={300}
            singleSelect={true}
            defaultSelecteds={category ? [{ id: category.parentId }] : []}
            isInDialog={true}
            id="categories"
          /> */}
          <SelectBox
            label="پدر"
            options={categories}
            wrapperClassName={"col-md-6 col-sm-12"}
            handleChange={onParentChange}
            staticData
            name="parentId"
            value={values.parentId}
          />
        </div>
      </form>
      <div className="w100 mxa fre py1 px2 border-t-light mt1">
        <Button
          title={isEditMode ? "ویرایش دسته‌بندی" : "ایجاد دسته‌بندی"}
          className="py1 br05 bg-primary"
          onClick={createCategory}
          loading={loading}
        />
      </div>
    </>
  );
};

export default AddComplaintCategoryDialog;
