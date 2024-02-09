import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../../stylesheets/filters.module.css";
import Tabs from "../../helpers/Tabs";
import CitizenInfo from "./CitizenInfo";
import ReportDetails from "./ReportDetails";
import Referral from "../submission/Referral";
import Loader from "../../helpers/Loader";
import ReportHistory from "./ReportHistory";
import { callAPI, getUserRoles, hasRole } from "../../../helperFuncs";
import OlMapContainer from "../map/OlMapContainer";
import CategoryForm from "./CategoryForm";
import MoreDetails from "./MoreDetails";
import ReportComments from "./ReportComments";
import MessageToCitizen from "../submission/MessageToCitizen";

const modal = document && document.getElementById("modal-root");

const ReportDialog = ({
  setDialog,
  refresh,
  readOnly = false,
  caller = (f) => f,
  childData,
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
    if (childData) {
      getData();
      setDefaultTab("reportDetails");
    }
  }, [childData]);

  const getData = () => {
    setLoading(true);
    callAPI({
      caller: caller,
      payload: childData?.id,
      successCallback: (res) => setData(res.data),
      errorCallback: () => modal.classList.remove("active"),
      requestEnded: () => setLoading(false),
    });
  };

  const onTabChange = (tab) => {
    setDefaultTab(tab);
  };
  useEffect(() => {
    const roles = localStorage.getItem("SHAHRBIN_MANAGEMENT_USER_ROLES");
    setRoles(roles);
  }, []);

  console.log(role);
  const userRoles = getUserRoles();
  const isExecutive = hasRole(userRoles, ["Executive"]);

  return (
    <>
      {loading && <Loader absolute={true} />}
      {data != {} && (
        <section className={styles.filters}>
          <Tabs
            mainClass="filter-tab"
            activeClass="active"
            contentClassName="scrollbar"
            onTabChange={onTabChange}
            defaultActiveId={defaultTab}
          >
            <article label="جزییات درخواست" id="reportDetails">
              <ReportDetails data={data} />
            </article>
            <article label="جزییات بیشتر" id="moreDetails">
              <MoreDetails data={data} />
            </article>
            {data?.category?.formElements.length > 0 && (
              <article label="فرم" id="form">
                <CategoryForm data={data} />
              </article>
            )}
            <article label="اطلاعات شهروند" id="citizenInfo">
              <CitizenInfo data={data} />
            </article>
            <article label="تاریخچه درخواست" id="reportHistory">
              <ReportHistory data={data} />
            </article>
            <article label="نظرات شهروندان" id="reportComments">
              <ReportComments data={data} />
            </article>
            <article label="محل روی نقشه" id="location">
              <OlMapContainer
                center={[
                  data?.address?.longitude || 54.3569,
                  data?.address?.latitude || 31.8974,
                ]}
                width={"100%"}
                height={550}
                zoom={15}
                clickable={false}
              />
            </article>

            {!readOnly && isExecutive && (
              <article label="پاسخ به شهروند" id="messageToCitizen">
                <MessageToCitizen data={data} />
              </article>
            )}
            {!readOnly && (
              <article label="ارجاع" id="finalize">
                <Referral
                  data={data}
                  setDialog={setDialog}
                  refresh={refresh}
                  onNext={onNext}
                />
              </article>
            )}
          </Tabs>
        </section>
      )}
    </>
  );
};

ReportDialog.propTypes = {
  id: PropTypes.string,
  setDialog: PropTypes.func,
  refresh: PropTypes.func,
  readOnly: PropTypes.bool,
  caller: PropTypes.func,
};

export default ReportDialog;
