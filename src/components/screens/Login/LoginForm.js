import React, { useEffect, useRef, useState } from "react";
import styles from "../../../stylesheets/login.module.css";
import image from "../../../assets/Images/login-img.png";
import shahrbinTitle from "../../../assets/Images/shahrbin_title.png";
import { callAPI, signUserIn } from "../../../helperFuncs";
import { AuthenticateAPI } from "../../../apiCalls";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../helpers/Button";

const LoginForm = () => {
  const _isMounted = useRef(true);

  const history = useHistory();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { username, password } = values;

  //   functions
  const handleChange = (name) => (e) => {
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const login = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast("لطفا تمام فیلد ها را کامل نمایید.", { type: "error" }); // { /* => add error message object */}
      return;
    }
    setLoading(true);
    const payload = { username, password };
    callAPI({
      caller: AuthenticateAPI.signin,
      payload,
      successCallback: (res) => signUserIn(res, history),
      requestEnded: () => setLoading(false),
    });
  };

  //   effects
  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);
  return (
    <>
      <section className={styles.loginFormWrapper}>
        <img src={image} className={styles.loginImage} />
        <div className={styles.loginContainer}>
          {/* <div className="mx1">
            <img src={shahrbinTitle} className={styles.loginFormTitleImage} />
          </div> */}
          <h1 className={styles.loginTitle}>ورود به پنل کاربری</h1>
          <form className={styles.loginForm} onSubmit={login}>
            <LoginInput
              name="username"
              value={username}
              placeholder="نام کاربری"
              icon="fas fa-user"
              onChange={handleChange}
              disabled={loading}
            />
            <LoginInput
              name="password"
              value={password}
              type="password"
              placeholder="رمز عبور"
              icon="fas fa-unlock"
              onChange={handleChange}
              disabled={loading}
            />

            <Button
              className={styles.loginBtn}
              loading={loading}
              onClick={login}
              type="submit"
            >
              <span>ورود</span>
              <span className={styles.btnIcon}>
                <i className="fas fa-arrow-left"></i>
              </span>
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default LoginForm;

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
