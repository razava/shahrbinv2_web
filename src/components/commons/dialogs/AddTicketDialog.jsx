import React, { useState } from "react";
import Button from "../../helpers/Button";
import Textarea from "../../helpers/Textarea";
import SelectBox from "../../helpers/SelectBox";
import { CommonAPI } from "../../../apiCalls";
import { useMutation } from "@tanstack/react-query";
import { openTicket } from "../../../api/StaffApi";
import AttachmentToggle from "../dataDisplay/Attachment/AttachmentToggle";
import { toast } from "react-toastify";
import { constants } from "../../../helperFuncs";

export default function AddTicketDialog({ refresh }) {
  const [values, setValues] = useState({
    messageContent: "",
    category: "",
    priority: "",
  });
  const [attachments, setAttachments] = useState([]); // user attachments to be send to selected destination

  //Queries
  const openTicketMutation = useMutation({
    mutationKey: ["openTicket"],
    mutationFn: openTicket,
    onSuccess: (res) => {
      refresh();
      toast("تیکت شما با موفقیت ثبت شد.", { type: "success" });
    },
    onError: (err) => {},
  });

  const handleChange =
    (name, options = {}) =>
    (e) => {
      let value = e?.target ? e.target.value : e;
      console.log(value);
      if (options?.onlyDigits) {
        value = String(value).replace(/\D/g, "");
      }
      setValues({ ...values, [name]: value });
    };

  const onAddAttachment = (attachs) => {
    console.log(attachs);
    setAttachments(attachs);
  };

  const openTicketHandler = () => {
    const formData = new FormData();
    formData.append("MessageContent", values.messageContent);
    formData.append("CategoryId", Number(values.category));
    formData.append("Priority", Number(values.priority));
    attachments.map((item) => {
      formData.append("Attachments", item.file);
    });
    formData.append(
      "UserName",
      localStorage.getItem(constants.SHAHRBIN_MANAGEMENT_USERNAME)
    );
    openTicketMutation.mutate(formData);
  };

  return (
    <>
      <div className="w100 mxa row">
        <Textarea
          value={values.messageContent}
          title="متن تیکت"
          wrapperClassName="col-md-12 col-sm-12 "
          inputClassName="min-h-[100px]"
          name="messageContent"
          handleChange={handleChange}
          required={true}
        />
      </div>
      <div className="w100 mxa row">
        <SelectBox
          value={values.priority}
          label="اولویت"
          staticData={true}
          options={[
            { id: 0, title: "کم" },
            { id: 1, title: "متوسط" },
            { id: 2, title: "زیاد" },
          ]}
          wrapperClassName="col-md-6 col-sm-12"
          inputClassName=""
          name="priority"
          handleChange={handleChange}
          required={true}
        />
        <SelectBox
          value={values.category}
          label="دسته بندی"
          caller={CommonAPI.getTicketCategories}
          wrapperClassName="col-md-6 col-sm-12"
          inputClassName=""
          handle={["categoryName"]}
          name="category"
          handleChange={handleChange}
          required={true}
        />
      </div>
      <div className=" mt-3">
        <AttachmentToggle onAddAttachment={onAddAttachment} />
      </div>

      <div className="w100 mxa fre py1 px2 border-t-light mt1">
        <Button
          title={"تایید"}
          className="py1 br05 bg-primary"
          onClick={openTicketHandler}
          //   loading={NewsMutation.isPending}
        />
      </div>
    </>
  );
}
