import React, { useState } from "react";
import styles from "./styles.module.css";
import Textarea from "../../helpers/Textarea";
import TextInput from "../../helpers/TextInput";
import SelectBox from "../../helpers/SelectBox";
import { callAPI, fixDigit } from "../../../helperFuncs";
import Button from "../../helpers/Button";
import { ComplaintsAPI } from "../../../apiCalls";
import { toast } from "react-toastify";
import TimeSelect from "../dataDisplay/TimeSelect";

const modal = document && document.getElementById("modal-root");

const ComplaintReferral = ({
  data,
  setDialog = (f) => f,
  refresh = (f) => f,
}) => {
  // states
  const [referralData, setRefrerralData] = useState({
    description: "",
    referToId: "",
    deadlineInMinutes: {
      day: 0,
      hour: 0,
      minute: 0,
    },
  });
  const [attachments, setAttachments] = useState([]);
  const [referLoading, setReferLoading] = useState(false);
  const [finishLoading, setFinishLoading] = useState(false);
  console.log(data);

  if (data) {
    console.log(data);
    const upOptions = data.referToOptionsUp.map((item) => {
      return { ...item, level: "up" };
    });
    const downOptions = data.referToOptionsDown.map((item) => {
      return { ...item, level: "down" };
    });
    var referOptions = upOptions.concat(downOptions);
    // console.log(referOptions);
  }

  // variables
  const isDeadlineMandatory = referralData.referToId
    ? data.referToOptions.find(
        (o) => String(o.id) === String(referralData.referToId)
      )?.isDeadlineMandatory
    : true;

  //   functions
  const handleChange = (name, onlyDigit) => (e) => {
    console.log(e, name);
    let value = e.target ? e.target.value : e;
    if (onlyDigit) {
      value = fixDigit(value, true).replace(/[^-0-9]/, "");
    }
    setRefrerralData({ ...referralData, [name]: value });
  };

  const onRefer = () => {
    if (!referralData.referToId)
      return toast("مقصد ارجاع را مشخص نمایید.", { type: "error" });
    if (
      isDeadlineMandatory &&
      referralData.deadlineInMinutes.day === 0 &&
      referralData.deadlineInMinutes.hour === 0 &&
      referralData.deadlineInMinutes.minute === 0
    )
      return toast("ضرب العجل نمی‌تواند خالی باشد.", { type: "error" });
    setReferLoading(true);
    const payload = new FormData();
    payload.append("Id", data.id);
    payload.append("Description", referralData.description);
    if (isDeadlineMandatory)
      payload.append(
        "DeadlineInMinutes",
        Number(
          referralData.deadlineInMinutes.day * 24 * 60 +
            referralData.deadlineInMinutes.hour * 60 +
            referralData.deadlineInMinutes.minute
        )
      );
    payload.append("ReferToId", referralData.referToId);
    attachments.forEach((a) => {
      payload.append("Attachments", a);
    });
    callAPI({
      caller: ComplaintsAPI.referComplaint,
      payload,
      successCallback: (res) => {
        toast("شکایت ارجاع داده شد.", { type: "success" });
        modal.classList.remove("active");
        setDialog(false);
        refresh();
      },
      requestEnded: () => setReferLoading(false),
    });
  };

  const onFinish = () => {
    setFinishLoading(true);
    const payload = new FormData();
    payload.append("Id", data.id);
    payload.append("Description", referralData.description);
    attachments.forEach((a) => {
      payload.append("Attachments", a);
    });
    callAPI({
      caller: ComplaintsAPI.finishComplaint,
      payload,
      successCallback: (res) => {
        toast("بررسی شکایت به پایان رسید.", { type: "success" });
        modal.classList.remove("active");
        setDialog(false);
        refresh();
      },
      requestEnded: () => setFinishLoading(false),
    });
  };
  return (
    <>
      <section className={styles.complaintRefferalWrapper}>
        <div className={[`w90 mxa mt1 row`].join(" ")}>
          {/* <TextInput
            title="ضرب‌العجل (روز)"
            wrapperClassName={"col-md-6 col-sm-12"}
            name="deadlineInMinutes"
            value={referralData.deadlineInMinutes}
            onlyDigit
            disabled={!isDeadlineMandatory}
          /> */}
          <TimeSelect
            label="ضرب‌العجل "
            wrapperClassName={"col-md-6 col-sm-12"}
            name="deadlineInMinutes"
            value={referralData.deadlineInMinutes}
            onChange={handleChange}
            disabled={!isDeadlineMandatory}
          />

          {/* list of reasons */}
          <SelectBox
            label="ارجاع به:"
            staticData={true}
            name="referToId"
            handleChange={handleChange}
            options={referOptions}
            handle={["title"]}
            value={referralData.referToId}
            wrapperClassName="col-md-6 col-sm-12"
          />
        </div>
        <div className={["w90 mxa mt1"].join(" ")}>
          <Textarea
            name="description"
            title="توضیحات"
            value={referralData.description}
            handleChange={handleChange}
            wrapperClassName="col-md-12"
            inputClassName="mh100"
          />
        </div>
        <div className="w90 frc mxa mt1">
          {/* <AttachmentToggle onAddAttachment={setAttachments} id="complaint-attachment" /> */}
        </div>

        <div className="w80 mxa fre py1 px2 border-t-light mt1 fixed b0 bg-white">
          <Button
            title="پایان"
            className="py1 br05 bg-success ml1"
            onClick={onFinish}
            loading={finishLoading}
          />
          <Button
            title="ارجاع"
            className="py1 br05 bg-primary"
            onClick={onRefer}
            loading={referLoading}
          />
        </div>
      </section>
    </>
  );
};

export default ComplaintReferral;
