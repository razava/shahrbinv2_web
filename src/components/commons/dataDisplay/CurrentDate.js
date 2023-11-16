import moment from "moment-jalaali";
import React, { useContext, useState } from "react";
import { jalaaliMonth, jalaalWeekDays } from "../../../helperFuncs";
import { AppStore } from "../../../store/AppContext";
import Icon from "../../helpers/Icon/Icon";
import styles from "../navigations/SideBar/sidebar.module.css";
// require('moment/locale/fa')
moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });

const CurrentDate = () => {
  // store
  const [store, dispatch] = useContext(AppStore);

  // flags
  const [openVisible, setOpenVisible] = useState(true);
  const [closeVisible, setCloseVisible] = useState(false);

  // functions
  const getTodayDate = () => {
    const todayDate = new Date();
    const momentDate = moment(todayDate);
    const weekDayIndex =
      momentDate.day() + 1 > jalaalWeekDays.length - 1
        ? 0
        : momentDate.day() + 1;
    const weekDay = jalaalWeekDays[weekDayIndex];
    const monthIndex =
      momentDate.jMonth() > jalaaliMonth.length - 1 ? 0 : momentDate.jMonth();
    const month = jalaaliMonth[monthIndex];
    const dateString = `${weekDay} ${momentDate.jDate()} ${month} ماه ${momentDate.jYear()}`;
    return dateString;
  };

  // opened toggle ui
  const openedNavbar = (
    <>
      <span className="f15 mx1 text-right">{getTodayDate()}</span>
    </>
  );
  const onTransitionEnd = () => {
    if (store.sidebarIsOpen) {
      setCloseVisible(true);
      setOpenVisible(false);
    } else {
      setOpenVisible(true);
      setCloseVisible(false);
    }
  };
  return (
    <>
      <section
        className={[
          styles.currentDate,
          store.sidebarIsOpen ? "" : styles.sidepanelClose,
        ].join(" ")}
        onTransitionEnd={onTransitionEnd}
      >
        <div
          className={[
            styles.currentDateContent,
            closeVisible ? "" : styles.hide,
          ].join(" ")}
        >
          {store.sidebarIsOpen ? openedNavbar : null}
        </div>
        <span
          className={
            store.sidebarIsOpen
              ? "frc absolute l0 b0 t0 br1 mx1"
              : "frc absolute l0 r0 b0 t0 br1 mx1"
          }
        >
          <Icon icon="far fa-calendar" />
        </span>
      </section>
    </>
  );
};

export default CurrentDate;
