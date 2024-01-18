import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { CommonAPI, UserInfoAPI } from "../../../apiCalls";
import { callAPI, fixDigit } from "../../../helperFuncs";
import { AppStore } from "../../../store/AppContext";
import Button from "../../helpers/Button";
import Loader from "../../helpers/Loader";
import MultiSelect from "../../helpers/MultiSelect";
import TextInput from "../../helpers/TextInput";

const modalRoot = document && document.getElementById("modal-root");

const RegisterForm = ({
  setCondition,
  fields = [],
  caller = (f) => f,
  successCallback = (f) => f,
  edit = false,
  values = {},
}) => {
  // store
  const [store = {}] = useContext(AppStore);
  const { initials: { instance = {} } = {} } = store;

  // data states
  const [formData, setFormData] = useState({
    firstName: edit ? values.firstName || "" : "",
    lastName: edit ? values.lastName || "" : "",
    userName: edit ? values.userName || "" : "",
    phoneNumber: edit ? values.phoneNumber || "" : "",
    password: edit ? values.password || "" : "",
    organization: edit ? values.organization || "" : "",
    title: edit ? values.title || "" : "",
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
    let payload;
    if (edit) {
      // payload = new FormData();
      const editedFormData = formData;
      delete editedFormData.organization;
      delete editedFormData.password;
      delete editedFormData.userName;
      delete editedFormData.phoneNumber;
      // Object.keys(editedFormData).forEach((key) => {
      //   payload.append(key, editedFormData[key]);
      // });
      payload = editedFormData
      console.log(payload);
    } else {
      const selectedRoles = roles.map((role) => role.roleName);
      const selectedRegions = regions.map((region) => region.id);
      payload = {
        ...formData,
        roles: selectedRoles,
        regionIds: selectedRegions,
        userName: instance.abbreviation + "-" + formData.userName,
      };
    }
    return payload;
  };

  // prepare and send request
  const registerUser = (e) => {
    const payload = getPayload();
    setLoading(true);
    callAPI(
      {
        caller,
        successStatus: edit ? 204 : 200,
        payload,
        successCallback: (res) => {
          successCallback(res);
          toast(
            res.data.message
              ? res.data.message
              : edit
              ? "ویرایش یا موفقیت انجام شد."
              : "کاربر جدید با موفقیت ایجاد شد.",
            { type: "success" }
          );
        },
        requestEnded: () => {
          modalRoot.classList.remove("active");
          setCondition(false);
          setLoading(false);
        },
      },
      values.id
    );
  };

  const shouldBeVisible = (name) => fields.indexOf(name) !== -1;
  return (
    <>
      <form className="w100 frc row relative py2 px2">
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
            renderInfo={() => " - " + instance.abbreviation}
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
            isInDialog={true}
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
            isInDialog={true}
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
      <div className="w100 mxa fre py1 px2 border-t-light mt1">
        <Button
          title={edit ? "ویرایش کاربر" : "ایجاد کاربر"}
          className="py1 br05 bg-primary"
          onClick={registerUser}
          loading={loading}
        />
      </div>
    </>
  );
};

export default RegisterForm;
