import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../../stylesheets/filters.module.css";
import Tabs from "../../helpers/Tabs";
import CitizenInfo from "./CitizenInfo";
import Loader from "../../helpers/Loader";
import { callAPI } from "../../../helperFuncs";
import ComplaintDetails from "./ComplaintDetails";
import ComplaintReferral from "../submission/ComplaintReferral";
import ComplaintHistory from "./ComplaintHistory";

const modal = document && document.getElementById("modal-root");

const ComplaintDialog = ({
  setDialog,
  refresh,
  readOnly = false,
  caller = (f) => f,
  childData,
  onNext = (f) => f,
}) => {
  // data states
  const [data, setData] = useState({});
  const [defaultTab, setDefaultTab] = useState("complaintsDetails");

  // flags
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (childData) {
      getData();
      setDefaultTab("complaintsDetails");
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
  return (
    <>
      {loading && <Loader absolute={true} />}
      <section className={styles.filters}>
        <Tabs
          mainClass="complaint-tab"
          activeClass="active"
          contentClassName="scrollbar"
          onTabChange={onTabChange}
          defaultActiveId={defaultTab}
        >
          <article label="جزییات شکایت" id="complaintsDetails">
            <ComplaintDetails data={data} />
          </article>
          <article label="اطلاعات شهروند" id="citizenInfo">
            <CitizenInfo data={data?.complainant} />
          </article>
          <article label="تاریخچه شکایت" id="reportHistory">
            <ComplaintHistory data={data?.logs} />
          </article>
          {!readOnly && (
            <article label="ارجاع" id="finalize">
              <ComplaintReferral
                data={data}
                setDialog={setDialog}
                refresh={refresh}
              />
            </article>
          )}
        </Tabs>
      </section>
    </>
  );
};

ComplaintDialog.propTypes = {
  id: PropTypes.string,
  setDialog: PropTypes.func,
  refresh: PropTypes.func,
  readOnly: PropTypes.bool,
  caller: PropTypes.func,
};

export default ComplaintDialog;
