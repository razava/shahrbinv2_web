import React from "react";
import styles from "../../../stylesheets/reportdialog.module.css";
import TextInput from "../../helpers/TextInput";
import { convertserverTimeToDateString, doesExist } from "../../../helperFuncs";
import Textarea from "../../helpers/Textarea";

const ComplaintDetails = ({ data = {} }) => {
  // variables
  const timeLeftInMs = new Date(data.currentDeadline).getTime() - Date.now();
  const daysLeft = new Date(timeLeftInMs).getDate();

  return (
    <>
      <section className={styles.reportDetails}>
        <div className={styles.infoList}>
          <div className="w90 mxa frc wrap">
            <TextInput
              value={doesExist(data?.trackingNumber)}
              readOnly={true}
              title="شماره شکایت"
              wrapperClassName="mxa flex-1"
              inputClassName=""
              required={false}
            />
            <TextInput
              value={doesExist(data?.category?.title)}
              readOnly={true}
              title="موضوع "
              wrapperClassName="mxa flex-1"
              inputClassName=""
              required={false}
            />
          </div>
          <div className="w90 mxa frc wrap">
            <TextInput
              value={convertserverTimeToDateString(data?.created)}
              readOnly={true}
              title="تاریخ ایجاد"
              wrapperClassName="mxa flex-1"
              inputClassName=""
              required={false}
            />
            <TextInput
              value={convertserverTimeToDateString(data?.currentDeadline) + `  (${daysLeft} روز)`}
              readOnly={true}
              title="زمان اتمام"
              wrapperClassName="mxa flex-1"
              inputClassName=""
              required={false}
            />
          </div>
          <Textarea
            value={doesExist(data?.description)}
            readOnly={true}
            title="توضیحات"
            wrapperClassName="mxa"
            inputClassName="mh150 of-x-hidden"
          />
        </div>
      </section>
    </>
  );
};

export default ComplaintDetails;
