import React from "react";
import { elementTypes, formElements } from "./constants";
import styles from "./styles.module.css";
import ToolItem from "./ToolItem";
import Tabs from "../Tabs/Tabs";
import Icon from "../Icon/Icon";

const Tools = () => {
  return (
    <>
      <aside className={styles.tools}>
        <Tabs
          classNames={{
            tabs: styles.toolTabs,
            tab: styles.toolTab,
            active: styles.toolActiveTab,
          }}
        >
          {elementTypes.map((elementType) => (
            <div
              key={elementType.id}
              id={elementType.id}
              label={
                <span className={styles.toolTabLabel}>
                  <Icon
                    name={elementType.icon}
                    style={{ color: elementType.color }}
                  />
                  <span>{elementType.title}</span>
                </span>
              }
            >
              <div className={styles.toolItems}>
                {elementType.elements.map((tool) => (
                  <ToolItem key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </Tabs>
      </aside>
    </>
  );
};

export default Tools;
