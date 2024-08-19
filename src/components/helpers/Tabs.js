import React, { useEffect, useState } from "react";
import Tab from "./Tab";
import "../../stylesheets/tabs.css";

const Tabs = ({
  children,
  mainClass,
  activeClass,
  changes = [],
  setChanges = (f) => f,
  defaultActiveId,
  onTabChange = (f) => f,
  wrapperClassName = "",
  contentClassName = "",
}) => {
  const [activeTab, setActiveTab] = useState("");
  const onClickTabItem = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
    if (changes && changes.accidentId === tab) {
      setChanges(null);
    }
  };

  useEffect(() => {
    setActiveTab(defaultActiveId ? defaultActiveId : children[0].props.id);
  }, [children.length, defaultActiveId]);
  
  return (
    <>
      <div className={`${mainClass}s ${wrapperClassName}`}>
        {children
          .filter((c) => c?.props)
          .map((child, i) => {
            const { label, id } = child.props;
            return (
              <Tab
                activeTab={activeTab}
                key={i}
                label={label}
                handleClick={onClickTabItem}
                mainClass={mainClass}
                activeClass={activeClass}
                tabId={id}
                hasNew={changes && changes.accidentId === id}
              />
            );
          })}
      </div>
      <div className={`${mainClass}s-content ${contentClassName}`}>
        {children
          .filter((c) => c?.props)
          .map((child, i) => {
            if (child.props.id !== activeTab) return undefined;
            return child.props.children;
          })}
      </div>
    </>
  );
};

export default Tabs;
