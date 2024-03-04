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
  Legend
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
  ...[...Array(1000)].map((c) => randomColor()),
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
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "",
      },
      datalabels: {
        display: true,
        color: "#000",
        align: "end",
        anchor: "end",
        offset: 0,
        // rotation: 30,
        font: { size: "12" },
        formatter: function (value, context, index) {
          return value === "0"
            ? ""
            : context.dataset.customLabel[context.dataIndex];
        },
      },
    },
  };
  const options = defaultOptions;
  options.plugins.title.text = chartTitle;
  options.indexAxis = isHorizontal ? "y" : "x";

  const data = {
    labels,
    datasets:
      chartData.series.length > 0
        ? chartData.series.map((s, i) => {
            return {
              label: s.title,
              data: chartData.series[0].values.map((v, j) => {
                return chartData.series?.[i]?.values?.[j]?.value;
              }),
              backgroundColor: backgroundColor[i] || backgroundColor[i % 30],
              borderColor: borderColor[i] || borderColor[i % 30],
              customLabel: chartData.series[0].values.map((v, j) => {
                return chartData.series?.[i]?.values?.[j]?.displayValue;
              }),
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
      options={options}
      data={data}
      width={width}
      height={height}
      onClick={onClick}
      ref={chartRef}
    />
  );
};

export default LineChart;
