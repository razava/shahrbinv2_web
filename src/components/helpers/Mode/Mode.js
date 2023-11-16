import React, { useContext, useEffect, useState } from "react";
import { constants, saveToLocalStorage } from "../../../helperFuncs";
import { AppStore } from "../../../store/AppContext";

const Mode = () => {
  const [store, dispatch] = useContext(AppStore);

  const [dark, setDark] = useState(store.darkMode);

  const toggleMode = () => {
    if (dark) {
      dispatch({ type: "setMode", payload: false });
      saveToLocalStorage(constants.SHAHRBIN_MODE, false);
      handleRootClassNames(false);
      handleModalRootClassNames(false);
    } else {
      dispatch({ type: "setMode", payload: true });
      saveToLocalStorage(constants.SHAHRBIN_MODE, true);
      handleRootClassNames(true);
      handleModalRootClassNames(true);
    }
    setDark(!dark);
  };

  const handleRootClassNames = (dark) => {
    if (dark) {
      document.getElementById("root").classList.add("darkTheme");
      document.getElementById("root").classList.remove("lightTheme");
    } else {
      document.getElementById("root").classList.remove("darkTheme");
      document.getElementById("root").classList.add("lightTheme");
    }
  };

  const handleModalRootClassNames = (dark) => {
    if (dark) {
      document.getElementById("modal-root").classList.add("darkTheme");
      document.getElementById("modal-root").classList.remove("lightTheme");
    } else {
      document.getElementById("modal-root").classList.remove("darkTheme");
      document.getElementById("modal-root").classList.add("lightTheme");
    }
  };

  useEffect(() => {
    if (dark) {
      handleRootClassNames(true);
      handleModalRootClassNames(true);
    } else {
      handleRootClassNames(false);
      handleModalRootClassNames(false);
    }
  }, [dark]);
  return (
    <>
      <section id="modes" className="modes">
        <section
          id="day"
          className={`light ${dark ? "light-off" : "light-on"}`}
          onClick={toggleMode}
        >
          <div className="sun"></div>
        </section>
        <section
          id="night"
          className={`dark ${dark ? "dark-on" : "dark-off"}`}
          onClick={toggleMode}
        >
          <div className="moon"></div>
        </section>

        <section className={dark ? "cloud-off" : "cloud-on"}>
          <div className="cloud">
            <div className="cloud-1"></div>
            <div className="cloud-2"></div>
            <div className="cloud-3"></div>
          </div>
        </section>

        <section className={dark ? "stars-on" : "stars-off"}>
          {[...Array(40)].map((star, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: Math.floor(Math.random() * 50),
                left: Math.floor(Math.random() * 50),
                width: 1,
                height: 1,
              }}
            ></div>
          ))}
        </section>
      </section>
    </>
  );
};

export default Mode;
