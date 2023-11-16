import React, { useContext } from "react";
import { AppStore } from "../../../store/AppContext";

const NoData = ({
  title = "اطلاعاتی برای نمایش وجود ندارد.",
  icon = "fas fa-file",
}) => {
  const [store] = useContext(AppStore);
  return (
    <>
      <div className="w100 fcc bg-white py5">
        <span
          className={`f4 ${store.darkMode ? "text-white" : "text-primary"}`}
        >
          <i className={icon}></i>
        </span>
        <span
          className={`f2 ${store.darkMode ? "text-white" : "text-primary"}`}
        >
          {title}
        </span>
      </div>
    </>
  );
};

export default NoData;
