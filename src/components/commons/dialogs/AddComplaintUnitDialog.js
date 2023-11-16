import React, { useEffect, useRef, useState } from "react";
import {
  constants,
  getFromLocalStorage,
  serverError,
  unKnownError,
} from "../../../helperFuncs";
import useMakeRequest from "../../hooks/useMakeRequest";
import { ComplaintsAPI, InstanceManagementAPI } from "../../../apiCalls";
import Button from "../../helpers/Button";
import TreeSystem from "./TreeSystem";
import TextInput from "../../helpers/TextInput";
import MultiSelect from "../../helpers/MultiSelect";
import SelectBox from "../../helpers/SelectBox";

const AddComplaintUnitDialog = ({
  onSuccess = (f) => f,
  mode = "create",
  defaltValues,
  categoryId,
  category,
  units = {},
}) => {
  const isEditMode = mode === "edit";

  // data states
  const [values, setValues] = useState({
    title: "",
    parentId: "",
    inspectorUsername: "",
    inspectorPassword: "",
    inspectorFirstName: "",
    inspectorLastName: "",
    instanceId: null,
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
      inspectorFirstName: defaltValues.inspectorFirstName,
      inspectorLastName: defaltValues.inspectorLastName,
      inspectorUsername: defaltValues.inspectorUsername,
      inspectorPassword: defaltValues.inspectorPassword,
      instanceId: defaltValues.instanceId,
    });
  };

  useEffect(() => {
    if (isEditMode) {
      fillInputs();
    }
  }, []);

  const onParentChange = (name) => (e) => {
    parentId.current = e.target.value;
    setValues({ ...values, parentId: e.target.value });
  };

  const onInstanceChange = (name) => (e) => {
    setValues({ ...values, instanceId: e.target.value });
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
      ? ComplaintsAPI.updateOrganizationalUnitComplaint
      : ComplaintsAPI.createOrganizationalUnitComplaint,
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
          <SelectBox
            label="پدر"
            options={units}
            wrapperClassName={"col-md-6 col-sm-12"}
            handleChange={onParentChange}
            staticData
            name="parentId"
            value={values.parentId}
          />
        </div>
        <div className="w100 mxa row">
          <TextInput
            value={values.inspectorUsername}
            title="نام کاربری بازرس"
            wrapperClassName="col-md-6 col-sm-12"
            inputClassName=""
            name={"inspectorUsername"}
            onChange={handleChange}
            required={false}
          />
          <TextInput
            value={values.inspectorPassword}
            title="رمز عبور بازرس"
            wrapperClassName="col-md-6 col-sm-12"
            inputClassName=""
            name="inspectorPassword"
            onChange={handleChange}
            required={false}
            type="password"
          />
        </div>
        <div className="w100 mxa row">
          <TextInput
            value={values.inspectorFirstName}
            title="نام بازرس"
            wrapperClassName="col-md-6 col-sm-12"
            inputClassName=""
            name="inspectorFirstName"
            onChange={handleChange}
            required={false}
          />
          <TextInput
            value={values.inspectorLastName}
            title="نام خانوادگی بازرس"
            wrapperClassName="col-md-6 col-sm-12"
            inputClassName=""
            name="inspectorLastName"
            onChange={handleChange}
            required={false}
          />
        </div>
        <div className="w100 mxa row">
          <SelectBox
            label="شهر"
            caller={InstanceManagementAPI.getInstances}
            wrapperClassName={"col-md-6 col-sm-12"}
            handleChange={onInstanceChange}
            name="instanceId"
            handle={["name"]}
            value={values.instanceId}
          />
        </div>
      </form>
      <div className="w100 mxa fre py1 px2 border-t-light mt1">
        <Button
          title={isEditMode ? "ویرایش واحد سازمانی" : "ایجاد واحد سازمانی"}
          className="py1 br05 bg-primary"
          onClick={createCategory}
          loading={loading}
        />
      </div>
    </>
  );
};

export default AddComplaintUnitDialog;
