import React, { useState } from "react";
import Tabs from "../../helpers/Tabs";
import "../../../stylesheets/tabs.css";
import TransitionForm from "./TransitionForm";
import { ReportsAPI } from "../../../apiCalls";
import Loader from "../../helpers/Loader";
import { toast } from "react-toastify";
import { callAPI } from "../../../helperFuncs";
import StageForm from "./StageForm";

const Referral = ({ data, onNext = (f) => f }) => {
  // flags
  const [loading, setLoading] = useState(false);

  // prepare and send user request
  const createTransition = (payload) => {
    setLoading(true);
    callAPI(
      {
        caller: ReportsAPI.createTransition,
        payload,
        requestEnded: () => {
          setLoading(false);
          onNext(null, true);
        },
        successCallback: () => {
          toast("درخواست با موفقیت ارجاع داده شد.", { type: "success" });
        },
      },
      data?.report?.id
    );
  };

  return (
    <>
      {data.possibleTransitions.length > 0 && (
        <Tabs mainClass="finalize-report-tab" activeClass="active">
          {data.possibleTransitions.map((transition, i) => (
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
