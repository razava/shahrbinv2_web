import React, { useState } from "react";
import Button from "../../helpers/Button";
import AttachmentToggle from "../dataDisplay/Attachment/AttachmentToggle";
import Textarea from "../../helpers/Textarea";
import { useMutation } from "@tanstack/react-query";
import { postObjection } from "../../../api/StaffApi";
import { toast } from "react-toastify";

export default function Objection({ data, onNext }) {
  const [attachments, setAttachments] = useState([]);
  const [comment, setComment] = useState([]);

  const onAddAttachment = (attachs) => {
    console.log(attachs);
    setAttachments(attachs);
  };

  const handleChange = (name) => (e) => setComment(e.target.value);

  const objectionMutation = useMutation({
    mutationKey: ["postObjection"],
    mutationFn: postObjection,
    onSuccess: (res) => {
      toast("درخواست با موفقیت انتقال داده شد.", { type: "success" });
      onNext();
    },
    onError: (err) => {},
  });

  const handelObjection = () => {
    objectionMutation.mutate({
      ReportId: data.id,
      payload: {
        comments: comment,
        attachments: attachments.map((item) => item.id),
      },
    });
  };

  return (
    <>
      <div className={["w90 mxa mt1"].join(" ")}>
        <Textarea
          name="comment"
          title="توضیحات"
          value={comment}
          handleChange={handleChange}
          wrapperClassName="col-md-12"
          inputClassName="mh100"
        />
      </div>
      <div className="w90 frc mxa mt1 flex items-center gap-5">
        <AttachmentToggle onAddAttachment={onAddAttachment} />
      </div>
      <div className="w80 mxa fre py1 px2 border-t-light mt1 fixed b0 bg-white">
        <Button
          title="انتقال به بازرسی"
          className="py1 br05 bg-primary"
          onClick={handelObjection}
          //   loading={createLoading}
        />
      </div>
    </>
  );
}
