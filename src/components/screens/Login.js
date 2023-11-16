import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../stylesheets/login.module.css";
import { toast } from "react-toastify";
import { AuthenticateAPI } from "../../apiCalls";
import {
  appRoutes,
  checkLoginState,
  serverError,
  signUserIn,
} from "../../helperFuncs";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../helpers/Loader";
import Brands from "../commons/dataDisplay/Brands";
import LoginForm from "./Login/LoginForm";

const Login = () => {
  const _isMounted = useRef(true);

  useEffect(() => {
    const loginState = checkLoginState();
    if (loginState) {
      history.push(appRoutes.newReports);
    }
    return () => {
      _isMounted.current = false;
    };
  }, []);

  const history = useHistory();
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Brands />
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default Login;
