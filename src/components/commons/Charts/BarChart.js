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
import { formatLabel, randomColor } from "../../../helperFuncs";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AppStore } from "../../../store/AppContext";
import { backgroundColor, borderColor } from "../../../utils/constants";

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
  onClickOnElement = (f) => f,
}) => {
  const [store] = useContext(AppStore);
  const chartRef = useRef();

  const labels =
    chartData.series.length > 0
      ? chartData.series?.[0]?.values.map((d) => formatLabel(d.title, 30))
      : [];

  console.log(chartData);
  // configs
  const defaultOptions = {
    responsive: true,
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
    barPercentage: 0.5,
    scales: {
      x: {
        stacked: false,
        barPercentage: 0.5,
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

  // const data = {
  //   labels,
  //   datasets:
  //     chartData.series.length > 0
  //       ? chartData.series[0].values.map((value, i) => {
  //           return {
  //             label: value.title,
  //             data: labels.map((l, j) => {
  //               return chartData.series[j].values.find(
  //                 (v) => v.title === value.title
  //               ).value;
  //             }),
  //             backgroundColor: COLORS[i] || randomColor(),
  //             customLabel: labels.map((l, j) => {
  //               return chartData.series[j].values.find(
  //                 (v) => v.title === value.title
  //               ).displayValue;
  //             }),
  //           };
  //         })
  //       : [],
  // };

  const data = {
    labels,
    // parameter:
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
              borderWidth: 1,
              borderSkipped: false,
              customLabel: chartData.series[0].values.map((v, j) => {
                return chartData.series?.[i]?.values?.[j]?.displayValue;
              }),
            };
          })
        : [],
  };

  console.log(defaultOptions);

  // functions
  const onClick = (e) => {
    const [element] = getElementAtEvent(chartRef.current, e);
    console.log(getElementAtEvent(chartRef.current, e));
    // console.log(element.index);
    // console.log(element.datasetIndex);
    if (element) {
      const item = chartData?.series?.[0]?.values?.[element.index];
      console.log(item);
      // console.log(chartData?.series[0]);
      // const item2 = data.datasets[element.datasetIndex];
      // const item3 = chartData?.series?.[0].values?.find(
      //   (item) => item.title == data.datasets[element.datasetIndex].label
      // );
      // console.log(item3);
      // console.log(data.datasets[element.datasetIndex]);
      onClickOnElement(item);
    }
  };
  console.log(height);
  const hasW = isHorizontal ? `w-[${width * 20}px]` : "";
  console.log(width);
  return (
    <div
      style={{
        // height: !isHorizontal ? undefined : "",
        width: isHorizontal ? "100%" : width * 8 + "px",
      }}
      className={`${isHorizontal && "h-full"}`}
    >
      <Bar
        options={options}
        data={data}
        // width={width}
        height={isHorizontal ? height : "70%"}
        // style={{ height: "5000px", width: "100%" }}
        // className={` ${isHorizontal ? "w-full" : ""}`}
        // style={{width:"400px"}}
        // style={{}}
        onClick={onClick}
        ref={chartRef}
      />
    </div>
  );
};

export default React.memo(BarChart);
