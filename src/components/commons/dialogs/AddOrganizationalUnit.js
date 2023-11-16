import React, { useEffect, useState } from "react";
import TextInput from "../../helpers/TextInput";
import MultiSelect from "../../helpers/MultiSelect";
import { OrganizationalUnitAPI } from "../../../apiCalls";
import styles from "../../../stylesheets/reportdialog.module.css";
import Button from "../../helpers/Button";
import useMakeRequest from "../../hooks/useMakeRequest";
import { callAPI, serverError, unKnownError } from "../../../helperFuncs";

const AddOrganizationalUnit = ({
  setLoading = (f) => f,
  onSuccess = (f) => f,
  mode = "create",
  organizationId,
}) => {
  const isEditMode = mode === "edit";

  // data states
  const [values, setValues] = useState({
    title: "",
    userName: "",
    password: "",
    actorIds: [],
    organizationalUnitIds: [],
  });
  const [defaultUnits, setDefaultUnits] = useState([]);
  const [defaultActors, setDefaultActors] = useState([]);

  // other states
  const [payload, setPayload] = useState(null);

  // flags
  const [createRequest, setCreateRequest] = useState(false);

  const fillInputs = (data) => {
    const actorIds = data.organizationalUnits
      .filter((o) => o.type === 0)
      .map((o) => {
        o.id = o.actorId;
        return o;
      });
    const organizationalUnitIds = data.organizationalUnits.filter(
      (o) => o.type === 3
    );
    setValues({
      title: data.title,
      userName: data.userName,
      password: data.password,
      actorIds: actorIds,
      organizationalUnitIds: organizationalUnitIds,
    });
    setDefaultActors(actorIds);
    setDefaultUnits(organizationalUnitIds);
  };

  const getData = () => {
    setLoading(true);
    callAPI(
      {
        caller: OrganizationalUnitAPI.getUnit,
        successStatus: 200,
        successCallback: (res) => fillInputs(res.data),
        requestEnded: (res) => setLoading(false),
      },
      organizationId
    );
  };

  useEffect(() => {
    if (isEditMode) {
      getData();
    }
  }, []);

  const handleChange =
    (name, options = {}) =>
    (e) => {
      let value = e.target ? e.target.value : e;
      if (options?.onlyDigits) {
        value = String(value).replace(/\D/g, "");
      }
      setValues({ ...values, [name]: value });
    };

  const createUnit = () => {
    const actorIds = values.actorIds.map((a) => (a.actorId ? a.actorId : a.id));
    const organizationalUnitIds = values.organizationalUnitIds.map((a) => a.id);
    const payload = {
      id: organizationId,
      title: values.title,
      actorIds,
      organizationalUnitIds,
      userName: values.userName,
      password: values.password,
    };
    setPayload(payload);
    setCreateRequest(true);
  };

  const [, loading] = useMakeRequest(
    isEditMode
      ? OrganizationalUnitAPI.updateUnit
      : OrganizationalUnitAPI.createUnit,
    isEditMode ? 204 : 200,
    createRequest,
    payload,
    (res) => {
      setCreateRequest(false);
      const status = isEditMode ? 204 : 200;
      if (res && res.status === status) {
        onSuccess();
      } else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    },
    organizationId
  );
  return (
    <>
      <form className="w90 mx-a relative fcc">
        <div className="w100 mxa row">
          <TextInput
            wrapperClassName="col-md-12"
            title="عنوان"
            required={false}
            value={values.title}
            name="title"
            onChange={handleChange}
            wrapperClassName="w100 mxa"
          />
        </div>
        <div className="w100 mxa row">
          <MultiSelect
            strings={{ label: "واحدهای اجرایی" }}
            caller={OrganizationalUnitAPI.getOrgansActors}
            isStatic={false}
            nameKey="title"
            valueKey={"id"}
            maxHeight={300}
            onChange={(values) => handleChange("actorIds")(values)}
            defaultSelecteds={defaultActors}
            isInDialog={true}
            wrapperClassName="col-md-12"
            id="organs-list"
          />
        </div>
        <div className="w100 mxa row">
          <MultiSelect
            strings={{ label: "واحدهای سازمانی" }}
            caller={OrganizationalUnitAPI.getAllOrgans}
            isStatic={false}
            nameKey="title"
            valueKey="id"
            maxHeight={300}
            onChange={(values) => handleChange("organizationalUnitIds")(values)}
            defaultSelecteds={defaultUnits}
            isInDialog={true}
            wrapperClassName="col-md-12"
            id="organizationalunits-list"
          />
        </div>
        {!isEditMode && (
          <>
            <div className="w100 mxa row">
              <TextInput
                title="نام کاربری"
                required={false}
                value={values.userName}
                name="userName"
                onChange={handleChange}
                wrapperClassName="col-md-12"
              />
            </div>
            <div className="w100 mxa row">
              <TextInput
                title="رمز عبور"
                required={false}
                value={values.password}
                name="password"
                onChange={handleChange}
                wrapperClassName="col-md-12"
                type="password"
              />
            </div>
          </>
        )}
      </form>

      <div className="w100 mxa fre py1 px2 border-t-light mt1">
        <Button
          title={isEditMode ? "ویرایش واحد سازمانی" : "ایجاد واحد سازمانی"}
          className="py1 br05 bg-primary"
          onClick={createUnit}
          loading={loading}
        />
      </div>
    </>
  );
};

export default AddOrganizationalUnit;
