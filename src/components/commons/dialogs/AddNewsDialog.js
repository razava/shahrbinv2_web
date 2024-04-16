import React, { useEffect, useRef, useState } from "react";
import TextInput from "../../helpers/TextInput";
import Button from "../../helpers/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNews, editNews, getNewsById } from "../../../api/AdminApi";
import { toast } from "react-toastify";
import { postFiles } from "../../../api/commonApi";
import { fixURL } from "../../../helperFuncs";
import QuillEditor from "../../helpers/QuillEditor";

export default function AddNewsDialog({ mode, onSuccess, defaltValues }) {
  const isEditMode = mode === "edit";

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["News", defaltValues?.id],
    queryFn: () => getNewsById(defaltValues?.id),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      setValues({
        title: data?.title,
        description: data?.description,
        url: data?.url,
        image: data?.imageFile.url3,
      });
      previewRef.current.src = fixURL(data?.imageFile?.url3, false);
      setPreview(true);
      setImage(data?.imageFile?.url3);
    }
  }, [data]);
  const queryClient = useQueryClient();
  const [values, setValues] = useState({
    title: "",
    description: "",
    url: "",
    image: "",
  });
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);
  const [image, setImage] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [preview, setPreview] = useState(false);
  const NewsMutation = useMutation({
    mutationKey: ["FAQ"],
    mutationFn: mode == "edit" ? editNews : createNews,
    onSuccess: (res) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["News"] });
    },
    onError: (err) => {},
  });

  const CreateNews = () => {
    console.log(values);
    console.log(defaltValues);
    const payload = new FormData();
    payload.append("title", values.title);
    payload.append("description", values.description);
    payload.append("url", values.url ? values.url : "/");
    payload.append("image", image);
    payload.append("isDeleted", false);
    if (mode == "edit") {
      NewsMutation.mutate({
        Data: payload,
        id: defaltValues.id,
      });
    } else {
      NewsMutation.mutate(payload);
    }
  };
  const handleChange = (name, onlyDigit) => (e) => {
    let value = e.target ? e.target.value : e;
    if (onlyDigit) {
      value = String(value).replace(/\D/g, "");
    }
    setValues({ ...values, [name]: value });
  };

  const showPreview = (image) => {
    const reader = new FileReader();

    reader.onload = () => {
      previewRef.current.src = reader.result;
      setPreview(true);
    };

    reader.readAsDataURL(image);
  };

  const clearPreview = (e) => {
    if (e) e.stopPropagation();
    setImage(null);
    setPreview(false);
  };

  const handleImageChange = (e) => {
    console.log("asdasdads");
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setImage(file);
    showPreview(file);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="d-none"
        onChange={handleImageChange}
      />

      <section className="w90 mxa fcc">
        <div className="w100 mxa row">
          <TextInput
            title="عنوان"
            required={false}
            value={values.title}
            name="title"
            onChange={handleChange}
            wrapperClassName="col-md-12"
          />
        </div>
        <div style={{ textAlign: "right" }} className="w100 px-7 mb-5">
          <p className="" style={{ marginRight: "15px" }}>
            {" "}
            توضیحات
          </p>
          <QuillEditor
            data={values.description}
            setData={(data) => setValues({ ...values, description: data })}
          />
        </div>
        {/* <div className="w100 mxa row">
          <TextInput
            title="لینک خبر"
            required={false}
            value={values.url}
            name="url"
            onChange={handleChange}
            wrapperClassName="col-md-12"
          />
        </div> */}
        <div className="w100 mxa row">
          <TextInput
            title="تصویر"
            required={false}
            name="image"
            onClick={() => fileInputRef.current.click()}
            wrapperClassName="col-md-12"
            inputClassName="pointer"
            readOnly={true}
            placeholder="انتخاب کنید."
            icon={image ? "fas fa-times" : ""}
            onIconClick={clearPreview}
          />
        </div>
        <img
          className={`sq75 border-mute br1 f3 my1 text-mute ${
            preview ? "frc" : "d-none"
          }`}
          ref={previewRef}
        />
        {!preview && (
          <span className="sq75 border-mute br1 f3 frc my1 text-mute">
            <i className="fas fa-image"></i>
          </span>
        )}
      </section>
      <div className="w100 mxa fre py1 px2 border-t-light mt1">
        <Button
          title={isEditMode ? "ویرایش" : "ایجاد"}
          className="py1 br05 bg-primary"
          onClick={CreateNews}
          loading={NewsMutation.isPending}
        />
      </div>
    </>
  );
}
