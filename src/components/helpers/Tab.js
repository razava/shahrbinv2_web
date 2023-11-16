import React from "react";

const Tab = ({
  activeTab,
  label,
  handleClick,
  mainClass,
  activeClass,
  tabId,
  hasNew = false,
}) => {
  const onClick = () => {
    handleClick(tabId);
  };
  return (
    <button
      type="button"
      className={[
        mainClass,
        activeTab === tabId ? activeClass : "",
        hasNew ? "winking" : "",
      ].join(" ")}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Tab;
