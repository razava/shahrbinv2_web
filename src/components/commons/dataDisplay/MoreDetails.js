import React from "react";
import { convertserverTimeToDateString, doesExist } from "../../../helperFuncs";
import styles from "../../../stylesheets/reportdialog.module.css";
import Textarea from "../../helpers/Textarea";
import TextInput from "../../helpers/TextInput";
import ShowAttachments from "./ShowAttachments";

const MoreDetails = ({ data }) => {
  return (
    <>
      <section className={styles.reportDetails}>
        <div className={styles.infoList}>
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
              value={convertserverTimeToDateString(data?.deadline)}
              readOnly={true}
              title="زمان اتمام"
              wrapperClassName="mxa flex-1"
              inputClassName=""
              required={false}
            />
          </div>
          <div className="w90 mxa frc wrap">
            <TextInput
              value={convertserverTimeToDateString(data?.responseDeadline)}
              readOnly={true}
              title="زمان پاسخگویی"
              wrapperClassName="mxa flex-1"
              inputClassName=""
              required={false}
            />
            <TextInput
              value={doesExist(data?.rating)}
              readOnly={true}
              title="امتیاز شهروند"
              wrapperClassName="mxa flex-1"
              inputClassName=""
              required={false}
            />
          </div>
          <div className="w90 mxa frc wrap">
            <TextInput
              value={doesExist(data?.visibility === 0 ? "عمومی" : "خصوصی")}
              readOnly={true}
              title="وضعیت انتشار"
              wrapperClassName="mxa flex-1"
              inputClassName=""
              required={false}
            />
            <TextInput
              value={doesExist(data?.isIdentityVisible ? "قابل رویت" : "مخفی")}
              readOnly={true}
              title="اطلاعات هویتی شهروند"
              wrapperClassName="mxa flex-1"
              inputClassName=""
              required={false}
            />
          </div>
          <div className="w90 mxa frc wrap">
            <TextInput
              value={doesExist(data?.likes)}
              readOnly={true}
              title="تعداد پسند‌ها"
              wrapperClassName="mxa flex-1"
              inputClassName=""
              required={false}
            />
            <TextInput
              value={doesExist(data?.commentsCount)}
              readOnly={true}
              title="تعداد نظر‌ها"
              wrapperClassName="mxa flex-1"
              inputClassName=""
              required={false}
            />
          </div>
          <div className="w90 mxa wrap">
            <TextInput
              value={doesExist(data?.lastStatus)}
              readOnly={true}
              title="وضعیت"
              wrapperClassName="px-1 col-md-6"
              inputClassName=""
              required={false}
            />
          </div>
          <div className={"px1 py1 w90 mxa d-flex fdc al-s ju-c relative"}>
            <label
              className={
                "text-color f15 mr2 w-auto text-right mb-1 d-flex z1 bg-color px1"
              }
            >
              پیوست ها{" "}
            </label>
            <hr className="w100 border-t-light" />
            <ShowAttachments medias={data?.medias} isDeletable={false} />
          </div>
        </div>
      </section>
    </>
  );
};

export default MoreDetails;
