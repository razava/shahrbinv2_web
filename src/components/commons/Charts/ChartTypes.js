import React from "react";
// import Icon from "../../components/Icon/Icon";
// import { cn } from "../../utils/functions";
import styles from "./styles.module.css";
import Icon from "../../../components2/Icon/Icon";
import { cn } from "../../../utils/functions";

const chartTypeOptions = [
  {
    id: "pie-chart",
    title: "نمودار دایره‌ای",
    value: "pieCharts",
    icon: "fas fa-chart-pie",
    isHorizontal: false,
  },
  {
    id: "bar-chart-vertical",
    title: "نمودار میله‌ای - عمودی",
    value: "barCharts",
    icon: "fas fa-chart-bar",
    isHorizontal: false,
  },
  {
    id: "bar-chart-horizontal",
    title: "نمودار میله‌ای - افقی",
    value: "barCharts2",
    icon: "fas-solid fa-chart-bar",
    isHorizontal: true,
  },
  {
    id: "line-chart",
    title: "نمودار خطی",
    value: "lineCharts",
    icon: "fas fa-chart-line",
    isHorizontal: false,
  },
];

const ChartTypes = ({
  selected = {},
  isHorizontal,
  onSelectChartType = (f) => f,
}) => {
  // variables
  const selectedChartType =
    chartTypeOptions.find((c) => c.value === selected) || {};
  return (
    <>
      <div className={styles.chartTypes}>
        {chartTypeOptions.map((option) => (
          <Icon
            key={option.id}
            onClick={() => onSelectChartType(option)}
            name={option.icon}
            classNames={{
              icon: cn(
                styles.chartType,
                selectedChartType.id === option.id ? styles.active : "",
                option.value == "barCharts" && "rotate-90"
              ),
            }}
            size={"50px"}
          />
        ))}
      </div>
    </>
  );
};

export default ChartTypes;
