import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { formatLabel, randomColor } from "../../../helperFuncs";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AppStore } from "../../../store/AppContext";

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
}) => {
  const [store] = useContext(AppStore);

  const labels = chartData.series.map((d) => formatLabel(d.title, 30));

  // configs
  const defaultOptions = {
    indexAxis: "y",
    plugins: {
      title: {
        display: true,
        text: "",
      },
      datalabels: {
        display: true,
        color: "#000",
        align: "end",
        anchor: "end",
        offset: 80,
        // rotation: 30,
        font: { size: "12" },
        formatter: function (value, context, index) {
          return value === "0"
            ? ""
            : context.dataset.customLabel[context.dataIndex];
        },
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
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        stacked: false,
        suggestedMax:
          Math.max(
            ...chartData.series.map((l, j) => {
              return Math.max(...l.values.map((v) => v.item2));
            })
          ) * 1.2,
      },
      y: {
        stacked: false,
      },
    },
    barThickness: 20,
  };
  const options = defaultOptions;
  options.plugins.title.text = chartTitle;
  options.indexAxis = isHorizontal ? "y" : "x";

  const data = {
    labels,
    datasets:
      chartData.series.length > 0
        ? chartData.series[0].values.map((value, i) => {
            return {
              label: value.item1,
              data: labels.map((l, j) => {
                return chartData.series[j].values.find(
                  (v) => v.item1 === value.item1
                ).item2;
              }),
              backgroundColor: COLORS[i] || randomColor(),
              customLabel: labels.map((l, j) => {
                return chartData.series[j].values.find(
                  (v) => v.item1 === value.item1
                ).item3;
              }),
            };
          })
        : [],
  };

  console.log(defaultOptions);
  return (
    <>
      <Bar
        options={options}
        data={data}
        width={width}
        height={height}
        style={{}}
      />
    </>
  );
};

export default React.memo(BarChart);
