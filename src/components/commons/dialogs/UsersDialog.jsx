import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../../stylesheets/filters.module.css";
import Tabs from "../../helpers/Tabs";
import Loader from "../../helpers/Loader";
import { callAPI, getUserRoles, hasRole } from "../../../helperFuncs";
import RegisterForm from "../submission/RegisterForm";
import { UserInfoAPI } from "../../../apiCalls";
import RolesDialog from "./RolesDialog";
import RegionsDialog from "./RegionsDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useQuery } from "@tanstack/react-query";
import { getUserRolesByAdmin } from "../../../api/AdminApi";
import OperatorCategories from "./OperatorCategories";
import UserReports from "./UserReports";

const modal = document && document.getElementById("modal-root");

const UsersDialog = ({
  setDialog,
  refresh,
  readOnly = false,
  caller = (f) => f,
  childData,
  dialogData,
  getAllUsers,
  onNext = (f) => f,
}) => {
  // data states
  const [data, setData] = useState({});
  const [role, setRoles] = useState([]);
  // const [ReportHistory, setReportHistory] = useState({});
  const [defaultTab, setDefaultTab] = useState("reportDetails");

  // flags
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dialogData) {
      //   getData();
      setDefaultTab("edit");
    }
  }, [childData]);

  //   const getData = () => {
  //     setLoading(true);
  //     callAPI({
  //       caller: caller,
  //       payload: childData?.id,
  //       successCallback: (res) => setData(res.data),
  //       errorCallback: () => modal.classList.remove("active"),
  //       requestEnded: () => setLoading(false),
  //     });
  //   };

  const onTabChange = (tab) => {
    setDefaultTab(tab);
  };
  useEffect(() => {
    const roles = localStorage.getItem("SHAHRBIN_MANAGEMENT_USER_ROLES");
    setRoles(roles);
  }, []);

  console.log(role);
  const userRoles = getUserRoles();
  //   const isExecutive = hasRole(userRoles, ["Executive"]);
  //   const isInspector = hasRole(userRoles, ["Inspector"]);
  //   const checkRoles = userRoles.includes("Operator");
  console.log(dialogData);

  const { data: roles, isLoading } = useQuery({
    queryKey: ["useRoles", dialogData.id],
    queryFn: () => getUserRolesByAdmin(dialogData.id),
  });
  console.log(roles);
  const isOperator = roles?.find(
    (role) => role?.roleName === "Operator" && role?.isIn === true
  );

  const isCitizen = roles?.find(
    (role) => role?.roleName === "Citizen" && role?.isIn === true
  );

  console.log(isOperator);
  return (
    <>
      {isLoading && <Loader absolute={true} />}
      {dialogData && roles && (
        <section style={{ marginTop: "0px" }} className={styles.filters}>
          <Tabs
            mainClass="filter-tab"
            activeClass="active"
            contentClassName="scrollbar !pt-8"
            onTabChange={onTabChange}
            defaultActiveId={defaultTab}
          >
            <article label="ویرایش" id="edit">
              {/* <ReportDetails data={data} /> */}
              <RegisterForm
                // setCondition={setUserDialog}
                fields={["firstName", "lastName", "title"]}
                caller={UserInfoAPI.updateUserById}
                edit={true}
                values={dialogData}
                successCallback={getAllUsers}
              />
            </article>
            <article label="نقش ها" id="roles">
              <RolesDialog
                userId={dialogData?.id}
                setCondition={() => console.log("Df")}
              />
            </article>
            {!isCitizen && (
              <article label="مناطق" id="regions">
                <RegionsDialog
                  userId={dialogData?.id}
                  setCondition={() => console.log("Df")}
                />
              </article>
            )}
            {isOperator && (
              <article label="دسته بندی ها" id="category">
                <OperatorCategories userId={dialogData?.id} />
              </article>
            )}
            {isCitizen && (
              <article label="درخواست ها" id="requests">
                <UserReports userId={dialogData?.id} />
              </article>
            )}
            <article label="تغییر رمز عبور" id="password">
              <ChangePasswordDialog
                id={dialogData?.id}
                setCondition={() => console.log("Df")}
              />
            </article>
          </Tabs>
        </section>
      )}
    </>
  );
};

UsersDialog.propTypes = {
  id: PropTypes.string,
  setDialog: PropTypes.func,
  refresh: PropTypes.func,
  readOnly: PropTypes.bool,
  caller: PropTypes.func,
};

export default UsersDialog;
