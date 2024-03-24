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
  forgotPassword,
  getCaptcha,
  postNewPhoneNumber,
  putNewPhoneNumber,
  resendOtp,
  resetPassword,
} from "../../../api/AuthenticateApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import OTPInput from "react-otp-input";
import { useTimer } from "react-timer-hook";
import CountdownTimer from "./CountDown";

export default function ChangePhoneNumber() {
  const history = useHistory();
  const [isShow, setIsShow] = useState(true);
  const [step, setStep] = useState(1);
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const space = "\xa0";
  const [values, setValues] = useState({
    username: "",
    captcha: "",
    newPassword: "",
    repeatedPassword: "",
  });

  const { username, captcha, newPassword, repeatedPassword } = values;

  const forgotPasswordMutation = useMutation({
    mutationKey: ["forgotPassword"],
    mutationFn: forgotPassword,
    onSuccess: (res) => {},
    onError: (err) => {
      console.log(err.response);
      if (err.response.status === 428) {
        localStorage.setItem("verificationToken", err.response.data);
        setStep(2);
        setIsShow(true);
      } else {
        toast("مشکلی در ارسال درخواست به وجود آمد.", { type: "error" });
      }
      //   setValues({
      //     phoneNumber: "",
      //     captcha: "",
      //   });
      refetch();
    },
  });

  const resetPasswordMutation = useMutation({
    mutationKey: ["ResetPassword"],
    mutationFn: resetPassword,
    onSuccess: (res) => {
      logout(() => history.push(appRoutes.login));
      toast("رمز عبور شما با موفقیت تغییر یافت.", { type: "success" });
      localStorage.removeItem("countdownTime");
      localStorage.removeItem("CountDownCompleted");
    },
    onError: (err) => {},
  });

  const resendOtpMutation = useMutation({
    mutationKey: ["resendOtp"],
    mutationFn: resendOtp,
    onSuccess: (res) => {},
    onError: (err) => {
      if (err.response.status === 428) {
        localStorage.setItem("verificationToken", err.response.data);
        toast("کد تایید مجدد ارسال شد.", { type: "info" });
        localStorage.removeItem("countdownTime");
        localStorage.removeItem("CountDownCompleted");
        setIsShow(true);
      } else {
        toast("مشکلی در ارسال درخواست به وجود آمد.", { type: "error" });
      }
    },
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
    const hasToken = localStorage.getItem("verificationToken");
    if (hasToken) {
      // setHasPhoneNumber(true);
      setStep(2);
    }
  }, []);

  const handelPost = () => {
    if (!captcha && !username) {
      toast("لطفا تمام فیلد ها را کامل نمایید.", { type: "error" });
      return;
    }
    forgotPasswordMutation.mutate({
      username: username,
      captcha: {
        key: data.headers["captcha-key"],
        value: captcha,
      },
    });
  };
  const handelResendOtp = () => {
    resendOtpMutation.mutate({
      otpToken: localStorage.getItem("verificationToken"),
    });
  };
  const handelReset = () => {
    if (!newPassword && !repeatedPassword && !captcha) {
      toast("لطفا تمام فیلد ها را کامل نمایید.", { type: "error" });
      return;
    }
    if (newPassword !== repeatedPassword) {
      toast("رمز عبور شما مطابقت ندارد.", { type: "error" });
      return;
    }
    const payload = {
      otpToken: localStorage.getItem("verificationToken"),
      verificationCode: otp,
      newPassword: newPassword,
    };
    resetPasswordMutation.mutate(payload);
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
                    <h1 className=" self-start mb-2">فراموشی رمز عبور</h1>

                    <LoginInput
                      name="username"
                      value={username}
                      placeholder="نام کاربری"
                      icon="fas fa-user"
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
                    <h1 className=" self-start mb-2">فراموشی رمز عبور</h1>
                    <p className=" self-start mt-2 text-lg">
                      کد دریافت شده توسط پیامک را وارد نمایید.
                    </p>
                    <div className="w-full my-1 " dir="ltr">
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
                            key={idx}
                            autocomplete="false"
                          />
                        )}
                        containerStyle=" flex justify-center gap-2 flex-row-reverse"
                        inputStyle=" !w-20 rounded-md h-20 bg-[#eee] border-none text-black"
                      />
                    </div>
                    <CountdownTimer
                      setIsShow={(state) => setIsShow(state)}
                      isShow={isShow}
                    />
                    {!isShow && (
                      <p
                        onClick={handelResendOtp}
                        className=" text-primary text-lg cursor-pointer"
                      >
                        ارسال مجدد کد تایید
                      </p>
                    )}
                    <LoginInput
                      name="newPassword"
                      value={newPassword}
                      placeholder="رمز عبور جدید"
                      icon="fas fa-unlock"
                      type="password"
                      onChange={handleChange}
                      // disabled={loading}
                    />
                    <LoginInput
                      name="repeatedPassword"
                      value={repeatedPassword}
                      type="password"
                      placeholder="تکرار رمز عبور جدید"
                      icon="fas fa-unlock"
                      onChange={handleChange}
                      // disabled={loading}
                    />
                    <Button
                      className={styles.loginBtn}
                      //   loading={loading}
                      onClick={handelReset}
                      type="submit"
                    >
                      <span>تایید</span>
                      <span className={styles.btnIcon}>
                        <i className="fas fa-arrow-left"></i>
                      </span>
                    </Button>
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
