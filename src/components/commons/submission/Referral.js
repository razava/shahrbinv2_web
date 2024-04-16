import React, { useEffect, useState } from "react";
import Tabs from "../../helpers/Tabs";
import "../../../stylesheets/tabs.css";
import TransitionForm from "./TransitionForm";
import { ReportsAPI } from "../../../apiCalls";
import Loader from "../../helpers/Loader";
import { toast } from "react-toastify";
import { callAPI } from "../../../helperFuncs";
import StageForm from "./StageForm";

const Referral = ({ data, refresh, onNext = (f) => f }) => {
  // flags
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  useEffect(() => {
    if (data) {
      getData();
    }
  }, [data]);
  const getData = () => {
    // setLoading(true);
    callAPI({
      caller: ReportsAPI.getPossibleTransitions,
      payload: data?.id,
      successCallback: (res) => setData(res.data),
      // errorCallback: () => modal.classList.remove("active"),
      // requestEnded: () => setLoading(false),
    });
  };
  // prepare and send user request
  const createTransition = (payload) => {
    setLoading(true);
    console.log(payload);
    callAPI(
      {
        caller: ReportsAPI.createTransition,
        payload,
        requestEnded: () => {
          setLoading(false);
          onNext(null, true);
        },
        successCallback: (res) => {
          console.log(res);
          refresh();
        },
      },
      data?.id
    );
  };

  return (
    <>
      {Data.length > 0 && (
        <Tabs mainClass="finalize-report-tab" activeClass="active">
          {Data.map((transition, i) => (
            <article
              label={transition.stageTitle}
              id={transition.transitionId}
              key={i}
            >
              <TransitionForm
                data={data}
                transition={transition}
                createTransition={createTransition}
                createLoading={loading}
              />
            </article>
          ))}
        </Tabs>
      )}
    </>
  );
};

export default Referral;
