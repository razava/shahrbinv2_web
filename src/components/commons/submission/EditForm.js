import React, { useState } from "react";
import { toast } from "react-toastify";
import { CommonAPI, UserInfoAPI } from "../../../apiCalls";
import { callAPI, fixDigit } from "../../../helperFuncs";
import Button from "../../helpers/Button";
import Loader from "../../helpers/Loader";
import MultiSelect from "../../helpers/MultiSelect";
import TextInput from "../../helpers/TextInput";

const modalRoot = document && document.getElementById("modal-root");

const EditForm = ({
  setCondition,
  fields = [],
  caller = (f) => f,
  successCallback = (f) => f,
  values = {},
}) => {
  // data states
  const [formData, setFormData] = useState({
    firstName: values.firstName || "",
    lastName: values.lastName || "",
    userName: values.userName || "",
    phoneNumber: values.phoneNumber || "",
    password: values.password || "",
    organization: values.organization || "",
    title: values.title || "",
  }); // form data
  const [roles, setRoles] = useState([]); // roles given to user
  const [regions, setRegions] = useState([]); // regions given to user

  // flags
  const [loading, setLoading] = useState(false); // loader status

  const hanldeChange = (name, onlyDigit) => (e) => {
    let value = e.target.value;
    if (onlyDigit) {
      value = removeNonDigits(value);
    }
    const isValid = phoneNumberValidation(value, name);
    if (isValid) {
      value = "09" + value;
    }
    setFormData({ ...formData, [name]: value });
  };

  // remove non digits
  const removeNonDigits = (value) =>
    fixDigit(value, true).replace(/[^0-9]/g, "");

  const phoneNumberValidation = (value, name) =>
    name === "phoneNumber" &&
    !String(value).startsWith("09") &&
    value.length > 1;

  // prepare payload for submit
  const getPayload = () => {
    const selectedRoles = roles.map((role) => role.roleName);
    const selectedRegions = regions.map((region) => region.id);
    const payload = {
      ...formData,
      roles: selectedRoles,
      regionIds: selectedRegions,
    };
    return payload;
  };

  // prepare and send request
  const registerUser = (e) => {
    const payload = getPayload();
    setLoading(true);
    callAPI({
      caller,
      successStatus: 200,
      payload,
      successCallback: (res) => {
        successCallback(res);
        toast(
          res.data.message ? res.data.message : "ویرایش با موفقیت انجام شد.",
          { type: "success" }
        );
      },
      requestEnded: () => {
        modalRoot.classList.remove("active");
        setCondition(false);
        setLoading(false);
      },
    });
  };

  const shouldBeVisible = (name) => fields.indexOf(name) !== -1;
  return (
    <>
      {loading && <Loader />}
      <form className="w100 frc wrap relative py2 px2">
        {shouldBeVisible("firstName") && (
          <TextInput
            value={formData.firstName}
            onChange={hanldeChange}
            name="firstName"
            title={"نام"}
            required={false}
            wrapperClassName="rw3"
          />
        )}
        {shouldBeVisible("lastName") && (
          <TextInput
            value={formData.lastName}
            onChange={hanldeChange}
            name="lastName"
            title={"نام خانوادگی"}
            required={false}
            wrapperClassName="rw3 of-hidden"
          />
        )}
        {shouldBeVisible("userName") && (
          <TextInput
            value={formData.userName}
            onChange={hanldeChange}
            name="userName"
            title={"نام کاربری"}
            required={false}
            wrapperClassName="rw3"
          />
        )}
        {shouldBeVisible("password") && (
          <TextInput
            value={formData.password}
            onChange={hanldeChange}
            name="password"
            title={"رمز عبور"}
            required={false}
            wrapperClassName="rw3"
            type="password"
          />
        )}
        {shouldBeVisible("title") && (
          <TextInput
            value={formData.title}
            onChange={hanldeChange}
            name="title"
            title={"عنوان"}
            required={false}
            wrapperClassName="rw3"
          />
        )}
        {shouldBeVisible("roles") && (
          <MultiSelect
            wrapperClassName="rw3"
            strings={{ label: "نقش ها" }}
            caller={UserInfoAPI.getRolesForCreate}
            defaultSelecteds={[]}
            onChange={setRoles}
            isStatic={false}
            maxHeight={300}
            nameKey="displayName"
            valueKey="roleName"
            id="roles-list"
          />
        )}
        {shouldBeVisible("regions") && (
          <MultiSelect
            wrapperClassName="rw3"
            strings={{ label: "مناطق" }}
            caller={CommonAPI.getYazdRegions}
            defaultSelecteds={[]}
            onChange={setRegions}
            isStatic={false}
            maxHeight={300}
            nameKey="name"
            valueKey="id"
            id="regions-list"
          />
        )}
        {shouldBeVisible("organization") && (
          <TextInput
            value={formData.organization}
            onChange={hanldeChange}
            name="organization"
            title={"سازمان"}
            required={false}
            wrapperClassName="rw3 of-hidden"
          />
        )}
        {shouldBeVisible("phoneNumber") && (
          <TextInput
            value={formData.phoneNumber}
            onChange={hanldeChange}
            name="phoneNumber"
            title={"تلفن همراه"}
            required={false}
            wrapperClassName="rw3"
            onlyDigit={true}
            maxLength="11"
          />
        )}
      </form>
      <div className="w90 my-2 flex-center-row">
        <Button title="ایجاد کاربر" fullWidth={true} onClick={registerUser} />
      </div>
    </>
  );
};

export default EditForm;
