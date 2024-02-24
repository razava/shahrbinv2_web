import React, { useEffect, useState } from "react";
import styles from "../../../stylesheets/login.module.css";
import image from "../../../assets/Images/login-img.png";
import OTPInput from "react-otp-input";
import Button from "../../helpers/Button";
import { verifyStaff } from "../../../api/AuthenticateApi";
import { useMutation } from "@tanstack/react-query";
import { useHistory } from "react-router-dom";
import { signUserAfterVerify, signUserIn } from "../../../helperFuncs";

export default function VerifyForm() {
  const [otp, setOtp] = useState("");
  const space = "\xa0";
  const history = useHistory();

  const verifyMutation = useMutation({
    mutationKey: ["postNote"],
    mutationFn: verifyStaff,
    onSuccess: (res) => {
      signUserAfterVerify(res, history);
      //   queryClient.invalidateQueries({ queryKey: ["getReportNotes"] });
      //   toast("یادداشت با موفقیت ثبت شد.", { type: "success" });
      //   setNote("");
    },
    onError: (err) => {},
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
