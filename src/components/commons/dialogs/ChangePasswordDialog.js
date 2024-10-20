import React, { useState } from "react";
import { toast } from "react-toastify";
import { AuthenticateAPI } from "../../../apiCalls";
import { serverError, unKnownError, checkPassword } from "../../../helperFuncs";
import Button from "../../helpers/Button";
import Loader from "../../helpers/Loader";
import TextInput from "../../helpers/TextInput";
import useMakeRequest from "../../hooks/useMakeRequest";

const modalRoot = document && document.getElementById("modal-root");

const { errorMessage } = checkPassword("");

const ChangePasswordDialog = ({
  id,
  setCondition,
  type = 1,
  mode = "profile",
}) => {
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [payload, setPayload] = useState(undefined);
  const [makeRequest, setMakeRequest] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (name) => (e) => {
    let value = e.target.value;
    if (name === "password") {
      const { isValid } = checkPassword(value);
      setErrors({ password: !isValid });
      setPassword(e.target.value);
    }
    if (name === "oldPassword") {
      setOldPassword(e.target.value);
    }
    if (name === "confirmPassword") {
      setConfirmPassword(e.target.value);
    }
  };

  const changePassword = (e) => {
    if (!password && !oldPassword) {
      toast("رمز عبور سابق و جدید خود را وارد نمایید.", { type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      toast("رمز عبور و تکرار آن مطابقت ندارند.", { type: "error" });
      return;
    }
    const { isValid } = checkPassword(password);
    if (!isValid) {
      toast(errorMessage, { type: "error" });
      return;
    }
    const payload = { newPassword: password };
    if (type === 2) payload["oldPassword"] = oldPassword;
    setPayload(payload);
    setMakeRequest(true);
  };

  const [, loading] = useMakeRequest(
    type === 1 ? AuthenticateAPI.resetPassword : AuthenticateAPI.changePassword,
    200,
    makeRequest,
    payload,
    (res) => {
      setMakeRequest(false);
      // setCondition(false);
      // modalRoot.classList.remove("active");
      if (res.status === 200) {
      } else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    },
    id
  );
  return (
    <>
      <div className=" py2 w-full px-2 mb-20">
        {type === 2 && (
          <TextInput
            name="oldPassword"
            value={oldPassword}
            onChange={handleChange}
            title="رمز عبور سابق"
            wrapperClassName="w-full"
            type="password"
          />
        )}
        <TextInput
          name="password"
          value={password}
          onChange={handleChange}
          title="رمز عبور جدید"
          wrapperClassName="w-full"
          type="password"
          isValid={!errors.password}
          errorMessage={errorMessage}
        />
        <TextInput
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          title=" تکرار رمز عبور جدید"
          wrapperClassName="w-full"
          type="password"
        />
      </div>

      <div
        className={` ${
          mode == "admin" ? "w80" : "w-full"
        } mxa fre py1 px2 border-t-light mt1 fixed b0 bg-white`}
      >
        <Button
          title="ذخیره"
          className="py1 br05 bg-primary"
          onClick={changePassword}
          loading={loading}
        />
      </div>
    </>
  );
};

export default ChangePasswordDialog;
