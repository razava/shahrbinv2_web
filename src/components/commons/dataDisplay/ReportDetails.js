import React, { useContext } from "react";
import styles from "../../../stylesheets/reportdialog.module.css";
import moment from "moment-jalaali";
import { convertserverTimeToDateString, doesExist } from "../../../helperFuncs";
import ShowAttachments from "./ShowAttachments";
import TextInput from "../../helpers/TextInput";
import Textarea from "../../helpers/Textarea";
import { AppStore } from "../../../store/AppContext";

moment.loadPersian({ usePersianDigits: true });
const ReportDetails = ({ data }) => {
  const [store] = useContext(AppStore);
  let regionName;
  if (data.address) {
    console.log(data.address.regionId);
    let regions = store.initials.regions.map((item) => {
      if (item.id == data?.address?.regionId) {
        regionName = item.name;
      }
    });
  }
  let categoryTitle;
  const category = store.initials.categories.categories.map((item) => {
    if (item.id == data.categoryId) {
      return item;
    } else {
      const a = item.categories.map((itm) => {
        if (itm.id == data.categoryId) {
          categoryTitle = itm.title;
          // return itm.id;
        }
      });
    }
  });
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
            value={doesExist(categoryTitle)}
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
            value={data?.address?.detail}
            readOnly={true}
            title="آدرس"
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
        </div>
        <Textarea
          value={
            data?.category?.formElements.length > 0
              ? ""
              : doesExist(data?.comments)
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
