import React, { useContext, useEffect, useState } from "react";
import { constants, getFromLocalStorage, hasRole } from "../../../helperFuncs";
import styles from "./SideBar/sidebar.module.css";
import SideLink from "./SideBar/SideLink";
import { links } from "./SideBar/constants";
import { AppStore } from "../../../store/AppContext";

const NavBar = () => {
  // context
  const [{ sidebarIsOpen }] = useContext(AppStore);

  // flags
  const [openVisible, setOpenVisible] = useState(true);
  const [closeVisible, setCloseVisible] = useState(false);

  const userRoles = getFromLocalStorage(
    constants.SHAHRBIN_MANAGEMENT_USER_ROLES
  ) || [];

  // opened navbar ui
  const openedNavbar = (
    <>
      <div className={styles.sidepanel__list}>
        <ul className={styles.sidepanel__listItems}>
          {links
            .sort((a, b) => (a.order > b.order ? 1 : -1))
            .map((link, i) =>
              hasRole(userRoles, link.roles) ? (
                <SideLink
                  key={link.id}
                  title={link.title}
                  handle={link.path}
                  icon={link.icon}
                />
              ) : null
            )}
        </ul>
      </div>
    </>
  );

  // closed navbar ui
  const closedNavbar = (
    <>
      <ul className={styles.icons__list}>
        {links
          .sort((a, b) => (a.order > b.order ? 1 : -1))
          .map((link, i) =>
            hasRole(userRoles, link.roles) ? (
              <SideLink
                key={link.id}
                title={link.title}
                handle={link.path}
                icon={link.icon}
                justIcon
              />
            ) : null
          )}
      </ul>
    </>
  );

  const onTransitionEnd = (e) => {
    if (sidebarIsOpen) {
      setCloseVisible(true);
      setOpenVisible(false);
    } else {
      setOpenVisible(true);
      setCloseVisible(false);
    }
  };

  return (
    <div
      className={[
        styles.page__sidepanel,
        sidebarIsOpen ? "" : styles.sidepanelClose,
      ].join(" ")}
      onTransitionEnd={onTransitionEnd}
    >
      <div
        className={[
          styles.sidepanel__lists,
          openVisible ? "" : styles.hide,
        ].join(" ")}
      >
        {sidebarIsOpen ? null : closedNavbar}
      </div>

      <div
        className={[
          styles.sidepanel__lists,
          closeVisible ? "" : styles.hide,
        ].join(" ")}
      >
        {sidebarIsOpen ? openedNavbar : null}
      </div>
    </div>
  );
};

export default NavBar;
