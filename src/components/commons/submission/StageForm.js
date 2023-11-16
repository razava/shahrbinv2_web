import React, { useState } from "react";
import styles from "../../../stylesheets/reportdialog.module.css";
import { getFileExtension } from "../../../helperFuncs";
import SelectBox from "../../helpers/SelectBox";
import Textarea from "../../helpers/Textarea";
import AddAttachments from "../../helpers/AddAttachments";
import Button from "../../helpers/Button";
import { toast } from "react-toastify";

const StageForm = ({ data, createStage = (f) => f }) => {
  // data states
  const [values, setValues] = useState({
    stageId: "",
    comments: "",
  });
  const [attachments, setAttachments] = useState([]);

  // flags
  const [isAccepted, setIsAccepted] = useState(false);

  // func that keep track of changes in form
  const handleChange = (name) => (e) => {
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  // this function adds selected attachments to list
  const handleAttachments = (e) => {
    const file = e.target.files[0];
    let newAttachmnets = attachments;
    newAttachmnets = [...newAttachmnets, file];
    setAttachments(newAttachmnets);
  };

  const validations = () => {
    // should not send request if no stage has been selected
    if (!values.stageId) {
      toast("لطفا مرحله ارجاع را انتخاب نمایید", { type: "error" });
      return;
    }
  };

  const getReportPayload = () => {
    const payload = new FormData();
    payload.append("isAccepted", isAccepted);
    payload.append("stageId", values.stageId);
    payload.append("comment", values.comments);
    attachments.forEach((attachment) => {
      payload.append("attachments", attachment);
    });
    return payload;
  };

  const onSubmit = (e) => {
    // check validations
    e.preventDefault();
    const isValid = validations();
    if (!isValid) return;

    // get payload
    const payload = getReportPayload();
    // send payload
    createStage(payload);
  };

  return (
    <>
      <div className={styles.infoList}>
        <div
          className={[styles.infoGroup].join(" ")}
          style={{ padding: "10px 0" }}
        >
          <label className={styles.label}>مورد تایید است؟</label>
          <div className={styles.radioList}>
            <div className={styles.radioGroup}>
              <label htmlFor="publicReport">تایید</label>
              <input
                type="radio"
                className={styles.radio}
                name="isAccepted"
                id="publicReport"
                checked={isAccepted}
                onChange={() => setIsAccepted(true)}
              />
            </div>
            <div className={styles.radioGroup}>
              <label htmlFor="privateReport">رد</label>
              <input
                type="radio"
                className={styles.radio}
                name="isAccepted"
                id="privateReport"
                checked={!isAccepted}
                onChange={() => setIsAccepted(false)}
              />
            </div>
          </div>
        </div>
        <div
          className={[styles.infoGroup].join(" ")}
          style={{ padding: "10px 0" }}
        >
          <SelectBox
            label="مراحل:"
            staticData={true}
            horizontal={false}
            name="stageId"
            handleChange={handleChange}
            options={data?.possibleStages}
            handle={["displayName"]}
            value={values.stageId}
            wrapperStyle={{ margin: "0 auto", padding: "0 10px" }}
            selectStyle={{ border: "1px solid #ddd", flex: 4 }}
          />
        </div>
        <div
          className={[styles.infoGroup].join(" ")}
          style={{ padding: "10px 0" }}
        >
          <Textarea
            name="comments"
            title="توضیحات:"
            value={values.comments}
            handleChange={handleChange}
            wrapperStyle={{ margin: "0 auto", padding: "0 10px" }}
            inputStyle={{ border: "1px solid #ddd", flex: 4 }}
          />
        </div>
        <div className="w80 flex-around-row mx-a">
          <AddAttachments handleChange={handleAttachments} className="attach" />
          <div
            className={styles.attachments}
            style={{ minHeight: "100px", margin: "10px" }}
          >
            {attachments.map((media, i) => {
              if (
                ["jpg", "jpeg", "png", "jfif", "svg", "gif"].some(
                  (ext) => ext === getFileExtension(media.name).toLowerCase()
                )
              ) {
                return (
                  <div key={i} className={styles.media}>
                    <div className="w100 h100 flex-center-row">
                      <img src={URL.createObjectURL(media)} />
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={i} className={styles.media}>
                    <div className="w100 h100 flex-center-row">
                      <span title={media.name} className="f5 text-primary">
                        <i className="fas fa-link"></i>
                      </span>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div className={[styles.btnGroup, "my-2"].join(" ")}>
          <Button
            title="ارجاع درخواست"
            className="w80 py-1"
            fullWidth={true}
            onClick={onSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default StageForm;
