import React, { useRef, useState } from "react";
import {
  checkExtension,
  checkOverlAllSize,
  cn,
  showExtensionError,
  showSizeError,
} from "../../utils/functions";
import Icon from "../Icon/Icon";
import { allFormats } from "./constants";
import File from "./File";
import styles from "./style.module.css";
import { useMutation } from "@tanstack/react-query";
import { postFiles } from "../../api/commonApi";

const DropZone = ({
  placeholder = "فایل را بکشید و اینجا رها کنید.",
  onChange = (f) => f,
  maxSize = 10000000,
  name = "",
  classNames = {
    wrapper: "",
    dropzone: "",
  },
  style = {
    wrapper: {},
    dropzone: {},
  },
  error = false,
  allowedFormats = allFormats,
  label = "",
}) => {
  //   refrences
  const inputRef = useRef(null);
  //queries
  const postFilesMutation = useMutation({
    mutationKey: ["postFiles"],
    mutationFn: postFiles,
    onSuccess: (res) => {
      setFileIds([...fileIds, { id: res.id }]);
      setFiles([...files, temporaryFiles]);
      onChange([...fileIds, { id: res.data.id }], name);
    },
    onError: (err) => {},
  });
  //   states
  const [files, setFiles] = useState([]);
  const [fileIds, setFileIds] = useState([]);
  const [temporaryFiles, setTemporaryFiles] = useState([]);
  const [highlight, setHighlight] = useState(false);
  console.log(files);
  // classNames
  const dropzoneClassName = [
    styles.dropzone,
    highlight ? styles.highlight : "",
    error ? styles.error : "",
    classNames.dropzone,
  ].join(" ");

  // functions
  const onZoneClicked = () => {
    inputRef.current.click();
  };

  const validate = (newFiles) => {
    if (newFiles && newFiles.length > 0) {
      const file = newFiles[0];
      const isExtensionAllowed = checkExtension(file.name, allowedFormats);
      if (!isExtensionAllowed) {
        showExtensionError();
        return { isValid: false };
      }
      const isOverallSizeOkay = checkOverlAllSize(
        [...files, ...newFiles],
        maxSize
      );
      if (!isOverallSizeOkay) {
        showSizeError(maxSize / 1000000);
        return { isValid: false };
      }
    }
    return { isValid: true };
  };

  const onAddFile = (e) => {
    const { isValid } = validate(e.target.files);
    console.log(333);

    if (!isValid) return;
    const newFiles = Array.from(e.target.files).map((f) => {
      f.id = `dz-f-${files.length}`;
      return f;
    });
    const formData = new FormData();
    setTemporaryFiles(newFiles[0]);
    formData.append("File", newFiles[0]);
    // newFiles.map((item) => {
    //   console.log(item);
    // })
    formData.append("AttachmentType", 0);
    postFilesMutation.mutate(formData);
    // setFiles([...files, ...newFiles]);
    // onChange([...files, ...newFiles], name);
  };
  console.log(fileIds);
  const onRemove = (file) => {
    const updatedFiles = files.filter((f) => String(f.id) !== String(file.id));
    setFiles(updatedFiles);
    onChange(updatedFiles, name);
  };

  //   drag and drop
  const onDragOver = (e) => {
    e.preventDefault();
    setHighlight(true);
  };

  const onDragLeave = (e) => {
    setHighlight(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setHighlight(false);
    const { isValid } = validate(e.dataTransfer.files);
    if (!isValid) return;
    const file = e.dataTransfer.files[0];
    if (file) {
      file.id = `dz-f-${files.length}`;
      const formData = new FormData();
      formData.append("File", file);
      formData.append("AttachmentType", 0);
      setFiles([...files, file]);
      onChange([...files, file], name);
    }
  };
  console.log(files);
  return (
    <>
      <section
        style={style.wrapper}
        className={cn(styles.wrapper, classNames.wrapper)}
      >
        <span className={styles.label}>{label}</span>
        <div
          className={dropzoneClassName}
          style={style.dropzone}
          onClick={onZoneClicked}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <Icon name="upload" size="2rem" />
          <span>{placeholder}</span>
        </div>
        <div className={styles.uploads}>
          {files.map((file) => (
            <File key={file.id} file={file} onRemove={onRemove} />
          ))}
        </div>
      </section>

      <input
        type={"file"}
        ref={inputRef}
        onChange={onAddFile}
        style={{ display: "none" }}
      />
    </>
  );
};

export default DropZone;
