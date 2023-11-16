import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../../stylesheets/filters.module.css";
import Tabs from "./Tabs";
import Title from "./Title";
import DateInput from "./DateInput";
import moment from "moment-jalaali";
import { fixDigit } from "../../helperFuncs";
import Button from "./Button";

moment.loadPersian({ usePersianDigits: true });

const FiltersDialog = () => {
  const [filterData, setFilterData] = useState({
    fromDate: moment(
      fixDigit(new Date().toLocaleDateString("fa-IR"), true),
      "jYYYY/jMM/jDD"
    ),
    toDate: moment(
      fixDigit(new Date().toLocaleDateString("fa-IR"), true),
      "jYYYY/jMM/jDD"
    ),
  });

  const { fromDate, toDate } = filterData;

  const handleDateChange = (name, value) => {};

  return (
    <div className={styles.filters}>
      <Title title="فیلتر ها" size={0.5} margin={0} />
      <Tabs mainClass="filter-tab" activeClass="active">
        <div label="دسته بندی ها"></div>
        <div label="بازه زمانی">
          <div className="flex-between-column my">
            <DateInput
              name={"fromDate"}
              value={fromDate}
              handleChange={handleDateChange}
              title="از تاریخ"
            />
            <DateInput
              name={"toDate"}
              value={toDate}
              handleChange={handleDateChange}
              title="تا تاریخ"
            />
          </div>
        </div>
      </Tabs>
      <div className="flex-center-row bottom">
        <Button title="جستجو" />
      </div>
    </div>
  );
};

FiltersDialog.propTypes = {};

export default FiltersDialog;
