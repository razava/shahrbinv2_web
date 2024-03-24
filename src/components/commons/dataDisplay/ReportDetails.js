import React, { useContext, useRef } from "react";
import styles from "../../../stylesheets/reportdialog.module.css";
import moment from "moment-jalaali";
import { convertserverTimeToDateString, doesExist } from "../../../helperFuncs";
import ShowAttachments from "./ShowAttachments";
import TextInput from "../../helpers/TextInput";
import Textarea from "../../helpers/Textarea";
import { AppStore } from "../../../store/AppContext";
import { getCitizenInformation } from "../../../api/commonApi";
import { getReportHistory } from "../../../api/StaffApi";
import Button from "../../helpers/Button";
import { priorities } from "../../../utils/constants";

moment.loadPersian({ usePersianDigits: true });
const ReportDetails = ({ data }) => {
  const [store] = useContext(AppStore);
  const componentRef = useRef(null);
  let regionName;

  if (data.address) {
    console.log(data.address.regionId);
    let regions = store.initials.regions.map((item) => {
      if (item.id == data?.address?.regionId) {
        regionName = item.name;
      }
    });
  }
  console.log(data);

  return (
    <section className={styles.reportDetails}>
      <div className={styles.infoList}>
        <div className="w90 mxa frc wrap">
          <TextInput
            value={doesExist(data?.trackingNumber)}
            readOnly={true}
            title="شماره درخواست"
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
          <TextInput
            value={doesExist(data?.categoryTitle)}
            readOnly={true}
            title="موضوع "
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
        </div>
        <div className="w90 mxa frc wrap">
          <TextInput
            value={doesExist(data?.lastStatus)}
            readOnly={true}
            title="وضعیت"
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
          <TextInput
            value={doesExist(regionName)}
            readOnly={true}
            title="منطقه"
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
        </div>
        <div className="w90 mxa frc wrap">
          <TextInput
            value={convertserverTimeToDateString(data?.sent)}
            readOnly={true}
            title="تاریخ ایجاد"
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
          <TextInput
            value={doesExist(priorities[data?.priority]?.title)}
            readOnly={true}
            title="اولویت"
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
        </div>
        <div className="w90 mxa frc wrap">
          <TextInput
            value={data?.address?.detail}
            readOnly={true}
            title="آدرس"
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
        </div>
        <Textarea
          value={data?.form ? "" : doesExist(data?.comments)}
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
