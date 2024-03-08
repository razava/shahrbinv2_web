import React, { useContext, useState } from "react";
import Textarea from "../../helpers/Textarea";
import Button from "../../helpers/Button";
import { AppStore } from "../../../store/AppContext";
import { useMutation } from "@tanstack/react-query";
import { postMessageToCitizen } from "../../../api/StaffApi";
import AttachmentToggle from "../dataDisplay/Attachment/AttachmentToggle";
import { toast } from "react-toastify";

export default function MessageToCitizen({ data, refresh }) {
  const sendMessageMutation = useMutation({
    mutationKey: ["messageToCitizen"],
    mutationFn: postMessageToCitizen,
    onSuccess: (res) => {
      toast("پیام شما با موفقیت به شهروند ارسال شد.", { type: "success" });
      setRefrerralData({ ...referralData, messageToCitizen: "" });
      setAttachments([]);
      refresh();
    },
    onError: (err) => {},
  });

  const [attachments, setAttachments] = useState([]); //
  const [referralData, setRefrerralData] = useState({
    comment: "",
    // reasonId: transition.reasonList[0].id,
    messageToCitizen: "",
  });

  const [store] = useContext(AppStore);
  const { messageToCitizen } = referralData;

  const handleChange = (name) => (e) =>
    setRefrerralData({ ...referralData, [name]: e.target.value }); //

  const onAddAttachment = (attachs) => {
    setAttachments(attachs);
  };

  const sendMessageToCitizen = () => {
    const payload = {
      attachments: attachments.map((item) => item.id),
      comment: messageToCitizen,
    };
    sendMessageMutation.mutate({ id: data?.id, payload: payload });
  };

  return (
    <>
      <div className={["w90 mxa mt1"].join(" ")}>
        <Textarea
          name="messageToCitizen"
          title="متن"
          value={messageToCitizen}
          handleChange={handleChange}
          wrapperClassName="col-md-12"
          inputClassName="mh100"
        />
        <div className="w90 frc mxa mt1">
          <AttachmentToggle onAddAttachment={onAddAttachment} />
        </div>
      </div>
      <div className="w80 mxa fre py1 px2 border-t-light mt1 fixed b0 bg-white">
        <Button
          title="ارسال پیام"
          className="py1 br05 bg-primary text-white"
          outline={!store.darkMode}
          onClick={sendMessageToCitizen}
          // loading={loading}
        />
      </div>
    </>
  );
}
