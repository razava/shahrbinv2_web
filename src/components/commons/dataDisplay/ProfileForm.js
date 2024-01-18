import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CommonAPI, UserInfoAPI } from "../../../apiCalls";
import {
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

const modalRoot = document && document.getElementById("modal-root");

const ProfileForm = ({ data, setDialog }) => {
  const [state, dispatch] = useContext(AppStore);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    // userName: "",
    phoneNumber2: "",
    // address: "",
    education: "",
    title: "",
    organization: "",
  });
  const [preview, setPreview] = useState(undefined);
  const [showPreview, setShowPreview] = useState(false);
  const [file, setFile] = useState(null);
  const [payload, setPayload] = useState(undefined);
  const [makeRequest, setMakeRequest] = useState(false);
  console.log(data);
  useEffect(() => {
    const education = data?.education;
    setFormData({
      ...formData,
      firstName: data.firstName ? data.firstName : "",
      lastName: data.lastName ? data.lastName : "",
      // userName: data.userName ? data.userName : "",
      phoneNumber2: education ? education : "",
      education: 0,
      title: data.title ? data.title : "",
    });
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
      toast("عکس پروفایل با موفقیت به روز رسانی شد.", { type: "success" });
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
    formData.append("AttachmentType", 1);
    uploadMutation.mutate(formData)
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
    let payload = new FormData();
    payload = mapObjectToFormData(formData, payload);
    payload.delete("address");
    payload.delete("education");
    payload.set("address.detail", formData.address);
    payload.set("educationId", formData.education);

    // payload.set("avatarFile", file);
    // console.log(payload);
    console.log(formData);
    setPayload(formData);
    setMakeRequest(true);
  };

  const [, loading] = useMakeRequest(
    UserInfoAPI.updateUser,
    204,
    makeRequest,
    payload,
    (res) => {
      setMakeRequest(false);
      setDialog(false);
      modalRoot.classList.remove("active");
      if (res.status === 204) {
        toast("تغییرات با موفقیت ذخیره شد.", { type: "success" });
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
          title="تلفن همراه"
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
      </form>
      <div className="w100 mxa fre py1 px2 border-t-light mt1">
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
