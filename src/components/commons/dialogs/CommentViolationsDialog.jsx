import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../../stylesheets/filters.module.css";
import Tabs from "../../helpers/Tabs";
import Loader from "../../helpers/Loader";
import {
  callAPI,
  convertserverTimeToDateString,
  getUserRoles,
  hasRole,
} from "../../../helperFuncs";
import RegisterForm from "../submission/RegisterForm";
import { UserInfoAPI } from "../../../apiCalls";
import RolesDialog from "./RolesDialog";
import RegionsDialog from "./RegionsDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useQuery } from "@tanstack/react-query";
import { getUserRolesByAdmin } from "../../../api/AdminApi";
import OperatorCategories from "./OperatorCategories";
import UserReports from "./UserReports";
import { getCommentViolations } from "../../../api/StaffApi";
import CommentActions from "../submission/CommentActions";

const modal = document && document.getElementById("modal-root");

const CommentViolationsDialog = ({
  setDialog,
  refresh,
  readOnly = false,
  caller = (f) => f,
  childData,
  getAllUsers,
  onNext = (f) => f,
  defTab,
}) => {
  // data states
  const [data, setData] = useState({});
  const [role, setRoles] = useState([]);
  // const [ReportHistory, setReportHistory] = useState({});
  const [defaultTab, setDefaultTab] = useState("reportDetails");
  console.log(childData);
  // flags
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (childData) {
      //   getData();
      setDefaultTab(defTab);
    }
  }, [childData]);

  const onTabChange = (tab) => {
    setDefaultTab(tab);
  };

  console.log(childData);

  const { data: CommentViolations, isLoading } = useQuery({
    queryKey: ["CommentViolations", childData.id],
    queryFn: () => getCommentViolations(childData.id),
  });

  return (
    <>
      {isLoading && <Loader absolute={true} />}
      {childData && (
        <section style={{ marginTop: "0px" }} className={styles.filters}>
          <Tabs
            mainClass="filter-tab"
            activeClass="active"
            contentClassName="scrollbar !pt-8"
            onTabChange={onTabChange}
            defaultActiveId={defaultTab}
          >
            <article label="گزارش های تخلف" id="violations">
              <div className=" px-8">
                <div className=" text-lg bg-primary text-white p-3 mb-4 rounded-md shadow-md">
                  {childData?.data.text}
                </div>
                {CommentViolations?.map((item) => {
                  return (
                    <>
                      <h3 class="flex items-center w-full my-[1em]">
                        <span class="flex-grow bg-gray-300 !h-2"></span>
                        <span class="mx-3 text-lg font-medium">
                          {convertserverTimeToDateString(item.dateTime)}
                        </span>
                        <span class="flex-grow bg-gray-300 !h-2"></span>
                      </h3>
                      <div className=" bg-gray-100 flex flex-col gap-3 p-5 rounded-md">
                        <span className=" font-bold text-lg bg-primary text-white w-fit p-1 rounded-md">
                          {item.violationTypeTitle}
                        </span>
                        <p>{item.description}</p>
                      </div>
                    </>
                  );
                })}
              </div>
            </article>
            <article label="عملیات" id="action">
              <CommentActions
                onNext={onNext}
                refresh={refresh}
                data={childData?.data}
              />
            </article>
          </Tabs>
        </section>
      )}
    </>
  );
};

CommentViolationsDialog.propTypes = {
  id: PropTypes.string,
  setDialog: PropTypes.func,
  refresh: PropTypes.func,
  readOnly: PropTypes.bool,
  caller: PropTypes.func,
};

export default CommentViolationsDialog;
