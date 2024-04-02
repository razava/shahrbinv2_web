import React, { useContext, useEffect, useState } from "react";
import TextInput from "../../helpers/TextInput";
import Button from "../../helpers/Button";
import Textarea from "../../helpers/Textarea";
import { toast } from "react-toastify";
import { editFAQ, makeFAQ } from "../../../api/StaffApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import QuillEditor from "../../helpers/QuillEditor";
import { editForm, getFormById } from "../../../api/AdminApi";
import { useHistory } from "react-router-dom";
import { appActions } from "../../../utils/constants";
import { AppStore } from "../../../formStore/store";

const modalRoot = document && document.getElementById("modal-root");

export default function AddFormDialog({
  mode,
  onSuccess,
  formId,
  defaltValues,
}) {
  const queryClient = useQueryClient();
  const [store, dispatch] = useContext(AppStore);
  const history = useHistory();
  const { data, isLoading } = useQuery({
    queryKey: ["getFormById", formId ? formId : localStorage.getItem("formId")],
    queryFn: () =>
      getFormById(formId ? formId : localStorage.getItem("formId")),
  });

  const editFormMutation = useMutation({
    mutationKey: ["editForm"],
    mutationFn: editForm,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getForms"] });
      toast(res.message, { type: "success" });
    },
    onError: (err) => {},
  });

  const [values, setValues] = useState({ title: "" });

  const handleChange = (name, onlyDigit) => (e) => {
    let value = e.target ? e.target.value : e;
    if (onlyDigit) {
      value = String(value).replace(/\D/g, "");
    }
    setValues({ ...values, [name]: value });
  };

  const editFormTitle = () => {
    editFormMutation.mutate({
      id: formId,
      payload: { title: values.title, elements: data?.elements },
    });
  };

  useEffect(() => {
    if (data) {
      setValues({ title: data.title });
    }
  }, [data]);

  return (
    <>
      {" "}
      <div className="w100 mxa row">
        <TextInput
          title="عنوان"
          required={true}
          value={values?.title}
          name="title"
          onChange={handleChange}
          wrapperClassName="col-md-12"
          //   onlyDigit={true}
        />
      </div>
      <div className="w100 mxa fre py1 px2 border-t-light mt1 gap-2">
        <Button
          title={"ساختار فرم"}
          className="py1 br05 text-primary bg-white border-primary"
          onClick={() => {
            modalRoot.classList.remove("active");
            history.push("/newForm");
            localStorage.setItem("formBuilder", "edit");
            localStorage.setItem("formName", data?.title);
            localStorage.setItem("formId", data?.id);
            const sortedElements = data?.elements.sort(
              (a, b) => a.order - b.order
            );
            dispatch({
              type: appActions.UPDATE_LIST,
              payload: sortedElements.map((item) => JSON.parse(item.meta)),
            });
          }}
          //   loading={loading}
        />
        <Button
          title={"ویرایش"}
          className="py1 br05 bg-primary"
          onClick={editFormTitle}
          //   loading={loading}
        />
      </div>
    </>
  );
}
