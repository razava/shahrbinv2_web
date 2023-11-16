import React from "react";
import styles from "../../../stylesheets/avatar.module.css";
import PHImage from "../../../assets/Images/item_profilepic_placeholder.png";
import LazyLoadWrapper from "../../helpers/LazyLoadWrapper";
import { fixURL } from "../../../helperFuncs";

const Avatar = ({
  url,
  altText = "",
  source = "",
  placeholder = false,
  size = 2,
}) => {
  return (
    <div
      className={[styles.wrapper].join(" ")}
      style={{ width: size * 25 + "px", height: size * 25 + "px" }}
    >
      {placeholder ? (
        <LazyLoadWrapper
          image={{
            src: PHImage,
            alt: altText,
            className: styles.avatar,
            style: { width: size * 25 + "px", height: size * 25 + "px" },
          }}
        />
      ) : source ? (
        <LazyLoadWrapper
          image={{
            src: source,
            alt: altText,
            className: styles.avatar,
            style: { width: size * 25 + "px", height: size * 25 + "px" },
          }}
        />
      ) : (
        <LazyLoadWrapper
          image={{
            src: fixURL(url, false),
            alt: altText,
            className: styles.avatar,
            style: { width: size * 25 + "px", height: size * 25 + "px" },
          }}
        />
      )}
    </div>
  );
};

export default Avatar;
