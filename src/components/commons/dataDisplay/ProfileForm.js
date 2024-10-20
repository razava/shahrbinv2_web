import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CommonAPI, UserInfoAPI } from "../../../apiCalls";
import {
  constants,
  fixDigit,
  mapObjectToFormData,
  serverError,
  unKnownError,
} from "../../../helperFuncs";
import { AppStore } from "../../../store/AppContext";
import AddAttachments from "../../helpers/AddAttachments";
import Button from "../../helpers/Button";
import Loader from "../../helpers/Loader";
import SelectBox from "../../helpers/SelectBox";
import TextInput from "../../helpers/TextInput";
import useMakeRequest from "../../hooks/useMakeRequest";
import Avatar from "./Avatar";
import { postFiles } from "../../../api/commonApi";
import { useMutation } from "@tanstack/react-query";
import { updateAvatar } from "../../../api/AuthenticateApi";
import Toggle from "react-toggle";
import "react-toggle/style.css"; // for ES6 modules
import { set } from "nprogress";
import { useHistory } from "react-router-dom";

const modalRoot = document && document.getElementById("modal-root");

const ProfileForm = ({ data, setDialog }) => {
  const [state, dispatch] = useContext(AppStore);
  const history = useHistory();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    // userName: "",
    phoneNumber: "",
    // address: "",
    education: "",
    title: "",
    organization: "",
    twoFactorEnabled: false,
    smsAlert: false,
  });
  const [preview, setPreview] = useState(undefined);
  const [showPreview, setShowPreview] = useState(false);
  const [file, setFile] = useState(null);
  const [payload, setPayload] = useState(undefined);
  const [makeRequest, setMakeRequest] = useState(false);
  const [enable, setEnable] = useState(false);

  console.log(data);
  useEffect(() => {
    const education = data?.education;
    console.log(data.smsAlert);
    if (data) {
      console.log(data);
      setFormData({
        ...formData,
        firstName: data.firstName ? data.firstName : "",
        lastName: data.lastName ? data.lastName : "",
        // userName: data.userName ? data.userName : "",
        phoneNumber: data.phoneNumber ? data.phoneNumber : "",
        education: 0,
        title: data.title ? data.title : "",
        twoFactorEnabled: data.twoFactorEnabled,
        smsAlert: data.smsAlert,
      });
    }
  }, [data]);

  const AvatarMutation = useMutation({
    mutationKey: ["Avatar"],
    mutationFn: updateAvatar,
    onSuccess: (res) => {
      // setFile(res.id);
    },
    onError: (err) => {},
  });
  const uploadMutation = useMutation({
    mutationKey: ["Avatar"],
    mutationFn: updateAvatar,
    onSuccess: (res) => {
      toast(res.message, { type: "success" });
    },
    onError: (err) => {},
  });

  const handleChange = (name, onlyDigit) => (e) => {
    console.log("chh");
    let value = e.target.value;
    if (onlyDigit) {
      value = fixDigit(value, true).replace(/[^-0-9]/, "");
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("File", file);
    formData.append("AttachmentType", 0);
    uploadMutation.mutate(formData);
    readFile(file);
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setShowPreview(true);
    };
    reader.readAsDataURL(file);
  };

  const saveCahnges = (e) => {
    // let payload = new FormData();
    // payload = mapObjectToFormData(formData, payload);
    // payload.delete("address");
    // payload.delete("education");
    // payload.set("address.detail", formData.address);
    // payload.set("educationId", formData.education);

    // payload.set("avatarFile", file);
    // console.log(payload);
    console.log(formData);
    setPayload(formData);
    setMakeRequest(true);
  };

  const [, loading] = useMakeRequest(
    UserInfoAPI.updateUser,
    200,
    makeRequest,
    payload,
    (res) => {
      setMakeRequest(false);
      setDialog(false);
      modalRoot.classList.remove("active");
      if (res.status === 200) {
        dispatch({ type: "setApiCall", payload: true });
      } else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    }
  );

  const cameraIconStyle = {
    top: "5%",
    right: "5%",
    zIndex: 2,
  };
  return (
    <>
      <div className="w100 frc">
        <div className="relative">
          <span className="absolute" style={cameraIconStyle}>
            <AddAttachments
              toggle={
                <span className="sq25 bg-primary frc text-white br1 pointer">
                  <i className="fas fa-camera"></i>
                </span>
              }
              handleChange={handleAvatarSelect}
            />
          </span>
          {showPreview ? (
            <Avatar source={preview} size={4} />
          ) : (
            <Avatar
              url={data.avatar && data.avatar.url}
              placeholder={!data.avatar}
              size={4}
            />
          )}
        </div>
      </div>
      <form className={"w100 mx-a relative frc wrap"}>
        <TextInput
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          title="نام"
          required={false}
          wrapperClassName="rw3"
        />
        <TextInput
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          title="نام خانوادگی"
          required={false}
          wrapperClassName="rw3"
        />
        <TextInput
          name="phoneNumber"
          value={formData.phoneNumber}
          // onChange={handleChange}
          title="شماره موبایل"
          required={false}
          wrapperClassName="rw3"
          onlyDigit={true}
          maxLength="11"
          readOnly={true}
        />
        <TextInput
          name="title"
          value={formData.title}
          onChange={handleChange}
          title="عنوان"
          required={false}
          wrapperClassName="rw3"
        />
        <TextInput
          name="address"
          value={formData.address}
          onChange={handleChange}
          title="آدرس"
          required={false}
          wrapperClassName="rw3"
        />
        <SelectBox
          caller={CommonAPI.getEducationList}
          value={formData.education}
          handleChange={handleChange}
          name="education"
          label="تحصیلات"
          horizontal={false}
          wrapperClassName="rw3"
        />
        <div className=" flex flex-col justify-start mx-24 w-full gap-4">
          <div className=" flex items-center gap-2 mt-2">
            {data && formData.phoneNumber && (
              <>
                <Toggle
                  id="sms"
                  aria-labelledby="biscuit-label"
                  checked={formData.smsAlert}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      smsAlert: e.target.checked,
                    });
                  }}
                />
                <span id="biscuit-label" className=" text-lg">
                  اطلاع رسانی از طریق پیامک
                </span>
              </>
            )}
          </div>
          {formData.phoneNumber ? (
            <div className=" flex items-center gap-2 mt-2">
              <Toggle
                id="biscuit-status"
                // className="profile-toggle"
                checked={formData.twoFactorEnabled}
                aria-labelledby="biscuit-label"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    twoFactorEnabled: e.target.checked,
                  });
                }}
              />
              <span id="biscuit-label" className=" text-lg">
                احراز هویت دو مرحله ای
              </span>
            </div>
          ) : (
            <p className=" text-lg">
              جهت فعالسازی احراز هویت دو مرحله ای، باید ابتدا شماره موبایل خود
              را فعال نمایید.
            </p>
          )}
        </div>
      </form>
      <div className="w100 mxa fre py1 px2 border-t-light mt1 gap-2">
        <Button
          title="تغییر شماره موبایل"
          className="py1 br05 bg-white border-primary text-primary"
          onClick={() => {
            if (formData.phoneNumber) {
              localStorage.setItem(
                constants.SHAHRBIN_MANAGEMENT_HAS_PHONE_NUMBER,
                true
              );
            }
            history.push("/changePhoneNumber");
            modalRoot.classList.remove("active");
          }}
          loading={loading}
        />
        <Button
          title="ذخیره"
          className="py1 br05 bg-primary"
          onClick={saveCahnges}
          loading={loading}
        />
      </div>
    </>
  );
};

export default ProfileForm;
