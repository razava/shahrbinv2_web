import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getElementAtEvent, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels"; // اضافه کردن پلاگین
import { formatLabel } from "../../../utils/functions";
import { randomColor } from "../../../helperFuncs";
import { backgroundColor, borderColor } from "../../../utils/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // ثبت پلاگین
);

ChartJS.defaults.font.family = "iranyekan";

const COLORS = [
  "#FFB1C1",
  "#9AD0F5",
  "#FFD062",
  "#A5DFDF",
  "#9AD0F5",
  "#CCB2FF",
  "#E4E5E7",
  ...[...Array(1000)].map(() => randomColor()),
];

const LineChart = ({
  chartTitle = "",
  chartData = {},
  isHorizontal,
  width,
  height,
  onClickOnElement = (f) => f,
}) => {
  // refs
  const chartRef = useRef();

  // variables
  const labels =
    chartData.series.length > 0
      ? chartData.series?.[0]?.values.map((d) => formatLabel(d.title, 30))
      : [];

  const defaultOptions = {
    indexAxis: isHorizontal ? "y" : "x", // جابجایی محور‌ها بر اساس isHorizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: chartTitle,
      },
      datalabels: {
        display: true, // مطمئن شوید که فعال است
        color: "#000",
        align: "end",
        anchor: "end",
        offset: 0,
        font: { size: "12" },
        formatter: function (value, context) {
          const displayValue =
            context.dataset.customLabel[context.dataIndex];
          return value !== 0 ? displayValue : ""; // اگر مقدار صفر نیست، نمایش بده
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.dataset.customLabel[context.dataIndex];
            return value ? `Value: ${value}` : '';
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false, // عدم پرش برچسب‌ها
          maxRotation: 45, // حداکثر چرخش برچسب‌ها
          minRotation: 0,
        },
      },
      y: {
        ticks: {
          autoSkip: false, // عدم پرش برچسب‌ها روی محور y
        },
      },
    },
  };

  const data = {
    labels,
    datasets:
      chartData.series.length > 0
        ? chartData.series.map((s, i) => {
            return {
              label: s.title,
              data: s.values.map((v) => v.value),
              backgroundColor: backgroundColor[i] || backgroundColor[i % 30],
              borderColor: borderColor[i] || borderColor[i % 30],
              customLabel: s.values.map((v) => v.displayValue),
            };
          })
        : [],
  };

  // functions
  const onClick = (e) => {
    const [element] = getElementAtEvent(chartRef.current, e);
    if (element) {
      const item = chartData?.series?.[0]?.values?.[element.index];
      onClickOnElement(item);
    }
  };

  return (
    <Line
      options={defaultOptions}
      data={data}
      width={width}
      height={height}
      onClick={onClick}
      ref={chartRef}
    />
  );
};

export default LineChart;
