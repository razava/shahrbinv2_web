import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ViolationAPI } from "../../../apiCalls";
import { serverError, unKnownError } from "../../../helperFuncs";
import Button from "../../helpers/Button";
import Textarea from "../../helpers/Textarea";
import useMakeRequest from "../../hooks/useMakeRequest";

const ViolationDialog = ({
  dialogData,
  onSuccess = (f) => f,
  setLoading = (f) => f,
  type = "",
}) => {
  const [action, setAction] = useState("");
  const [comments, setComments] = useState("");
  const [payload, setPayload] = useState(null);
  const [submitRequest, setSubmitRequest] = useState(false);

  useEffect(() => {
    if (type === "report") setComments(dialogData?.report?.comments || "");
    if (type === "comment") setComments(dialogData?.comment?.text || "");
  }, []);

  const onChange = (e) => {
    const action = e.target.value;
    setAction(action);
  };

  const handleTextChange = (name) => (e) => {
    const value = e.target.value;
    if (name === "comments") setComments(value);
  };

  const onSubmit = () => {
    if (!action) {
      toast("لطفا یکی از اقدامات را انتخاب کنید.", { type: "error" });
      return;
    }
    const payload = {
      violationCheckResult: parseInt(action),
      comments,
      id: dialogData?.id,
    };
    setLoading(true);
    setPayload(payload);
    setSubmitRequest(true);
  };

  const [] = useMakeRequest(
    ViolationAPI.handleViolation,
    204,
    submitRequest,
    payload,
    (res) => {
      setSubmitRequest(false);
      setLoading(false);
      if (res && res.status === 204) {
        toast("گزارش تخلف با موفقیت بررسی شد.", { type: "success" });
        onSuccess();
      } else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    },
    dialogData?.id
  );
  return (
    <>
      <div className="w90 mxa my2 fcc">
        <div className="f2 text-dark">توضیحات</div>
        <div className="f15 text-dark w100 border-mute py1 px1">
          {dialogData.description
            ? dialogData.description
            : "توضیحی ثبت نشده است."}
        </div>
      </div>

      <div className="w90 mxa fcs py1 px1">
        <div className="w100 my1 frs">
          <input
            type="radio"
            className="text-dark ml1"
            name="action"
            onChange={onChange}
            value={"0"}
            checked={action === "0"}
          />
          <label className="f12">علامت‌گذاری به عنوان خوانده شده</label>
        </div>
        <div className="w100 my1 frs">
          <input
            type="radio"
            className="text-dark ml1"
            name="action"
            onChange={onChange}
            value={"1"}
            checked={action === "1"}
          />
          <label className="f12">حذف</label>
        </div>
        <div className="w100 my1 frs">
          <input
            type="radio"
            className="text-dark ml1"
            name="action"
            onChange={onChange}
            value={"2"}
            checked={action === "2"}
          />
          <label className="f12">ویرایش</label>
        </div>
      </div>

      {action === "2" && (
        <div className="w90 mxa">
          <Textarea
            wrapperClassName="w100"
            inputClassName="w100 mxa border-light br1 no-outline"
            inputStyle={{ minHeight: 100 }}
            value={comments}
            name="comments"
            handleChange={handleTextChange}
            defaultStyles={false}
          />
        </div>
      )}

      <div className="w90 mxa frc my2">
        <Button title="ثبت" className="w100 mxa" onClick={onSubmit} />
      </div>
    </>
  );
};

export default ViolationDialog;
