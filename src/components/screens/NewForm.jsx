import React, { useContext, useEffect, useState } from "react";
import Tools from "../../components2/Tools/Tools";
import FormEditor from "../../components2/FormEditor/FormEditor";
import EditField from "../../components2/EditField/EditField";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styles from "./NewForm.module.css";
import FormPreview from "../../components2/FormPreview/FormPreview";
import Button from "../../components2/Button/Button";
import { editForm, postForm } from "../../api/AdminApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AppStore } from "../../formStore/store";
import { useHistory } from "react-router-dom";

const modalRoot = document && document.getElementById("modal-root");
function NewForm() {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const queryClient = useQueryClient();

  const onOpenModal = () => setOpen(true);
  const onOpenModal2 = () => setOpen2(true);
  const onCloseModal = () => setOpen(false);
  const onCloseModal2 = () => setOpen2(false);

  const [store, dispatch] = useContext(AppStore);
  const history = useHistory();
  console.log(store.form);

  const formMutation = useMutation({
    mutationKey: ["postForm"],
    mutationFn: postForm,
    onSuccess: (res) => {
      toast("فرم با موفقیت ایجاد شد.", { type: "success" });
      history.push("/admin/forms");
    },
    onError: (err) => {},
  });

  const editFormMutation = useMutation({
    mutationKey: ["editForm"],
    mutationFn: editForm,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getForms"] });
      toast("فرم با موفقیت ویرایش شد.", { type: "success" });
      history.push("/admin/forms");
      localStorage.removeItem("formBuilder");
      localStorage.removeItem("formName");
      modalRoot.classList.remove("active");
    },
    onError: (err) => {},
  });

  const postFormHandler = () => {
    const formElements = store.form.map((item, index) => {
      return {
        elementType: item.elementType,
        title: item.props.label ? item.props.label : item.props.title,
        name: item.props.label ? item.props.label : item.props.title,
        order: index + 1,
        meta: JSON.stringify(item),
      };
    });
    const isEditMode = localStorage.getItem("formBuilder");
    if (isEditMode) {
      editFormMutation.mutate({
        id: id,
        payload: {
          title: localStorage.getItem("formName"),
          elements: formElements,
        },
      });
    } else {
      formMutation.mutate({
        title: name,
        elements: formElements,
      });
    }
  };

  useEffect(() => {
    const formId = localStorage.getItem("formId");
    setId(formId);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "relative",
        alignItems: "stretch",
        fontFamily: "iranyekan",
      }}
    >
      <Tools />
      <FormEditor />
      <EditField />
      <button className={styles.previewButton} onClick={onOpenModal}>
        پیش نمایش فرم
      </button>
      <button
        className="appearance-none p-3 font-bold hover:scale-110 transition w-40 fixed bottom-28 left-14 bg-blue-500 text-white shadow-md rounded-md border-none text-lg"
        onClick={() => {
          const isEditMode = localStorage.getItem("formBuilder");
          if (isEditMode) {
            postFormHandler();
          } else {
            onOpenModal2();
          }
        }}
      >
        ذخیره
      </button>
      <div>
        <Modal
          open={open}
          onClose={onCloseModal}
          center
          modalId="1"
          styles={{ direction: "rtl" }}
          //   classNames={styles.customModal}
        >
          <h2 className="mt-10 font-bold text-2xl mb-5">پیش نمایش فرم</h2>
          <FormPreview />
        </Modal>
      </div>
      <Modal
        open={open2}
        onClose={onCloseModal2}
        center
        modalId="2"
        styles={{ direction: "rtl" }}
        //   classNames={styles.customModal}
      >
        <input
          type="text"
          placeholder="لطفا نام فرم را وارد کنید."
          autoFocus={true}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4  mt-16 placeholder:text-xl"
        ></input>
        <div className="flex justify-end mt-10">
          <Button
            onClick={postFormHandler}
            className=" max-md:w-full !w-40 !h-16"
          >
            تایید
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default NewForm;
