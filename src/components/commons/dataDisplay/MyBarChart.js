import React from "react";
import { Bar, LabelList, Legend } from "recharts";
import { XAxis } from "recharts";
import { YAxis } from "recharts";
import { BarChart } from "recharts";
import { Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#0088FE", "#352e47", "#FFBB28", "#FF8042"];
const renderLegend = (props) => {
  const { payload } = props;
  return (
    <ul>
      {payload.map((entry, index) => (
        <li key={`item-${index}`}>{entry.value}</li>
      ))}
    </ul>
  );
};

const CustomYAxisTick = (props) => {
  const { x, y, payload } = props;
  return (
    <text x={x} y={y} textAnchor="start" fill="#666">
      {payload.value}
    </text>
  );
};

const renderCustomizedLabel = (props, data) => {
  const { x, y, width, height, value, name } = props;
  const radius = 10;

  const total = data.find(d => d.name === name)['کل'] || 1;

  return (
    <g>
      {/* <circle cx={x + width / 2} cy={y} r={radius} fill="#8884d8" /> */}
      <text
        x={x + width / 2}
        y={y + radius / 2}
        fill="var(--white)"
        textAnchor="middle"
        z={2}
        dominantBaseline="middle"
      >
        {((value / total) * 100).toFixed(0) + '%'}
      </text>
    </g>
  );
};

const MyBarChart = ({
  width = 400,
  height = 400,
  data = [],
  title = "",
  className = "",
  isStacked,
  isHorizontal,
}) => {
  return (
    <div className={`${className}`}>
      <div className="w90 mxa frc flex my-3 gradient-title">
        <span className="f3 ">{title}</span>
      </div>
      <ResponsiveContainer
        width="100%"
        className={"mybarchart"}
        maxWidth={width}
        height={height}
      >
        <BarChart
          width={width}
          data={data}
          barSize={30}
          layout={isHorizontal ? "horizontal" : "vertical"}
        >
          {data.length > 0 &&
            Object.keys(data[0])
              .filter((d) => d !== "name" && d !== "کل")
              .map((d, i) => {
                return (
                  <Bar
                    key={i}
                    dataKey={d}
                    fill={COLORS[i]}
                    stackId={isStacked ? "stackId" : undefined}
                    // label={true}
                  >
                    <LabelList dataKey={d} content={(props) => renderCustomizedLabel(props, data)} />
                  </Bar>
                );
              })}
          <Legend
            payload={
              data.length > 0 &&
              Object.keys(data[0])
                .filter((d) => d !== "name" && d !== "کل")
                .map((d, j) => {
                  return { value: d, id: "ID" + j, color: COLORS[j] };
                })
            }
          />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey={"name"}
            width={150}
            tick={<CustomYAxisTick />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyBarChart;
