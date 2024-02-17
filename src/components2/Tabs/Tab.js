import React from "react";
import styles from "./style.module.css";

const Tab = ({ activeTab, label, handleClick, tabId, classNames, styles }) => {
  // classNames
  const tabClassName = [
    styles.tab,
    classNames.tab,
    activeTab === tabId ? classNames.active : "",
  ].join(" ");
  const tabStyle = styles.tab;

  // functions
  const onClick = () => {
    handleClick(tabId);
  };
  return (
    <button
      type="button"
      style={tabStyle}
      className={tabClassName}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Tab;
