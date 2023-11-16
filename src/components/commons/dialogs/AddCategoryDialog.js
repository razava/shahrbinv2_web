import React, { useEffect, useRef, useState } from "react";
import styles from "../../../stylesheets/reportdialog.module.css";
import { ConfigurationsAPI, ProcessesAPI } from "../../../apiCalls";
import Button from "../../helpers/Button";
import {
  constants,
  getFromLocalStorage,
  serverError,
  unKnownError,
} from "../../../helperFuncs";
import useMakeRequest from "../../hooks/useMakeRequest";
import MultiSelect from "../../helpers/MultiSelect";
import TextInput from "../../helpers/TextInput";
import SelectBox from "../../helpers/SelectBox";
import Textarea from "../../helpers/Textarea";

const objectionValues = [
  {
    value: 1,
    title: "بله",
  },
  {
    value: 0,
    title: "خیر",
  },
];

const AddCategoryDialog = ({
  onSuccess = (f) => f,
  mode = "create",
  defaltValues,
  categoryId,
  category,
}) => {
  const isEditMode = mode === "edit";

  // data states
  const [values, setValues] = useState({
    title: "",
    processId: "",
    order: "",
    code: "",
    responseDuration: "",
    duration: "",
    description: "",
    objectionAllowed: "",
  });
  const [processes, setProcesses] = useState([]);
  const [parents, setParents] = useState([]);
  const parentId = useRef(null);

  // main states
  const [payload, setPayload] = useState(null);

  // flags
  const [createRequest, setCreateRequest] = useState(false);

  const getData = () => {
    const token = getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);

    const processes = new Promise((resolve, reject) => {
      ConfigurationsAPI.getProcesses(token).then((res) => {
        if (res && res.status === 200) resolve(res);
        else reject(res);
      });
    });
    const parents = new Promise((resolve, reject) => {
      ConfigurationsAPI.getCategories(token).then((res) => {
        if (res && res.status === 200) resolve(res);
        else reject(res);
      });
    });
    return Promise.all([processes, parents]);
  };

  const fillInputs = () => {
    parentId.current = defaltValues.parentId;
    setValues({
      title: defaltValues.title,
      processId: defaltValues.processId,
      order: defaltValues.order,
      code: defaltValues.code,
      responseDuration: defaltValues.responseDuration / 24,
      duration: defaltValues.duration / 24,
      description: defaltValues.description,
      objectionAllowed: defaltValues.objectionAllowed ? 1 : 0,
    });
  };

  useEffect(() => {
    if (isEditMode) {
      fillInputs();
    }

    getData().then((res) => {
      setProcesses(res[0]?.data);
      setParents(res[1]?.data);
    });
  }, []);

  const onParentChange = (value) => {
    parentId.current = value && value[0]?.id;
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
      responseDuration: values.responseDuration * 24,
      duration: values.duration * 24,
      objectionAllowed: Number(values.objectionAllowed) === 1 ? true : false,
      parentId: parentId.current,
      processId: values.processId ? values.processId : null,
    };
    setPayload(payload);
    setCreateRequest(true);
  };

  const [, loading] = useMakeRequest(
    isEditMode
      ? ConfigurationsAPI.updateCategory
      : ConfigurationsAPI.createCategory,
    isEditMode ? 204 : 201,
    createRequest,
    payload,
    (res) => {
      setCreateRequest(false);
      const status = isEditMode ? 204 : 201;
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
          <MultiSelect
            strings={{ label: "پدر" }}
            caller={ConfigurationsAPI.getCategories}
            isStatic={false}
            wrapperClassName={"col-md-6 col-sm-12"}
            nameKey="title"
            valueKey="id"
            maxHeight={300}
            singleSelect={true}
            onChange={onParentChange}
            defaultSelecteds={category ? [{ id: category.parentId }] : []}
            isInDialog={true}
            id="categories"
          />
        </div>
        <div className="w100 mxa row">
          <SelectBox
            value={values.processId}
            label="فرآیند"
            caller={ConfigurationsAPI.getProcesses}
            wrapperClassName="col-md-6 col-sm-12"
            inputClassName=""
            name="processId"
            handleChange={handleChange}
            required={false}
          />
          <SelectBox
            value={values.objectionAllowed}
            label="امکان تجدید نظر"
            staticData={true}
            options={objectionValues.map((v) => ({ ...v, id: v.value }))}
            wrapperClassName="col-md-6 col-sm-12"
            inputClassName=""
            name="objectionAllowed"
            handleChange={handleChange}
            required={false}
          />
        </div>
        <div className="w100 mxa row">
          <TextInput
            value={values.order}
            title="ترتیب"
            wrapperClassName="col-md-6 col-sm-12"
            inputClassName=""
            name="order"
            onChange={handleChange}
            required={false}
          />
          <TextInput
            value={values.code}
            title="کد"
            wrapperClassName="col-md-6 col-sm-12"
            inputClassName=""
            name="code"
            onChange={handleChange}
            required={false}
          />
        </div>
        <div className="w100 mxa row">
          <TextInput
            value={values.responseDuration}
            title="ضرب‌العجل پاسخگویی"
            wrapperClassName="col-md-6 col-sm-12"
            inputClassName=""
            name="responseDuration"
            onChange={handleChange}
            required={false}
            placeholder="روز"
          />
          <TextInput
            value={values.duration}
            title="ضرب‌العجل اتمام"
            wrapperClassName="col-md-6 col-sm-12"
            inputClassName=""
            name="duration"
            onChange={handleChange}
            required={false}
            placeholder="روز"
          />
        </div>
        <div className="w100 mxa row">
          <Textarea
            value={values.description}
            title="توضیحات"
            wrapperClassName="col-md-12"
            inputClassName=""
            name="description"
            handleChange={handleChange}
            required={false}
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

export default AddCategoryDialog;
