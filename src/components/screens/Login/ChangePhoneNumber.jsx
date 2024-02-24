import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { AuthenticateAPI } from "../../../apiCalls";
import {
  appRoutes,
  checkLoginState,
  constants,
  logout,
  serverError,
  signUserIn,
} from "../../../helperFuncs";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
// import Loader from "../../l";
import Brands from "../../commons/dataDisplay/Brands";
import styles from "../../../stylesheets/login.module.css";
import image from "../../../assets/Images/login-img.png";
import Button from "../../helpers/Button";
import {
  getCaptcha,
  postNewPhoneNumber,
  putNewPhoneNumber,
} from "../../../api/AuthenticateApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import OTPInput from "react-otp-input";
export default function ChangePhoneNumber() {
  const history = useHistory();
  const [step, setStep] = useState(1);
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);
  const [otp, setOtp] = useState("");
  const [otp2, setOtp2] = useState("");
  const [phNumber, setPhNumber] = useState("");
  const [newPhNumber, setNewPhNumber] = useState("");
  const space = "\xa0";
  const [values, setValues] = useState({
    phoneNumber: "",
    captcha: "",
  });

  const { phoneNumber, captcha } = values;

  const postPhoneNumberMutation = useMutation({
    mutationKey: ["postPhoneNumber"],
    mutationFn: postNewPhoneNumber,
    onSuccess: (res) => {
      localStorage.setItem(
        constants.SHAHRBIN_MANAGEMENT_PHONE_NUMBER_TOKEN,
        res.token
      );
      localStorage.setItem(
        constants.SHAHRBIN_MANAGEMENT_NEW_PHONE_NUMBER_TOKEN,
        res.newToken
      );
      localStorage.setItem(
        constants.SHAHRBIN_MANAGEMENT_PHONE_NUMBER,
        res.phoneNumber
      );
      localStorage.setItem(
        constants.SHAHRBIN_MANAGEMENT_NEW_PHONE_NUMBER,
        res.newPhoneNumber
      );
      setStep(2);
      //   queryClient.invalidateQueries({ queryKey: ["getReportNotes"] });
      //   toast("یادداشت با موفقیت ثبت شد.", { type: "success" });
      //   setNote("");
    },
    onError: (err) => {
      toast("مشکلی در ارسال درخواست به وجود آمد.", { type: "error" });
      //   setValues({
      //     phoneNumber: "",
      //     captcha: "",
      //   });
      refetch();
    },
  });

  const putPhoneNumberMutation = useMutation({
    mutationKey: ["putPhoneNumber"],
    mutationFn: putNewPhoneNumber,
    onSuccess: (res) => {
      //   queryClient.invalidateQueries({ queryKey: ["getReportNotes"] });
      logout(() => history.push(appRoutes.login));
      localStorage.removeItem(constants.SHAHRBIN_MANAGEMENT_HAS_PHONE_NUMBER);
      toast("شماره موبایل با موفقیت تغییر یافت.", { type: "success" });
    },
    onError: (err) => {},
  });

  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["Captcha"],
    queryFn: getCaptcha,
    refetchOnWindowFocus: false,
  });

  const handleChange = (name) => (e) => {
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    if (phNumber) {
      if (otp.length == 6 && otp2.length == 6) {
        const payload = {
          token1: localStorage.getItem(
            constants.SHAHRBIN_MANAGEMENT_PHONE_NUMBER_TOKEN
          ),
          code1: otp,
          token2: localStorage.getItem(
            constants.SHAHRBIN_MANAGEMENT_NEW_PHONE_NUMBER_TOKEN
          ),
          code2: otp2,
        };
        putPhoneNumberMutation.mutate(payload);
      }
    } else {
      if (otp2.length == 6) {
        const payload = {
          token1: localStorage.getItem(
            constants.SHAHRBIN_MANAGEMENT_PHONE_NUMBER_TOKEN
          ),
          code1: otp,
          token2: localStorage.getItem(
            constants.SHAHRBIN_MANAGEMENT_NEW_PHONE_NUMBER_TOKEN
          ),
          code2: otp2,
        };
        putPhoneNumberMutation.mutate(payload);
      }
    }
  }, [otp, otp2]);

  useEffect(() => {
    if (step == 2) {
      const phoneNumber = localStorage.getItem(
        constants.SHAHRBIN_MANAGEMENT_PHONE_NUMBER
      );
      const newPhoneNumber = localStorage.getItem(
        constants.SHAHRBIN_MANAGEMENT_NEW_PHONE_NUMBER
      );
      setPhNumber(phoneNumber);
      setNewPhNumber(newPhoneNumber);
      console.log(newPhNumber);
    }
  }, [step]);
  useEffect(() => {
    const hasPhoneNumber = localStorage.getItem(
      constants.SHAHRBIN_MANAGEMENT_HAS_PHONE_NUMBER
    );
    if (hasPhoneNumber) {
      setHasPhoneNumber(true);
    }
  }, []);

  const handelPost = () => {
    if (!captcha && !phoneNumber) {
      toast("لطفا تمام فیلد ها را کامل نمایید.", { type: "error" });
      return;
    }
    postPhoneNumberMutation.mutate({
      newPhoneNumber: phoneNumber,
      captcha: {
        key: data.headers["captcha-key"],
        value: captcha,
      },
    });
  };
  const srcForImage = data ? URL.createObjectURL(data.data) : null;
  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Brands />
          <section className={styles.loginFormWrapper}>
            <img src={image} className={styles.loginImage} />
            <div className={styles.loginContainer}>
              <div className=" min-h-[20em] flex flex-col items-center justify-around">
                {step == 1 ? (
                  <>
                    {hasPhoneNumber ? (
                      <h1 className=" self-start mb-2">تغییر شماره موبایل</h1>
                    ) : (
                      <h1 className=" self-start mb-2 ">
                        فعالسازی شماره موبایل
                      </h1>
                    )}

                    <LoginInput
                      name="phoneNumber"
                      value={phoneNumber}
                      placeholder="شماره موبایل جدید"
                      icon="fas fa-phone"
                      onChange={handleChange}
                      //   disabled={loading}
                    />
                    <div className=" w-full flex gap-2 items-center">
                      <div className=" w-1/2">
                        <LoginInput
                          name="captcha"
                          value={captcha}
                          placeholder="کد امنیتی"
                          icon="fas fa-ticket-alt"
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div className=" w-1/2 flex items-center h-full">
                        <img
                          src={srcForImage}
                          className=" rounded-sm h-16"
                        ></img>
                        <div
                          onClick={refetch}
                          className="cursor-pointer flex justify-center w-full"
                        >
                          <i className="fas fa-sync-alt h-7 w-7"></i>
                        </div>
                      </div>
                    </div>
                    <p className=" text-center mt-8 text-lg"></p>
                    <Button
                      className={styles.loginBtn}
                      //   loading={loading}
                      onClick={handelPost}
                      type="submit"
                    >
                      <span>تایید</span>
                      <span className={styles.btnIcon}>
                        <i className="fas fa-arrow-left"></i>
                      </span>
                    </Button>
                  </>
                ) : (
                  <>
                    {phNumber && (
                      <>
                        {" "}
                        <p className="text-xl font-bold leading-tight tracking-tight mt-2">
                          کد شماره {phNumber}
                        </p>
                        <div className="w-full mt-8 " dir="ltr">
                          <OTPInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span>{space}</span>}
                            renderInput={(props, idx) => (
                              <input
                                autoFocus={idx == 0}
                                pattern="[0-9]*"
                                {...props}
                              />
                            )}
                            containerStyle=" flex justify-center gap-2 flex-row-reverse"
                            inputStyle=" !w-20 rounded-md h-20 bg-[#eee] border-none text-black"
                          />
                        </div>
                      </>
                    )}
                    {phNumber ? (
                      <p className="text-xl font-bold leading-tight tracking-tight text-blue mt-5">
                        کد شماره {newPhNumber}
                      </p>
                    ) : (
                      <p className="!text-2xl font-bold self-start leading-tight tracking-tight text-blue mt-5">
                        کد تایید
                      </p>
                    )}

                    <div className="w-full mt-8 " dir="ltr">
                      <OTPInput
                        value={otp2}
                        onChange={setOtp2}
                        numInputs={6}
                        renderSeparator={<span>{space}</span>}
                        renderInput={(props, idx) => (
                          <input
                            autoFocus={idx == 0}
                            pattern="[0-9]*"
                            {...props}
                          />
                        )}
                        containerStyle=" flex justify-center gap-2 flex-row-reverse"
                        inputStyle=" !w-20 rounded-md h-20 bg-[#eee] border-none text-black"
                      />
                    </div>
                    {!phNumber && (
                      <p className=" text-center mt-8 text-lg">
                        کد دریافت شده توسط پیامک را وارد نمایید.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const LoginInput = ({
  icon = "",
  value = "",
  type = "text",
  name = "",
  placeholder = "",
  onChange = (f) => f,
  disabled = false,
}) => {
  const inputRef = useRef(null);

  const showPassword = (e) => {
    if (inputRef.current.type === "password") {
      inputRef.current.type = "text";
    } else {
      inputRef.current.type = "password";
    }
  };
  return (
    <div className={styles.inputGroup}>
      <span className={styles.inputIcon}>
        <i className={icon}></i>
      </span>
      <div className={styles.inputContainer}>
        <input
          type={type}
          className={styles.input}
          name={name}
          value={value}
          onChange={onChange(name)}
          placeholder={placeholder}
          disabled={disabled}
          ref={inputRef}
        />
        <span className={styles.inputUnderline}></span>
        {type === "password" && (
          <span
            className="absolute pointer f12"
            style={{
              top: "50%",
              left: 20,
              transform: "translateY(-50%)",
            }}
            onClick={showPassword}
          >
            <i className="fas fa-eye"></i>
          </span>
        )}
      </div>
    </div>
  );
};
