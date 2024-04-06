import React, { useEffect, useState } from "react";
import { callAPI, convertserverTimeToDateString } from "../../../helperFuncs";
import Accordion from "../../helpers/Accordion/Accordion";
import Tabs from "../../helpers/Tabs";
import ShowAttachments from "./ShowAttachments";
import { ReportsAPI } from "../../../apiCalls";

const minHeight = 40;
const modal = document && document.getElementById("modal-root");

const ReportHistory = ({ data }) => {
  console.log(data);
  const [reportHistory, setReportHistory] = useState([]);
  useEffect(() => {
    if (data) {
      getData();
    }
  }, [data]);
  const getData = () => {
    // setLoading(true);
    console.log("data");
    callAPI({
      caller: ReportsAPI.getReportHistory,
      payload: data?.id,
      successCallback: (res) => setReportHistory(res.data),
      errorCallback: () => modal.classList.remove("active"),
      // requestEnded: () => setLoading(false),
    });
  };
  const renderAccordionContent = (item, index) => {
    return (
      <>
        <span className="w100 f3 frs mb1"></span>
        <HistoryDetails history={item} />
        {item.attachments.length > 0 && (
          <ShowAttachments medias={item.attachments} />
        )}

        {/* <Tabs mainClass="history-tab" activeClass="active">
          <div label="جزییات" id="details">
            <HistoryDetails history={item} />
          </div>
          <div label="پیوست ها" id="attachments">
            <ShowAttachments medias={item.attachments} />
          </div>
          <div label="عامل" id="actor">
            <HistoryActor history={item} />
          </div>
        </Tabs> */}
      </>
    );
  };

  const accordionData = reportHistory.map((d, i) => ({
    title: (
      <>
        <span className=" text-xl">
          {reportHistory.length - i} - {d.message} - {d?.actor?.title}
          {(d?.actor?.firstName || d?.actor?.lastName) &&
            "(" +
              ((d?.actor?.firstName ? d?.actor?.firstName : "") +
                " " +
                (d?.actor?.lastName ? d?.actor?.lastName : "")) +
              ")"}
        </span>
        <span className="f1 ts-light">
          {convertserverTimeToDateString(d.dateTime)}
        </span>
      </>
    ),
    content: renderAccordionContent(d, i),
  }));
  return (
    <div className="px1 w100 fcc mt2">
      <Accordion
        data={accordionData}
        itemClassName={"w100 mb05"}
        titleWrapperClassName="f15 bg-light2 py1 pointer br05"
        titleClassName="flex-1 frsb w100 mx1"
      />
    </div>
  );
};

export default ReportHistory;

const HistoryDetails = ({ history }) => {
  return (
    <div className="w100 fcs" style={{ minHeight }}>
      {/* <div className="w90 my05 mxa f1 frs">
        <span className="f12 frc text-color">
          {convertserverTimeToDateString(history.dateTime)}
        </span>
      </div> */}
      <div className="w90 my05 mxa f1 frs">
        <span className="text-color f15 ml1">
          <i className="far fa-question-circle"></i>
        </span>
        <span className="f15 text-color">
          {history.reason ? history.reason.title : "دلیلی ثبت نشده است."}
        </span>
      </div>
      <div className="w90 my05 mxa f1 frs">
        <span className="text-color f15 ml1">
          <i className="fas fa-reply"></i>
        </span>
        <span className="f12 text-color">
          {history.comment ? history.comment : "توضیحی ثبت نشده است."}
        </span>
      </div>
    </div>
  );
};

const HistoryActor = ({ history }) => {
  return (
    <div className="w100" style={{ minHeight }}>
      <div className="w100 frs">
        <span className="f15 text-color">نام:</span>
        <span className="f12 text-color mx1">{history?.actor?.firstName}</span>
      </div>
      <div className="w100 frs">
        <span className="f15 text-color">نام خانوادگی:</span>
        <span className="f12 text-color mx1">{history?.actor?.lastName}</span>
      </div>
      {history?.actor?.title && (
        <div className="w100 frs">
          <span className="f15 text-color">عنوان:</span>
          <span className="f12 text-color mx1">{history?.actor?.title}</span>
        </div>
      )}
      {history?.actor?.organization && (
        <div className="w100 frs">
          <span className="f15 text-color">موسسه:</span>
          <span className="f12 text-color mx1">
            {history?.actor?.organization}
          </span>
        </div>
      )}
    </div>
  );
};
