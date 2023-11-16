import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { mapUrlToNav } from "../../../../helperFuncs";
import styles from "./sidebar.module.css";
import { AppStore } from "../../../../store/AppContext";

const startMobileWisth = 768;

const SideLink = ({
  title = "",
  handle,
  icon = "",
  hasSubList = false,
  children,
  justIcon = false,
}) => {
  const [store, dispatch] = useContext(AppStore);

  const [isChecked, setChecked] = useState(false);
  const location = useLocation();

  const isActive = mapUrlToNav(location, "/admin")[handle];
  const link = `/admin/${handle}`;

  const toggleLinkHandler = (e) => {
    if (!hasSubList) return;
    setChecked(!isChecked);
  };

  const onLinkClick = () => {
    if (link === location.pathname) {
      dispatch({
        type: "setRefreshPage",
        payload: { page: link, call: store.refresh.call + 1 },
      });
    }
    if (startMobileWisth > window.innerWidth) {
      dispatch({ type: "setSideBar", payload: false });
    }
  };

  const regularLink = (
    <Link
      to={link}
      onClick={onLinkClick}
      className={styles.sidepanel__listLinks}
    >
      <li
        className={[
          hasSubList
            ? styles.sidepanel__listItem_noHover
            : styles.sidepanel__listItem,
          styles.hasSubList,
          isActive ? styles.activeItem : "",
        ].join(" ")}
      >
        <div className={[styles.toggleLink].join(" ")}>
          <span className={[styles.sidepanel__itemIcon].join(" ")}>
            <i className={icon}></i>
          </span>
          <span className={styles.sidepanel__itemName}>{title}</span>
        </div>
      </li>
    </Link>
  );

  const ListLink = (
    <li
      className={[
        hasSubList
          ? styles.sidepanel__listItem_noHover
          : styles.sidepanel__listItem,
        styles.hasSubList,
      ].join(" ")}
    >
      <div
        className={[styles.toggleLink, isActive ? styles.active : ""].join(" ")}
        onClick={toggleLinkHandler}
      >
        <div>
          <span className={styles.sidepanel__itemIcon}>
            <i className={icon}></i>
          </span>
          <span className={styles.sidepanel__itemName}>{title}</span>
        </div>
        <div>
          <span className={styles.sidepanel__itemIcon}>
            <i
              className={
                hasSubList
                  ? isChecked
                    ? "fas fa-minus"
                    : "fas fa-plus"
                  : "fas fa-angle-left"
              }
            ></i>
          </span>
        </div>
      </div>
      <ul
        className={[styles.subList, isChecked ? styles.sublistShow : ""].join(
          " "
        )}
      >
        {children}
      </ul>
    </li>
  );

  const iconLink = (
    <li className={[styles.icon, styles.center].join(" ")} title={title}>
      <Link className="w100 h100 frc" to={link} onClick={onLinkClick}>
        <span
          className={[
            styles.sidepanel__itemIcon,
            mapUrlToNav(location, "/admin")[handle] ? styles.activeIcon : "",
          ].join(" ")}
        >
          <i className={icon}></i>
        </span>
      </Link>
    </li>
  );

  return justIcon ? iconLink : hasSubList ? ListLink : regularLink;
};

SideLink.propTypes = {
  title: PropTypes.string,
  handle: PropTypes.string,
  icon: PropTypes.string,
  hasSubList: PropTypes.bool,
  children: PropTypes.instanceOf(Array),
};

export default SideLink;
