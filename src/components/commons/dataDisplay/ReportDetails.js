import React, { useContext, useRef } from "react";
import styles from "../../../stylesheets/reportdialog.module.css";
import moment from "moment-jalaali";
import { convertserverTimeToDateString, doesExist } from "../../../helperFuncs";
import ShowAttachments from "./ShowAttachments";
import TextInput from "../../helpers/TextInput";
import Textarea from "../../helpers/Textarea";
import { AppStore } from "../../../store/AppContext";
import { useReactToPrint } from "react-to-print";
import { useQuery } from "@tanstack/react-query";
import { getCitizenInformation } from "../../../api/commonApi";
import { getReportHistory } from "../../../api/StaffApi";

moment.loadPersian({ usePersianDigits: true });
const ReportDetails = ({ data }) => {
  const [store] = useContext(AppStore);
  const componentRef = useRef(null);
  let regionName;

  const { data: citizenData, isLoading } = useQuery({
    queryKey: ["citizenData", data.citizenId],
    queryFn: () => getCitizenInformation(data.citizenId),
  });

  const { data: reportDetailData, isLoading: isLoading2 } = useQuery({
    queryKey: ["reportDetail", data.id],
    queryFn: () => getReportHistory(data.id),
  });

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
      categoryTitle = item.title;
      return item;
    } else {
      const a = item.categories.map((itm) => {
        if (itm.id == data.categoryId) {
          categoryTitle = itm.title;
          return itm;
        }
      });
    }
  });
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
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
      <div className="   w-[88%] mx-auto">
        <button
          onClick={() => handlePrint()}
          className=" bg-[var(--btnBg)] text-white p-2 rounded-lg max-w-fit"
        >
          پرینت درخواست
        </button>
        <div style={{ display: "none" }}>
          <div className=" w-screen h-screen p-10 border" ref={componentRef}>
            <div className="  w-full h-full rounded-xl p-5">
              <p className=" text-center w-full font-bold text-xl mb-6">
                شهربین جامع
              </p>
              {/* <p className=" text-lg bg-gray-200 rounded-md p-2 my-1">
                اطلاعات درخواست
              </p> */}
              <h3 class="flex items-center w-full my-1">
                <span class="ml-3 text-xl font-bold"> اطلاعات درخواست</span>
                <span class="flex-grow bg-gray-500 rounded h-1"></span>
              </h3>
              <div className=" grid grid-cols-2 gap-2 w-full">
                <div className=" flex gap-2">
                  <p>شماره درخواست:</p>
                  <p className=" text-gray-500">
                    {doesExist(data?.trackingNumber)}
                  </p>
                </div>
                <div className=" flex gap-2">
                  <p>شماره درخواست:</p>
                  <p className=" text-gray-500">{doesExist(categoryTitle)}</p>
                </div>
              </div>
              <div className=" grid grid-cols-2 gap-2 w-full">
                <div className=" flex gap-2">
                  <p>وضعیت:</p>
                  <p className=" text-gray-500">
                    {doesExist(data?.lastStatus)}
                  </p>
                </div>
                <div className=" flex gap-2">
                  <p>منطقه:</p>
                  <p className=" text-gray-500">{doesExist(regionName)}</p>
                </div>
              </div>
              <div className=" grid grid-cols-1 gap-2 w-full">
                <div className=" flex gap-2">
                  <p>آدرس:</p>
                  <p className=" text-gray-500">{data?.address?.detail}</p>
                </div>
                {/* <div className=" flex gap-2">
                  <p>منطقه:</p>
                  <p className=" text-gray-500">{doesExist(regionName)}</p>
                </div> */}
              </div>
              <div className=" grid grid-cols-1 gap-2 w-full">
                <div className=" flex gap-2">
                  <p>توضیحات:</p>
                  <p className=" text-gray-500">
                    {data?.category?.formElements.length > 0
                      ? ""
                      : doesExist(data?.comments)}
                  </p>
                </div>
                {/* <div className=" flex gap-2">
                  <p>منطقه:</p>
                  <p className=" text-gray-500">{doesExist(regionName)}</p>
                </div> */}
              </div>
              <div className=" grid grid-cols-2 gap-2 w-full">
                <div className=" flex gap-2">
                  <p>تاریخ ایجاد:</p>
                  <p className=" text-gray-500">
                    {convertserverTimeToDateString(data?.sent)}
                  </p>
                </div>
                <div className=" flex gap-2">
                  <p>زمان اتمام:</p>
                  <p className=" text-gray-500">
                    {convertserverTimeToDateString(data?.deadline)}
                  </p>
                </div>
              </div>
              <div className=" grid grid-cols-2 gap-2 w-full">
                <div className=" flex gap-2">
                  <p>زمان پاسخگویی:</p>
                  <p className=" text-gray-500">
                    {convertserverTimeToDateString(data?.responseDeadline)}
                  </p>
                </div>
                <div className=" flex gap-2">
                  <p>امتیاز شهروند:</p>
                  <p className=" text-gray-500">{doesExist(data?.rating)}</p>
                </div>
              </div>
              <div className=" grid grid-cols-2 gap-2 w-full">
                <div className=" flex gap-2">
                  <p>وضعیت انتشار:</p>
                  <p className=" text-gray-500">
                    {doesExist(data?.visibility === 0 ? "عمومی" : "خصوصی")}
                  </p>
                </div>
                <div className=" flex gap-2">
                  <p>اطلاعات هویتی شهروند</p>
                  <p className=" text-gray-500">
                    {doesExist(data?.isIdentityVisible ? "قابل رویت" : "مخفی")}
                  </p>
                </div>
              </div>
              <div>
                {data?.medias?.length > 0 ? "پیوست دارد" : "پیوست ندارد"}
              </div>
              <h3 class="flex items-center w-full my-1">
                <span class="ml-3 text-xl font-bold"> اطلاعات شهروند</span>
                <span class="flex-grow bg-gray-500 rounded h-1"></span>
              </h3>
              <div className=" grid grid-cols-2 gap-2 w-full">
                <div className=" flex gap-2">
                  <p>نام شهروند:</p>
                  <p className=" text-gray-500">
                    {doesExist(citizenData?.firstName) +
                      " " +
                      doesExist(citizenData?.lastName)}
                  </p>
                </div>
                <div className=" flex gap-2">
                  <p>تلفن شهروند</p>
                  <p className=" text-gray-500">
                    {doesExist(citizenData?.phoneNumber)}
                  </p>
                </div>
              </div>
              <div className=" grid grid-cols-1 gap-2 w-full">
                <div className=" flex gap-2">
                  <p>آدرس شهروند:</p>
                  <p className=" text-gray-500">
                    {doesExist(citizenData?.address?.detail)}
                  </p>
                </div>
              </div>
              <h3 class="flex items-center w-full my-1">
                <span class="ml-3 text-xl font-bold">تاریخچه درخواست</span>
                <span class="flex-grow bg-gray-500 rounded h-1"></span>
              </h3>
              <div className=" flex flex-col gap-1">
                {reportDetailData?.map((item, index) => {
                  return (
                    <div className="border-0 border-b border-dashed border-b-gray-600 flex gap-2 items-center  p-2">
                      <div className=" flex flex-col gap-2">
                        <div className=" flex">
                          <div className=" text-black rounded-lg">
                            {index + 1}
                            {")"}
                          </div>
                          <div className=" pr-2">{item.message} - </div>
                          <div className=" pr-2">
                            {convertserverTimeToDateString(item.dateTime)}
                          </div>
                        </div>
                        <div className="">توضیح:{item.comment}</div>
                      </div>
                    </div>
                  );
                })}
                {reportDetailData?.map((item, index) => {
                  return (
                    <div className="border-0 border-b border-dashed border-b-gray-600 flex gap-2 items-center  p-2">
                      <div className=" flex flex-col gap-2">
                        <div className=" flex">
                          <div className=" text-black rounded-lg">
                            {index + 1}
                            {")"}
                          </div>
                          <div className=" pr-2">{item.message} - </div>
                          <div className=" pr-2">
                            {convertserverTimeToDateString(item.dateTime)}
                          </div>
                        </div>
                        <div className="">توضیح:{item.comment}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportDetails;
