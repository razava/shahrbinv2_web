import React, { useEffect, useState } from "react";
import Textarea from "../../helpers/Textarea";
import Button from "../../helpers/Button";
import { ViolationAPI } from "../../../apiCalls";
import { toast } from "react-toastify";
import useMakeRequest from "../../hooks/useMakeRequest";
import { serverError, unKnownError } from "../../../helperFuncs";

export default function CommentActions({ data, refresh, onNext }) {
  const [action, setAction] = useState("");
  const [comments, setComments] = useState("");
  const [payload, setPayload] = useState(null);
  const [submitRequest, setSubmitRequest] = useState(false);

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
      action: parseInt(action),
      text: comments,
    };

    // setLoading(true);
    setPayload(payload);
    setSubmitRequest(true);
  };

  const [] = useMakeRequest(
    ViolationAPI.handleCommentViolation,
    200,
    submitRequest,
    payload,
    (res) => {
      setSubmitRequest(false);
      //   setLoading(false);
      if (res && res.status === 200) {
        onNext();
        refresh();
      } else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    },
    data?.id
  );

  useEffect(() => {
    setComments(data.text);
  }, []);

  console.log(data);
  return (
    <>
      <div className="w-full mxa fcs py1 px-10">
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
            inputClassName="w100 mxa border-light br1 no-outline min-h-[6em] p-2"
            inputStyle={{ minHeight: 100 }}
            value={comments}
            name="comments"
            handleChange={handleTextChange}
            defaultStyles={false}
          />
        </div>
      )}
      <div className="w80 mxa fre py1 px2 border-t-light mt1 fixed b0 bg-white">
        <Button
          title="تایید"
          className="py1 br05 bg-primary"
          onClick={onSubmit}
          //   loading={createLoading}
        />
      </div>
    </>
  );
}
