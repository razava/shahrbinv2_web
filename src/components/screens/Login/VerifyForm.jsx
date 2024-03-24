import React, { useEffect, useState } from "react";
import styles from "../../../stylesheets/login.module.css";
import image from "../../../assets/Images/login-img.png";
import OTPInput from "react-otp-input";
import Button from "../../helpers/Button";
import { resendOtp, verifyStaff } from "../../../api/AuthenticateApi";
import { useMutation } from "@tanstack/react-query";
import { useHistory } from "react-router-dom";
import { signUserAfterVerify, signUserIn } from "../../../helperFuncs";
import CountdownTimer from "./CountDown";
import { toast } from "react-toastify";

export default function VerifyForm() {
  const [otp, setOtp] = useState("");
  const space = "\xa0";
  const history = useHistory();
  const [isShow, setIsShow] = useState(true);

  const verifyMutation = useMutation({
    mutationKey: ["postNote"],
    mutationFn: verifyStaff,
    onSuccess: (res) => {
      signUserAfterVerify(res, history);
      localStorage.removeItem("verificationToken");
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

  useEffect(() => {
    if (otp.length == 6) {
      const payload = {
        otpToken: localStorage.getItem("verificationToken"),
        verificationCode: otp,
      };
      verifyMutation.mutate(payload);
    }
  }, [otp]);

  const handelResendOtp = () => {
    resendOtpMutation.mutate({
      otpToken: localStorage.getItem("verificationToken"),
    });
  };

  return (
    <section className={styles.loginFormWrapper}>
      <img src={image} className={styles.loginImage} />
      <div className={styles.loginContainer}>
        <div className=" min-h-[20em] flex items-center justify-center">
          <div>
            <h1 className={styles.loginTitle}>کد تایید</h1>
            <div className="w-full mt-8 " dir="ltr">
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span>{space}</span>}
                renderInput={(props, idx) => (
                  <input autoFocus={idx == 0} pattern="[0-9]*" {...props} />
                )}
                containerStyle=" flex justify-center gap-2 flex-row-reverse"
                inputStyle=" !w-20 rounded-md h-20 bg-[#eee] border-none text-black"
              />
            </div>
            <p className=" text-center mt-8 text-lg">
              کد دریافت شده توسط پیامک را وارد نمایید.
            </p>
            <div className=" mx-auto w-full text-center mt-2">
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
            </div>
            {/* <Button
            className={styles.loginBtn}
            loading={verifyMutation.isLoading}
            onClick={login}
            type="submit"
          >
            <span>ورود</span>
            <span className={styles.btnIcon}>
              <i className="fas fa-arrow-left"></i>
            </span>
          </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
}
