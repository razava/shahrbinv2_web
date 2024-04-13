import React, { useEffect, useState } from "react";
import { downloadImage, getExtension } from "../../../helperFuncs";
import styles from "../../../stylesheets/reportdialog.module.css";
import placeholder from "../../../assets/Images/articlePlaceholder.png";
import word from "../../../assets/Images/word.png";
import excel from "../../../assets/Images/excel.png";
import pdf from "../../../assets/Images/pdf.png";
import powerpoint from "../../../assets/Images/powerpoint.png";

const AttachItem = ({
  type = 0,
  media,
  isDeletable = false,
  deleteHandler = (f) => f,
  preview = true,
}) => {
  const [source, setSource] = useState("");

  const getUrl = (slag) =>
    (process.env.NODE_ENV === "development"
      ? window.__ENV__?.REACT_APP_API_URL
      : window.__ENV__?.REACT_APP_API_URL) + `/${slag}`;

  const getSource = (media) => {
    const file = media.file;
    const fileReader = new FileReader();

    fileReader.onload = () => {
      setSource(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  };

  const getPlaceHolder = () => {
    const ext = getExtension(media?.file?.name);
    switch (ext) {
      case "doc":
        return word;
      case "docx":
        return word;
      case "xls":
        return excel;
      case "xlsx":
        return excel;
      case "xlsm":
        return excel;
      case "ppt":
        return powerpoint;
      case "pptx":
        return powerpoint;
      case "pdf":
        return pdf;
      default:
        return placeholder;
    }
  };

  const getImageSource = (media) => {
    if (type === 0) return getUrl(media.url3);
    if (type === 1) return getPlaceHolder();
    if (type === 2) return source;
  };

  const onDelete = (e) => {
    e.stopPropagation();
    deleteHandler(media);
  };

  useEffect(() => {
    if (type === 2) {
      getSource(media);
    }
  }, []);

  const onDisplayImage = (e) => {
    e.stopPropagation();
    downloadImage(media.url);
  };
  return (
    <>
      <div className={styles.media}>
        <div
          className={[
            styles.mediaOverlay,
            isDeletable ? styles.before : "",
            preview ? styles.after : "",
          ].join(" ")}
        >
          {isDeletable ? (
            <div
              className={[styles.overlayPart, styles.overlayPart1].join(" ")}
            >
              {media.isDeleted ? (
                <span
                  key="recycle-icon"
                  className="text-white f3 mx1"
                  onClick={onDelete}
                >
                  <i className="fas fa-recycle"></i>
                </span>
              ) : (
                <span
                  key="times-icon"
                  className="text-white f3 mx1"
                  onClick={onDelete}
                >
                  <i className="fas fa-trash-alt"></i>
                </span>
              )}
            </div>
          ) : null}
          {preview && (
            <div
              className={[styles.overlayPart, styles.overlayPart2].join(" ")}
            >
              <span className="text-white f3" onClick={onDisplayImage}>
                <i className="fas fa-eye"></i>
              </span>
            </div>
          )}
        </div>

        <img src={getImageSource(media)} alt={media.alternateText} />
      </div>
    </>
  );
};

export default AttachItem;
