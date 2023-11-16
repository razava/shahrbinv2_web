import React from "react";
import Badge from "../Badge/Badge";

const TabLabel = ({ tab = {}, activeTab = "" }) => {
  return (
    <span className="frc">
      <span>{tab.title}</span>
      {tab.badge !== undefined && (
        <Badge count={tab.badge} isActive={activeTab === tab.id} />
      )}
    </span>
  );
};

export default TabLabel;
