import React, { useEffect, useRef, useState } from "react";
import DialogToggler from "../../../helpers/DialogToggler";
import {
  checkExtensions,
  checkOverlAllSize,
  isFile,
  showExtensionError,
  showSizeError,
} from "../../../../helperFuncs";
import ShowAttachments from "../ShowAttachments";
import DialogButtons from "../../dialogs/DialogButtons";
import { useMutation } from "@tanstack/react-query";
import { postFiles } from "../../../../api/commonApi";

const AddAttachment = ({
  open = false,
  setOpen = (f) => f,
  onAdd = (f) => f,
  reset = false,
  id = "add-attachment",
}) => {
  // refrences
  const fileInputRef = useRef(null);

  //   states
  const [attachments, setAttachments] = useState([]);
  const [data, setData] = useState(false);
  const uploadMutation = useMutation({
    mutationKey: ["File"],
    mutationFn: postFiles,
    onSuccess: (res) => {
      // let newAttachmnets = attachments;
      // newAttachmnets = [...attachments];
      let newAttachmnets = attachments;
      newAttachmnets = [
        ...newAttachmnets,
        {
          file: data,
          id: res.id,
        },
      ];
      console.log(newAttachmnets);
      setAttachments(newAttachmnets);
    },
    onError: (err) => {},
  });
  
  // functions
  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const validateSize = (files) => {
    const isSizeOkay = checkOverlAllSize([...attachments, ...files]);
    if (!isSizeOkay) {
      showSizeError();
      return false;
    }
    return true;
  };

  const validateExtensions = (files) => {
    const isExtensionAllowed = files.some((f) => checkExtensions(f.name));
    if (!isExtensionAllowed) {
      showExtensionError();
      return false;
    }
    return true;
  };

  const checkFiles = (files) => {
    const supported = isFile(files[0]);
    if (supported) {
      const isSizeOkay = validateSize(files);
      const isExtensionAllowed = validateExtensions(files);
      if (isSizeOkay && isExtensionAllowed) return true;
      else return false;
    } else return false;
  };

  const onAddFile = (e) => {
    const files = Array.from(e.target.files);
    const validationResult = checkFiles(files);
    if (validationResult) addFiles(files);
  };

  const addFiles = (files) => {
    console.log(files);
    setData(files[0]);
    const formData = new FormData();
    formData.append("File", files[0]);
    formData.append("AttachmentType", 1);
    uploadMutation.mutate(formData);
    console.log("fig");
  };

  const onRemoveFile = (attach) => {
    setAttachments(
      attachments.filter((a) => String(a.id) !== String(attach.id))
    );
  };

  const onConfirm = () => {
    onAdd(attachments);
  };

  const clear = () => {
    setAttachments([]);
  };
  // effects
  useEffect(() => {
    if (reset) {
      clear();
    }
  }, [reset]);
  return (
    <>
      <DialogToggler
        condition={open}
        setCondition={setOpen}
        width={600}
        id="add-attachment"
        // dialogId={id}
      >
        <input
          type={"file"}
          className="d-none"
          ref={fileInputRef}
          onChange={onAddFile}
          // multiple
        />
        <div className="w90 mxa">
          <ShowAttachments
            medias={attachments}
            isDeletable
            deleteHandler={onRemoveFile}
            preview={false}
          />
        </div>
        <DialogButtons
          primaryTitle="تایید"
          onPrimaryClick={onConfirm}
          secondaryTitle="افزودن"
          onSecondaryClick={openFilePicker}
        />
      </DialogToggler>
    </>
  );
};

export default AddAttachment;
