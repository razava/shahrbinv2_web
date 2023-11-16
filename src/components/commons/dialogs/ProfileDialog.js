import React, { useState } from "react";
import styles from "../../../stylesheets/profile.module.css";
import { UserInfoAPI } from "../../../apiCalls";
import DialogToggler from "../../helpers/DialogToggler";
import useMakeRequest from "../../hooks/useMakeRequest";
import ProfileForm from "../dataDisplay/ProfileForm";
import dropDownStyles from "../../../stylesheets/dropdown.module.css";

const modalRoot = document && document.getElementById("modal-root");

const ProfileDialog = () => {
  const [dialog, setDialog] = useState(false);


  return (
    <>
      <div className={dropDownStyles.dropdownitem} onClick={openDialog}>
        <span>
          <i className="fas fa-user"></i>
        </span>
        <span>پروفایل</span>
      </div>
    </>
  );
};

export default ProfileDialog;
