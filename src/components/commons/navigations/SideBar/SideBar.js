import React, { useContext } from "react";
import CurrentDate from "../../dataDisplay/CurrentDate";
import NavBar from "../NavBar";
import SideBarToggle from "./SideBarToggle";
import styles from "./sidebar.module.css";
import { AppStore } from "../../../../store/AppContext";

const SideBar = () => {
  const [{ sidebarIsOpen }] = useContext(AppStore);
  return (
    <>
      <section
        className={[
          styles.sidebarWrapper,
          sidebarIsOpen ? "" : styles.sidepanelClose,
        ].join(" ")}
      >
        <SideBarToggle />
        <NavBar />
        <CurrentDate />
      </section>
    </>
  );
};

export default SideBar;
