import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import DatePicker, {
  Calendar,
} from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
// import useClick from "../../";
import TextInput from "../TextInput";
import { fixDigit } from "../../../helperFuncs";
import useResize from "../../hooks/useResize";
import { AppStore } from "../../../store/AppContext";
import useClick from "../../hooks/useClick";

const modalSelectListWrapper =
  document && document.getElementById("modal-selectlist");

const DatePickerConatiner = ({
  date,
  onSelect,
  name,
  title,
  containerClassName = "",
  wrapperClassName = "",
  inputClassName = "",
  labelClassName = "",
  isInDialog,
  id,
}) => {
  const [store, dispatch] = useContext(AppStore);

  const calenderRef = useRef(null);
  const datePickerRef = useRef(null);
  const inputRef = useRef(null);

  const [calender, showCalender] = useClick(calenderRef, "click", [
    datePickerRef,
  ]);
  const [selectedDay, setSelectedDay] = useState(date ? date : null);
  const [style, setStyle] = useState({});

  // window resize hook
  const { windowWidth, windowHeight } = useResize();

  useEffect(() => {
    if (!!onSelect) {
      onSelect(selectedDay, name);
      showCalender(false);
    }
  }, [selectedDay]);

  const clearSelected = () => {
    setSelectedDay(null);
  };

  // functions
  const handleRegular = () => {
    const style = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#000",
      borderRadius: "1em",
      boxShadow: "0 3px 12px rgba(0, 0, 0, 0.2)",
      position: "absolute",
    };
    setStyle(style);
  };

  const handleInDialog = () => {
    const style = {
      position: "fixed",
      zIndex: 10000000,
      backgroundColor: "var(--white)",
      opacity: calender ? 1 : 0,
      // transform: calender ? `translateY(0)` : `translateY(-10px)`,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      overflowY: "auto",
      border: "1px solid var(--light)",
      boxShahdow: "0 0 10px rgba(0,0,0,0.1)",
      borderRadius: 10,
      transition: "opacity 0.3s, transform 0.3s",
    };
    const boundings = inputRef.current.getBoundingClientRect();
    style.top = boundings?.top + boundings?.height;
    style.left = boundings?.left + (boundings?.width - 332) / 2;
    setStyle(style);
  };

  // effects
  useEffect(() => {
    if (isInDialog) {
      handleInDialog();
    } else {
      handleRegular();
    }
    if (calender) {
      dispatch({
        type: "setModals",
        payload: [
          ...store.modals,
          {
            id,
            index: store.modals.length,
          },
        ],
      });
    } else {
      const newModals = store.modals.filter((m) => m.id !== id);
      dispatch({
        type: "setModals",
        payload: newModals,
      });
    }
  }, [calenderRef.current, calender, windowWidth, windowHeight]);

  // renders
  const renderCalendar = () => {
    return (
      <div
        className={`calender ${calender ? "active" : ""}`}
        style={{ display: calender ? "block" : "none" }}
      >
        <div ref={datePickerRef} style={style}>
          <Calendar
            value={selectedDay}
            onChange={setSelectedDay}
            shouldHighlightWeekends
            locale={"fa"}
          />
        </div>
      </div>
    );
  };
  return (
    <>
      <div ref={calenderRef} className={containerClassName}>
        <TextInput
          value={
            selectedDay &&
            fixDigit(
              selectedDay?.year +
                "/" +
                selectedDay?.month +
                "/" +
                selectedDay?.day
            )
          }
          wrapperClassName={wrapperClassName}
          inputClassName={inputClassName}
          labelClassName={labelClassName}
          forwardInputRef={inputRef}
          readOnly={true}
          title={title}
          required={false}
          onClick={() => showCalender(!calender)}
          icon="fas fa-times"
          iconClassName="text-color"
          onIconClick={clearSelected}
        />

        {isInDialog
          ? ReactDOM.createPortal(renderCalendar(), modalSelectListWrapper)
          : renderCalendar()}
      </div>
    </>
  );
};

export default DatePickerConatiner;
