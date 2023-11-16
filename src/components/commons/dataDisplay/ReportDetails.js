import React from "react";
import styles from "../../../stylesheets/reportdialog.module.css";
import moment from "moment-jalaali";
import { convertserverTimeToDateString, doesExist } from "../../../helperFuncs";
import ShowAttachments from "./ShowAttachments";
import TextInput from "../../helpers/TextInput";
import Textarea from "../../helpers/Textarea";

moment.loadPersian({ usePersianDigits: true });

const ReportDetails = ({ data }) => {
  return (
    <section className={styles.reportDetails}>
      <div className={styles.infoList}>
        <div className="w90 mxa frc wrap">
          <TextInput
            value={doesExist(data?.report?.trackingNumber)}
            readOnly={true}
            title="شماره درخواست"
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
          <TextInput
            value={doesExist(data?.report?.category?.title)}
            readOnly={true}
            title="موضوع "
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
        </div>
        <div className="w90 mxa frc wrap">
          <TextInput
            value={doesExist(data?.report?.lastStatus)}
            readOnly={true}
            title="وضعیت"
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
          <TextInput
            value={doesExist(data?.report?.address?.region?.name)}
            readOnly={true}
            title="منطقه"
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
        </div>
        <div className="w90 mxa frc wrap">
          <TextInput
            value={data?.report?.address?.detail}
            readOnly={true}
            title="آدرس"
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
        </div>
        <Textarea
          value={
            data?.report?.category?.formElements.length > 0
              ? ""
              : doesExist(data?.report?.comments)
          }
          readOnly={true}
          title="توضیحات"
          wrapperClassName="mxa"
          inputClassName="mh150 of-x-hidden"
        />
      </div>
    </section>
  );
};

export default ReportDetails;
