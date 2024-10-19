import React, { useContext, useRef } from "react";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AppStore } from "../../../store/AppContext";
import { formatLabel, randomColor } from "../../../helperFuncs";
import { backgroundColor, borderColor } from "../../../utils/constants";

// ثبت کردن اجزای چارت
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);
ChartJS.defaults.font.family = "iranyekan";

const BarChart = ({
  chartData = [],
  chartTitle,
  isHorizontal = true,
  height,
  width,
  onClickOnElement = () => {},
}) => {
  const [store] = useContext(AppStore);
  const chartRef = useRef();

  // تولید برچسب‌ها (Labels)
  const labels =
    chartData.series.length > 0
      ? chartData.series[0].values.map((d) => formatLabel(d.title, 30))
      : [];

  // تابع برای تولید dataset
  const generateDataSet = () => {
    return chartData.series.length > 0
      ? chartData.series.map((series, i) => ({
          label: series.title,
          data: series.values.map((v) => v.value),
          backgroundColor: backgroundColor[i] || randomColor(),
          borderColor: borderColor[i] || borderColor[i % 30],
          borderWidth: 1,
          customLabel: series.values.map((v) => v.displayValue),
        }))
      : [];
  };

  const data = {
    labels,
    datasets: generateDataSet(),
  };

  // تنظیمات چارت
  const defaultOptions = {
    responsive: true,
    indexAxis: isHorizontal ? "y" : "x",
    plugins: {
      title: {
        display: !!chartTitle,
        text: chartTitle,
      },
      datalabels: {
        display: true,
        color: "#000",
        align: "end",
        anchor: "end",
        offset: 80,
        font: { size: 12 },
        formatter: (value, context) =>
          value === "0" ? "" : context.dataset.customLabel[context.dataIndex],
      },
      legend: {
        labels: {
          font: {
            size: 14,
            family: "iranyekan",
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        suggestedMax: Math.max(...chartData.series.flatMap((s) => s.values.map((v) => v.value))) * 1.2,
      },
      y: {
        stacked: false,
      },
    },
    barPercentage: 0.5,
    maintainAspectRatio: false,
    barThickness: 20,
  };

  // مدیریت کلیک روی عنصر چارت
  const onClick = (event) => {
    const [element] = getElementAtEvent(chartRef.current, event);
    if (element) {
      const item = chartData.series[0].values[element.index];
      onClickOnElement(item);
    }
  };

  return (
    <div
      style={{
        height: isHorizontal ? `${height}px` : "100%",
        width: isHorizontal ? "100%" : `${width}px`,
        minHeight: "100%",
        minWidth: "100%",
      }}
    >
      <Bar
        options={defaultOptions}
        data={data}
        onClick={onClick}
        ref={chartRef}
      />
    </div>
  );
};

export default React.memo(BarChart);
