import React from "react";
import styles from "../../../stylesheets/reportdialog.module.css";
import { doesExist } from "../../../helperFuncs";
import Avatar from "./Avatar";
import TextInput from "../../helpers/TextInput";
import Textarea from "../../helpers/Textarea";

const CitizenInfo = ({ data }) => {
  return (
    <section className={styles.wrapper}>
      <figure className={styles.avatarContainer}>
        <Avatar
          url={data?.avatar?.url}
          placeholder={!data?.avatar}
          size={6}
        />
      </figure>
      <section className={styles.infoList}>
        <TextInput
          value={
            doesExist(data?.firstName) +
            " " +
            doesExist(data?.lastName)
          }
          readOnly={true}
          title="نام شهروند"
          wrapperClassName="mxa "
          inputClassName=""
          required={false}
        />
        <TextInput
          value={doesExist(data?.phoneNumber)}
          readOnly={true}
          title="تلفن همراه"
          wrapperClassName="mxa "
          inputClassName=""
          required={false}
        />
        <Textarea
          value={doesExist(data?.address?.detail)}
          readOnly={true}
          title="آدرس شهروند"
          wrapperClassName="mxa "
          inputClassName=""
          required={false}
        />
      </section>
    </section>
  );
};

export default CitizenInfo;
