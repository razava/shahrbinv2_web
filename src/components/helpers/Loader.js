import React, { useContext } from "react";
import { AppStore } from "../../store/AppContext";
import "../../stylesheets/loader.css";

const Loader = ({ absolute = false, className = "", style = {} }) => {
  const [store] = useContext(AppStore);

  return (
    <div className={`overlay ${absolute ? "absolute" : ""}`}>
      <div
        className={[
          "loader",
          store.darkMode ? "text-white" : "text-primary",
          className,
        ].join(" ")}
        style={style}
      ></div>
    </div>
  );
};

export default Loader;
