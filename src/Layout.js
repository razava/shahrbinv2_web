import React, { useContext } from "react";
import { AppStore } from "./store/AppContext";
import styles from "./stylesheets/layout.module.css";

const Layout = ({ children }) => {
  const [{ sidebarIsOpen }] = useContext(AppStore);
  return (
    <div
      id="layout"
      className={[styles.page, sidebarIsOpen ? "" : styles.close].join(" ")}
    >
      {children}
    </div>
  );
};

export default Layout;
