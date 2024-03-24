import React, { useEffect, useState } from "react";
import TextInput from "../../helpers/TextInput";
import Button from "../../helpers/Button";
import Textarea from "../../helpers/Textarea";
import { toast } from "react-toastify";
import { editFAQ, makeFAQ } from "../../../api/StaffApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import QuillEditor from "../../helpers/QuillEditor";

export default function AddFAQDialog({ mode, onSuccess, defaltValues }) {
  const queryClient = useQueryClient();
  const FAQMutation = useMutation({
    mutationKey: ["FAQ"],
    mutationFn: mode == "edit" ? editFAQ : makeFAQ,
    onSuccess: (res) => {
      onSuccess();
      toast(
        mode == "edit"
          ? "سوال با موفقیت ویرایش شد."
          : "سوال با موفقیت اضافه شد.",
        { type: "success" }
      );
      queryClient.invalidateQueries({ queryKey: ["FAQ"] });
    },
    onError: (err) => {},
  });
  const isEditMode = mode === "edit";
  const [values, setValues] = useState({
    question: "",
    answer: "",
  });
  console.log(defaltValues);
  const handleChange = (name, onlyDigit) => (e) => {
    let value = e.target ? e.target.value : e;
    if (onlyDigit) {
      value = String(value).replace(/\D/g, "");
    }
    setValues({ ...values, [name]: value });
  };
  const setAnswer = (data) => {
    console.log(data);
    setValues({ ...values, answer: data });
  };
  //   console.log(defaltValues);
  const createFaq = () => {
    console.log(values);
    console.log(defaltValues);
    if (mode == "edit") {
      FAQMutation.mutate({
        Data: {
          question: values.question,
          answer: values.answer,
          isDeleted: false,
        },
        id: defaltValues.id,
      });
    } else {
      FAQMutation.mutate({
        question: values.question,
        answer: values.answer,
        isDeleted: false,
      });
    }
  };
  useEffect(() => {
    if (defaltValues) {
      setValues({
        answer: defaltValues?.answer,
        question: defaltValues?.question,
      });
    }
  }, []);
  return (
    <>
      {" "}
      <div className="w100 mxa row">
        <TextInput
          title="سوال"
          required={true}
          value={values.question}
          name="question"
          onChange={handleChange}
          wrapperClassName="col-md-12"
          //   onlyDigit={true}
        />
      </div>
      {/* <div className="w100 mxa">
        <Textarea
          wrapperClassName="col-md-12"
          inputClassName="flex-auto mh150"
          value={values.answer}
          handleChange={handleChange}
          name="answer"
          title="جواب"
          required={true}
        />
      </div> */}
      <div style={{ textAlign: "right" }} className="w100 px-7 mb-5">
        <p style={{ marginRight: "15px" }}> جواب</p>
        <QuillEditor data={values.answer} setData={(data) => setAnswer(data)} />
      </div>
      {/* <div className="w100 mxa row">
        <TextInput
          title="جواب"
          required={true}
          value={values.answer}
          name="answer"
          onChange={handleChange}
          wrapperClassName="col-md-12"
          //   onlyDigit={true}
        />
      </div> */}
      <div className="w100 mxa fre py1 px2 border-t-light mt1">
        <Button
          title={isEditMode ? "ویرایش" : "ایجاد"}
          className="py1 br05 bg-primary"
          onClick={createFaq}
          //   loading={loading}
        />
      </div>
    </>
  );
}
