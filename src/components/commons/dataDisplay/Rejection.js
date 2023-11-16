import React, { useState } from "react";
import PropTypes from "prop-types";
import dialogStyles from "../../../stylesheets/reportdialog.module.css";
import inputStyles from "../../../stylesheets/input.module.css";
import Textarea from "../../helpers/Textarea";
import Button from "../../helpers/Button";

const Rejection = () => {
  const [rejectData, setRejectData] = useState({
    citizenMessage: "",
    operatorComment: "",
  });

  const { citizenMessage, operatorComment } = rejectData;

  const handleChange = (name) => (e) =>
    setRejectData({ ...rejectData, [name]: e.target.value });

  return (
    <div className={dialogStyles.infoList}>
      <div className={dialogStyles.infoGroup}>
        <Textarea
          name="citizenMessage"
          handleChange={handleChange}
          title="پیام به شهروند"
          value={citizenMessage}
        />
      </div>
      <div className={dialogStyles.infoGroup}>
        <Textarea
          name="operatorComment"
          handleChange={handleChange}
          title="توضیحات"
          value={operatorComment}
        />
      </div>
      <div className={inputStyles.btnGroup}>
        <Button title="رد درخواست" outline={false} status="reject" />
      </div>
    </div>
  );
};

Rejection.propTypes = {};

export default Rejection;
