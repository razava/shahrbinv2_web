import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import pdf from "../../assets2/images/pdf.png";
import word from "../../assets2/images/word.png";
import excel from "../../assets2/images/excel.png";
import ppt from "../../assets2/images/powerpoint.png";
import Progress from "../Progress/Progress";
import { getExtension, isImage } from "../../utils/functions";
import Icon from "../Icon/Icon";

const File = ({ file = {}, onRemove = (f) => f }) => {
  //   states
  const [source, setSource] = useState(null);

  // variables
  const { name = "", size } = file;

  //   functions
  const getSize = (size) => {
    const kb = Math.floor(size / 1000);
    if (kb < 1000) return `${kb} kb`;
    else if (kb / 1000 < 1000) return `${kb / 1000} mb`;
    else return `${size} bytes`;
  };

  const getPH = (ext) => {
    switch (String(ext).toLowerCase()) {
      case "doc":
        return setSource(word);
      case "docx":
        return setSource(word);
      case "pdf":
        return setSource(pdf);
      case "ppt":
        return setSource(ppt);
      case "pptx":
        return setSource(ppt);
      case "xls":
        return setSource(excel);
      case "xlsx":
        return setSource(excel);

      default:
        return setSource("");
    }
  };

  const getImage = (file) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      setSource(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(file);
  };

  useEffect(() => {
    if (isImage(file.name)) getImage(file);
    else getPH(getExtension(file.name));
  }, []);
  return (
    <>
      <article className={styles.file}>
        <div className={styles.fileDetails}>
          <span className={styles.fileInfo}>
            <span>{name}</span>
            <span>{getSize(size)}</span>
          </span>
          <div className={styles.progressWrapper}>
            <Icon
              name="times"
              onClick={handleRemove}
              classNames={{ icon: styles.removeIcon }}
            />
            <Progress value={100} />
          </div>
        </div>
        <div className={styles.fileImage}>
          <img src={source} />
        </div>
      </article>
    </>
  );
};

export default File;
