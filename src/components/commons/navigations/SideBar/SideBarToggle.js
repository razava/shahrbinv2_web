import React, { useContext, useState } from "react";
import { AppStore } from "../../../../store/AppContext";
import Icon from "../../../helpers/Icon/Icon";
import styles from "./sidebar.module.css";

const SideBarToggle = () => {
  // store
  const [store, dispatch] = useContext(AppStore);

  // flags
  const [openVisible, setOpenVisible] = useState(true);
  const [closeVisible, setCloseVisible] = useState(false);

  // functions
  const toggleNavbar = (e) => {
    dispatch({ type: "setSideBar", payload: !store.sidebarIsOpen });
  };

  // opened toggle ui
  const openedNavbar = (
    <>
      <span className="w100 frc wrap ml1">
        <Icon icon="fas fa-users-cog" />
        <span className={styles.appTitle}>پنل مدیریت</span>
      </span>
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
          styles.sideBarToggle,
          store.sidebarIsOpen ? "" : styles.sidepanelClose,
        ].join(" ")}
        onTransitionEnd={onTransitionEnd}
      >
        <span
          className={
            store.sidebarIsOpen
              ? "frc absolute l0 b0 t0 br1"
              : "frc absolute l0 r0 b0 t0 br1"
          }
        >
          <Toggle onClick={toggleNavbar} open={store.sidebarIsOpen} />
        </span>
        <div
          className={[
            styles.sidebarToggleContent,
            closeVisible ? "" : styles.hide,
          ].join(" ")}
        >
          {store.sidebarIsOpen ? openedNavbar : null}
        </div>
      </section>
    </>
  );
};

export default SideBarToggle;

const Toggle = ({ onClick = (f) => f, open = false }) => {
  return (
    <span
      className={[styles.bars, open ? styles.close : ""].join(" ")}
      onClick={onClick}
    >
      <span className={[styles.bar, styles.bar1].join(" ")}></span>
      <span className={[styles.bar, styles.bar2].join(" ")}></span>
      <span className={[styles.bar, styles.bar3].join(" ")}></span>
    </span>
  );
};
