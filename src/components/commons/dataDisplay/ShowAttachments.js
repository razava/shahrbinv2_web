import React from "react";
import { isFile, isImage } from "../../../helperFuncs";
import styles from "../../../stylesheets/reportdialog.module.css";
import AttachItem from "./AttachItem";

const ShowAttachments = ({
  medias = [],
  handle = "url",
  isDeletable = false,
  preview = true,
  deleteHandler = (f) => f,
}) => {
  return (
    <>
      <div
        className={[
          styles.attachments,
          medias.length === 0 ? "" : "bordr-mute",
          "scrollbar",
        ].join(" ")}
      >
        {medias.length === 0 && (
          <span className="w100 h100 frc f15 text-color">
            پیوستی وجود ندارد.
          </span>
        )}
        {medias.length > 0 &&
          medias.map((media, i) => {
            if (isImage(media[handle])) {
              return (
                <AttachItem
                  key={media.id}
                  type={0}
                  media={media}
                  isDeletable={isDeletable}
                  preview={preview}
                  deleteHandler={deleteHandler}
                />
              );
            } else if (isFile(media?.file) && isImage(media?.file?.name)) {
              return (
                <AttachItem
                  key={media.id}
                  type={2}
                  media={media}
                  isDeletable={isDeletable}
                  preview={preview}
                  deleteHandler={deleteHandler}
                />
              );
            } else {
              return (
                <AttachItem
                  key={media.id}
                  type={1}
                  media={media}
                  isDeletable={isDeletable}
                  preview={preview}
                  deleteHandler={deleteHandler}
                />
              );
            }
          })}
      </div>
    </>
  );
};

export default ShowAttachments;
