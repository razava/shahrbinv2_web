import React, { useContext, useState } from "react";
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
import TreeSystem from "./TreeSystem";
import { AppStore } from "../../../store/AppContext";
import TextInput from "../../helpers/TextInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getOperatorCategories,
  putOperatorCategories,
} from "../../../api/AdminApi";

const modalRoot = document && document.getElementById("modal-root");

const RolesDialog = ({ userId, setCondition }) => {
  const [roles, setRoles] = useState([]);
  const [makeRequest, setMakeRequest] = useState(false);
  const [store] = useContext(AppStore);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [categoryTitle2, setCategoryTitle2] = useState([]);
  const [categoryId2, setCategoryId2] = useState();
  const [selectedCategories, setSelectedCategories] = useState();
  const handleRoleChange = (items = []) => {
    const newRoles = roles.map((role) => ({
      ...role,
      isIn: items.findIndex((item) => item === role.roleName) !== -1,
    }));
    setRoles(newRoles);
  };

  const saveRoles = (e) => {
    setMakeRequest(true);
  };

  const {
    data: OperatorCategories,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["opCategories", userId],
    queryFn: () => getOperatorCategories(userId),
  });

  const putCategoriesMutation = useMutation({
    mutationKey: ["putCategories"],
    mutationFn: putOperatorCategories,
    onSuccess: (res) => {
      refetch();
      // queryClient.invalidateQueries({ queryKey: ["getReportNotes"] });
      // toast("یادداشت با موفقیت حذف شد.", { type: "success" });
    },
    onError: (err) => {},
  });

  console.log(OperatorCategories);
  const all = OperatorCategories?.map((item) => {
    return { id: item };
  });
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
    204,
    makeRequest,
    { roles: roles },
    (res) => {
      setMakeRequest(false);
      setCondition(false);
      modalRoot.classList.remove("active");
      if (res.status === 204) {
        toast("تغییرات با موفقیت ذخیره شد.", { type: "success" });
      } else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    },
    userId
  );

  const onCategoriesSelected = (selecteds) => {
    // if (selecteds.length > 0) {
    if (selecteds.length > 0) {
      const selected = selecteds[0];
      setCategoryTitle2(selected.title);
      setCategoryId2(selected.id);
      setSelectedCategories(selecteds);
    }
    console.log(selecteds);
    // }
    // else {
    //   setCategoryTitle2("");
    //   setCategoryId2(null);
    // }
  };
  console.log(selectedCategories);
  const isOperator = roles.find((item) => item.roleName == "Operator");
  console.log(categoryId2);
  return (
    <>
      {isOperator?.isIn && (
        <TreeSystem
          isStatic
          staticData={store.initials.categories}
          condition={categoryDialog}
          setCondition={setCategoryDialog}
          onChange={onCategoriesSelected}
          defaultSelecteds={all}
          singleSelect={false}
          onClose={() => setCategoryDialog(false)}
          mode="Add"
          renderToggler={(selected) => (
            <TextInput
              placeholder=" مشاهده دسته بندی ها"
              title="‌دسته بندی‌ها"
              readOnly={true}
              onClick={() => setCategoryDialog(true)}
              wrapperClassName="!w-[95%] mb-6"
              inputClassName="pointer"
              required={false}
              value={selected.length > 0 ? selected[0].title : "" ? "" : ""}
            />
          )}
        ></TreeSystem>
      )}

      <CheckBoxGroup
        items={roles.map((role) => ({
          id: role.roleName,
          label: role.roleTitle,
          checked: role.isIn,
          wrapperClassName: "w30 d-flex al-c ju-s my1",
          labelClassName: "f12 my05",
        }))}
        onChange={handleRoleChange}
        wrapperClassName="px1 !mb-36"
        title="نقش‌ها"
      />
      <div className="w100 mxa fre py1 px2 border-t-light mt2 absolute b0">
        <Button
          title="ذخیره تغییرات"
          className="py1 br05 bg-primary"
          onClick={() => {
            putCategoriesMutation.mutate({
              id: userId,
              payload: {
                categoryIds: selectedCategories.map((item) => item.id),
              },
            });
            saveRoles();
          }}
          loading={saveLoading}
        />
      </div>
    </>
  );
};

export default RolesDialog;
