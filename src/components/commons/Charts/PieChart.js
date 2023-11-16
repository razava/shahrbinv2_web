import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { randomColor } from "../../../helperFuncs";

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

const PieChart = ({ chartData, chartTitle, width, height, radius }) => {
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

  const labels = series.values.map((d) => d.item1);
  const data = {
    labels,
    datasets:
      chartData.series.length > 0
        ? [
            {
              //   label: series.values.item1,
              data: series.values.map((v) => v.item2),
              backgroundColor:
                series.values.length > COLORS.length
                  ? [
                      ...COLORS,
                      ...Array(series.values.length - COLORS.length).map((c) =>
                        randomColor()
                      ),
                    ]
                  : COLORS,
            },
          ]
        : [],
  };

  return (
    <>
      <Pie data={data} options={options} width={width} height={height} />
    </>
  );
};

export default PieChart;
