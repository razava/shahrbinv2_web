import React, { useState } from "react";
import { UserInfoAPI } from "../../../apiCalls";
import useMakeRequest from "../../hooks/useMakeRequest";
import styles from "../../../stylesheets/input.module.css";
import Loader from "../../helpers/Loader";
import {
  rolesDisplayName,
  serverError,
  unKnownError,
} from "../../../helperFuncs";
import Button from "../../helpers/Button";
import { toast } from "react-toastify";
import CheckBoxGroup from "../../helpers/CheckBox/CheckBoxGroup";

const modalRoot = document && document.getElementById("modal-root");

const RolesDialog = ({ userId, setCondition }) => {
  const [roles, setRoles] = useState([]);
  const [makeRequest, setMakeRequest] = useState(false);

  const handleRoleChange = (items = []) => {
    const newRoles = roles.map((role) => ({
      ...role,
      isInRole: items.findIndex((item) => item === role.roleName) !== -1,
    }));
    setRoles(newRoles);
  };

  const saveRoles = (e) => {
    setMakeRequest(true);
  };

  const [data, loading] = useMakeRequest(
    UserInfoAPI.getUserRoles,
    200,
    true,
    userId,
    (res) => {
      if (res.status === 200) {
        setRoles(res.data);
      } else if (serverError(res)) return;
    }
  );

  const [, saveLoading] = useMakeRequest(
    UserInfoAPI.saveRoles,
    200,
    makeRequest,
    roles,
    (res) => {
      setMakeRequest(false);
      setCondition(false);
      modalRoot.classList.remove("active");
      if (res.status === 200) {
        toast("تغییرات با موفقیت ذخیره شد.", { type: "success" });
      } else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    },
    userId
  );
  return (
    <>
      <CheckBoxGroup
        items={roles.map((role) => ({
          id: role.roleName,
          label: role.displayName,
          checked: role.isInRole,
          wrapperClassName: "w30 d-flex al-c ju-s my1",
          labelClassName: "f12 my05"
        }))}
        onChange={handleRoleChange}
        wrapperClassName="px1"
        title="نقش‌ها"
      />
      <div className="w100 mxa fre py1 px2 border-t-light mt1 absolute b0">
        <Button
          title="ذخیره تغییرات"
          className="py1 br05 bg-primary"
          onClick={saveRoles}
          loading={saveLoading}
        />
      </div>
    </>
  );
};

export default RolesDialog;
