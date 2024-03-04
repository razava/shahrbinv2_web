import React, { useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, getElementAtEvent } from "react-chartjs-2";
import { randomColor } from "../../../helperFuncs";
import { backgroundColor, borderColor } from "../../../utils/constants";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.defaults.font.family = "iranyekan";

const COLORS = [
  "#fbe33f",
  "#70c68e",
  "#f68d46",
  "#90908e",
  "#6bacf4",
  "#2a9d8f",
  "#03071e",
  "#c77dff",
  "#90be6d",
  "#70e000",
];

const PieChart = ({
  chartData,
  chartTitle,
  width,
  height,
  radius,
  onClickOnElement = (f) => f,
}) => {
  const chartRef = useRef();

  const options = {
    plugins: {
      title: {
        text: chartTitle,
        display: true,
      },
      datalabels: {
        display: true,
        color: "white",
        align: "center",
        anchor: "center",
        font: { size: "12" },
      },
      legend: {
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 14,
            family: "iranyekan",
          },
        },
      },
    },
    radius,
    responsive: true,
    maintainAspectRatio: false,
  };

  const series = chartData.series[0];

  const labels = series.values.map((d) => d.title);
  const data = {
    labels,
    datasets:
      chartData.series.length > 0
        ? chartData.series.map((s, i) => {
            return {
              label: chartData.series[0].values.map((v, j) => {
                return v.title;
              }),
              data: chartData.series[0].values.map((v, j) => {
                return chartData.series?.[i]?.values?.[j]?.value;
              }),
              backgroundColor:
                series.values.length > borderColor.length
                  ? [
                      ...borderColor,
                      ...[
                        ...Array(series.values.length - borderColor.length),
                      ].map((c) => randomColor()),
                    ]
                  : borderColor,
              // borderColor: NAMED_COLORS[i] || randomColor(),
              // borderWidth: 1,
              // borderSkipped: false,
              customLabel: "3",
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
    <>
      <Pie
        data={data}
        options={options}
        width={width}
        height={height}
        onClick={onClick}
        ref={chartRef}
      />
    </>
  );
};

export default PieChart;
