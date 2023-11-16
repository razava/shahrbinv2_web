import React, { useEffect, useRef, useState } from "react";
import { ConfigurationsAPI, QuickAccessAPI } from "../../../apiCalls";
import {
  callAPI,
  fixURL,
  serverError,
  unKnownError,
} from "../../../helperFuncs";
import MultiSelect from "../../helpers/MultiSelect";
import TextInput from "../../helpers/TextInput";
import useMakeRequest from "../../hooks/useMakeRequest";
import styles from "../../../stylesheets/reportdialog.module.css";
import Button from "../../helpers/Button";

const AddQuickAccessDialog = ({
  setLoading = (f) => f,
  onSuccess = (f) => f,
  mode = "create",
  defaltValues,
  accessId,
}) => {
  const isEditMode = mode === "edit";

  const parentId = useRef(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  // data states
  const [values, setValues] = useState({
    title: "",
    order: "",
  });
  const [image, setImage] = useState(null);

  // other states
  const [payload, setPayload] = useState(null);

  // flags
  const [createRequest, setCreateRequest] = useState(false);
  const [preview, setPreview] = useState(false);

  const fillInputs = (data) => {
    parentId.current = data?.categoryId;
    setValues({
      title: data?.title,
      order: data?.order,
    });
    previewRef.current.src = fixURL(data?.media?.url3, false);
    setPreview(true);
    setImage(data?.media?.url3);
  };

  useEffect(() => {
    if (isEditMode) {
      fillInputs(defaltValues);
    }
  }, []);

  const handleChange = (name, onlyDigit) => (e) => {
    let value = e.target ? e.target.value : e;
    if (onlyDigit) {
      value = String(value).replace(/\D/g, "");
    }
    setValues({ ...values, [name]: value });
  };

  const handleImageChange = (e) => {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];

    setImage(file);
    showPreview(file);
  };

  const showPreview = (image) => {
    const reader = new FileReader();

    reader.onload = () => {
      previewRef.current.src = reader.result;
      setPreview(true);
    };

    reader.readAsDataURL(image);
  };

  const clearPreview = (e) => {
    if (e) e.stopPropagation();
    setImage(null);
    setPreview(false);
  };

  const createAccess = () => {
    const payload = new FormData();
    payload.append("title", values.title);
    payload.append("order", values.order);
    payload.append("categoryId", parentId.current);
    payload.append("image", image);
    setPayload(payload);
    setCreateRequest(true);
  };

  const onParentChange = (value) => {
    parentId.current = value && value[0]?.id;
  };

  const [, loading] = useMakeRequest(
    isEditMode ? QuickAccessAPI.editAccess : QuickAccessAPI.createAccess,
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
    accessId
  );
  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="d-none"
        onChange={handleImageChange}
      />

      <section className="w90 mxa fcc">
        <div className="w100 mxa row">
          <MultiSelect
            strings={{ label: "دسته‌بندی" }}
            caller={ConfigurationsAPI.getCategories}
            isStatic={false}
            nameKey="title"
            valueKey="id"
            maxHeight={200}
            singleSelect={true}
            onChange={onParentChange}
            defaultSelecteds={
              defaltValues?.categoryId ? [{ id: defaltValues?.categoryId }] : []
            }
            wrapperClassName="col-md-12"
            id="categories"
          />
        </div>
        <div className="w100 mxa row">
          <TextInput
            title="عنوان"
            required={false}
            value={values.title}
            name="title"
            onChange={handleChange}
            wrapperClassName="col-md-12"
          />
        </div>
        <div className="w100 mxa row">
          <TextInput
            title="ترتیب"
            required={false}
            value={values.order}
            name="order"
            onChange={handleChange}
            wrapperClassName="col-md-12"
            onlyDigit={true}
          />
        </div>
        <div className="w100 mxa row">
          <TextInput
            title="تصویر"
            required={false}
            name="image"
            onClick={() => fileInputRef.current.click()}
            wrapperClassName="col-md-12"
            inputClassName="pointer"
            readOnly={true}
            placeholder="انتخاب کنید."
            icon={image ? "fas fa-times" : ""}
            onIconClick={clearPreview}
          />
        </div>
        <img
          className={`sq75 border-mute br1 f3 my1 text-mute ${
            preview ? "frc" : "d-none"
          }`}
          ref={previewRef}
        />
        {!preview && (
          <span className="sq75 border-mute br1 f3 frc my1 text-mute">
            <i className="fas fa-image"></i>
          </span>
        )}
      </section>
      <div className="w100 mxa fre py1 px2 border-t-light mt1">
        <Button
          title={isEditMode ? "ویرایش" : "ایجاد"}
          className="py1 br05 bg-primary"
          onClick={createAccess}
          loading={loading}
        />
      </div>
    </>
  );
};

export default AddQuickAccessDialog;
