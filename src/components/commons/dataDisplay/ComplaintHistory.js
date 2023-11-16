import React from "react";
import { convertserverTimeToDateString } from "../../../helperFuncs";
import Accordion from "../../helpers/Accordion/Accordion";
import Tabs from "../../helpers/Tabs";
import ShowAttachments from "./ShowAttachments";

const minHeight = 120;

const ComplaintHistory = ({ data = [] }) => {
  const renderAccordionContent = (item, index) => {
    return (
      <>
        <span className="w100 f3 frs mb1"></span>
        <Tabs mainClass="history-tab" activeClass="active">
          <div label="جزییات" id="details">
            <ComplaintDetails item={item} />
          </div>
          <div label="پیوست ها" id="attachments">
            <ShowAttachments medias={item.medias} />
          </div>
          <div label="عامل" id="actor">
            <ComplaintActor item={item} />
          </div>
        </Tabs>
      </>
    );
  };

  const accordionData = data.map((d, i) => ({
    title: (
      <>
        <span>
          {i + 1} - {d.title}
        </span>
        <span className="f1 ts-light">
          {convertserverTimeToDateString(d.timestamp)}
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

export default ComplaintHistory;

const ComplaintDetails = ({ item }) => {
  return (
    <div className="w100 fcs" style={{ minHeight }}>
      <div className="w90 my05 mxa f1 frs">
        <span className="f12 frc text-color">
          {convertserverTimeToDateString(item.timestamp)}
        </span>
      </div>
      <div className="w90 my05 mxa f1 frs">
        <span className="text-color f15 ml1">
          <i className="far fa-info"></i>
        </span>
        <span className="f15 text-color">{item.description}</span>
      </div>
    </div>
  );
};

const ComplaintActor = ({ item }) => {
  return (
    <div className="w100" style={{ minHeight }}>
      <div className="w100 frs">
        <span className="f15 text-color">نام:</span>
        <span className="f12 text-color mx1">{item?.actor?.firstName}</span>
      </div>
      <div className="w100 frs">
        <span className="f15 text-color">نام خانوادگی:</span>
        <span className="f12 text-color mx1">{item?.actor?.lastName}</span>
      </div>
      {item?.actor?.title && (
        <div className="w100 frs">
          <span className="f15 text-color">عنوان:</span>
          <span className="f12 text-color mx1">{item?.actor?.title}</span>
        </div>
      )}
      {item?.actor?.organization && (
        <div className="w100 frs">
          <span className="f15 text-color">موسسه:</span>
          <span className="f12 text-color mx1">
            {item?.actor?.organization}
          </span>
        </div>
      )}
    </div>
  );
};
