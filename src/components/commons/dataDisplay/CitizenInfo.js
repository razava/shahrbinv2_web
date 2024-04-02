import React from "react";
import styles from "../../../stylesheets/reportdialog.module.css";
import { doesExist } from "../../../helperFuncs";
import Avatar from "./Avatar";
import TextInput from "../../helpers/TextInput";
import Textarea from "../../helpers/Textarea";
import { useQuery } from "@tanstack/react-query";
import { getCitizenInformation } from "../../../api/commonApi";

const CitizenInfo = ({ data }) => {
  //queries
  const { data: citizenData, isLoading } = useQuery({
    queryKey: ["citizenData", data.citizenId],
    queryFn: () => getCitizenInformation(data.citizenId),
  });
  
  return (
    <section className={styles.wrapper}>
      <figure className={styles.avatarContainer}>
        <Avatar
          url={citizenData?.avatar?.url}
          placeholder={!citizenData?.avatar}
          size={6}
        />
      </figure>
      <section className={styles.infoList}>
        <TextInput
          value={
            doesExist(citizenData?.firstName) +
            " " +
            doesExist(citizenData?.lastName)
          }
          readOnly={true}
          title="نام شهروند"
          wrapperClassName="mxa "
          inputClassName=""
          required={false}
        />
        <TextInput
          value={doesExist(citizenData?.phoneNumber)}
          readOnly={true}
          title="تلفن همراه"
          wrapperClassName="mxa "
          inputClassName=""
          required={false}
        />
        {/* <Textarea
          value={doesExist(citizenData?.address?.detail)}
          readOnly={true}
          title="آدرس شهروند"
          wrapperClassName="mxa "
          inputClassName=""
          required={false}
        /> */}
      </section>
    </section>
  );
};

export default CitizenInfo;
