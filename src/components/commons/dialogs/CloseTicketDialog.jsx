import React, { useState } from "react";
import { closeTicket } from "../../../api/StaffApi";
import { useMutation } from "@tanstack/react-query";
import Textarea from "../../helpers/Textarea";
import Button from "../../helpers/Button";
import { toast } from "react-toastify";
import { appRoutes, constants } from "../../../helperFuncs";
import { useHistory } from "react-router-dom";

const modalRoot = document && document.getElementById("modal-root");

export default function CloseTicketDialog({ id, closedDialog }) {
  const [values, setValues] = useState({
    result: "",
  });
  const history = useHistory();
  const closeTicketMutation = useMutation({
    mutationKey: ["closeTicket"],
    mutationFn: closeTicket,
    onSuccess: (res) => {
      modalRoot.classList.remove("active");
      closedDialog();
      history.push(appRoutes.tickets);
      toast("تیکت با موفقیت بسته شد.", { type: "success" });
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

  const closeTicketHandler = () => {
    const payload = {
      result: values.result,
      userName: localStorage.getItem(constants.SHAHRBIN_MANAGEMENT_USERNAME),
    };
    closeTicketMutation.mutate({ id: id, payload: payload });
  };
  return (
    <>
      <div className="w100 mxa row">
        <Textarea
          value={values.messageContent}
          title="نتیجه"
          wrapperClassName="col-md-12 col-sm-12 "
          inputClassName=""
          name="messageContent"
          handleChange={handleChange}
          required={true}
        />
      </div>
      <div className="w100 mxa fre py1 px2 border-t-light mt1">
        <Button
          title={"تایید"}
          className="py1 br05 bg-primary"
          onClick={closeTicketHandler}
          //   loading={NewsMutation.isPending}
        />
      </div>
    </>
  );
}
