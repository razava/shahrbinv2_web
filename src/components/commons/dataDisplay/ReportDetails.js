import React, { useContext, useEffect, useRef, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import CategoryForm2 from "./CategoryForm2";

moment.loadPersian({ usePersianDigits: true });
const ReportDetails = ({ data }) => {
  const [haveTextarea, setHaveTextarea] = useState(false);
  const [reportData, setReportData] = useState();

  const [store] = useContext(AppStore);
  const componentRef = useRef(null);
  let regionName;
  // let haveTextarea = false;

  if (data.address) {
    let regions = store.initials.regions.map((item) => {
      if (item.id == data?.address?.regionId) {
        regionName = item.name;
      }
    });
  }

  //queries
  const { data: citizenData, isLoading } = useQuery({
    queryKey: ["citizenData", data.citizenId],
    queryFn: () => getCitizenInformation(data.citizenId),
  });

  // if (data?.comments?.[0] == "{") {
  //   if (JSON.parse(data?.comments)?.values?.length == 1) {
  //     haveTextarea = true;
  //   }
  // }

  useEffect(() => {
    setHaveTextarea(false);
    setReportData(data);
    if (data?.comments?.[0] == "{") {
      try {
        // Escape newlines and then parse the JSON
        const escapedComments = data.comments.replace(/[\n\t\r]/g, '');
        const parsedComments = JSON.parse(escapedComments);

        if (parsedComments?.values?.length == 1) {
          setHaveTextarea(true);
        }
      } catch (error) {
        console.error("Failed to parse comments:", error);
      }
    }
  }, [data]);

  console.log(data?.comments);

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
            value={doesExist(citizenData?.phoneNumber)}
            readOnly={true}
            title="شماره تماس"
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
          <TextInput
            value={doesExist(data?.lastStatus)}
            readOnly={true}
            title="وضعیت"
            wrapperClassName="mxa flex-1"
            inputClassName=""
            required={false}
          />
        </div>
        <div className="w90 mxa frc wrap">
          <TextInput
            value={
              data?.currentActor?.title +
              " " +
              (data?.currentActor?.firstName || data?.currentActor?.lastName
                ? data?.currentActor?.firstName +
                  " " +
                  data?.currentActor?.lastName
                : "")
            }
            readOnly={true}
            title="عامل"
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
        {reportData && (
          <div className="w-[91%] mxa frc wrap">
            {haveTextarea && <CategoryForm2 data={data} />}
          </div>
        )}
        {/* <Textarea
          value={data?.form ? "" : doesExist(data?.comments)}
          readOnly={true}
          title="توضیحات"
          wrapperClassName="mxa"
          inputClassName="mh150 of-x-hidden"
        /> */}
      </div>
    </section>
  );
};

export default ReportDetails;
