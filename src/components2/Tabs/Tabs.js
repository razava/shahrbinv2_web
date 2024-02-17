import React, { useEffect, useState } from "react";
import Tab from "./Tab";
import style from "./style.module.css";
import { cn } from "../../utils/functions";

const Tabs = ({
  children = [],
  defaultActiveId,
  onTabChange = (f) => f,
  classNames = { tabs: "", active: "", tab: "", indicator: "" },
  styles = { tabs: {}, tab: {} },
  renderBefore = (f) => f,
  renderAfter = (f) => f,
}) => {
  // states
  const [activeTab, setActiveTab] = useState("");

  // classNames
  const wrapperClassName = [style.tabs, classNames.tabs].join(" ");
  const wrapperStyle = style.tabs;

  // functions
  const onClickTabItem = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  // effects
  useEffect(() => {
    if (children.length > 0) {
      setActiveTab(defaultActiveId ? defaultActiveId : children[0].props.id);
    }
  }, [children.length, defaultActiveId]);

  const renderActiveIndicator = () => {
    const width = 100 / children.length + "%";
    const index = Array.from(children).findIndex(
      (c) => c.props.id === activeTab
    );
    const right = index * (100 / children.length) + "%";
    return (
      <span
        className={cn(style.activeIndicator, classNames.indicator)}
        style={{ width, right }}
      ></span>
    );
  };
  return (
    <>
      <div className={wrapperClassName} style={wrapperStyle}>
        {renderBefore()}
        {children
          .filter((c) => c.props)
          .map((child, i) => {
            const { label, id } = child.props;
            return (
              <Tab
                key={i}
                activeTab={activeTab}
                label={label}
                handleClick={onClickTabItem}
                tabId={id}
                classNames={classNames}
                styles={styles}
              />
            );
          })}
        {renderActiveIndicator()}
        {renderAfter()}
      </div>
      {children
        .filter((c) => c.props)
        .map((child, i) => {
          if (child.props.id !== activeTab) return undefined;
          return child.props.children;
        })}
    </>
  );
};

export default Tabs;
