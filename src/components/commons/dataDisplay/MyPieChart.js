import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { fixDigit } from "../../../helperFuncs";

const COLORS = ["#0088FE", "#352e47", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;
const renderLegend = (value, entry, index) => {
  return entry.value;
};

const MyPieChart = ({ width = 400, height = 400, data = [], title = "" }) => {
  return (
    <div className="">
      <div className="w90 mxa frc flex my-3 gradient-title">
        <span className="f3">{title}</span>
      </div>
      <ResponsiveContainer
        className="mypiechart"
        width="100%"
        maxWidth={width}
        height={height}
      >
        <PieChart width={width} height={height}>
          {data.map((pie, i) => (
            <Pie
              dataKey={"value"}
              nameKey={"name"}
              key={i}
              data={pie}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              fill={COLORS[i]}
              label={({ value }) => value}
              labelLine={true}
            >
              {pie.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          ))}
          <Tooltip
            formatter={(value, name, props) => [`${name}: ${fixDigit(value)}`]}
          />
          <Legend formatter={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyPieChart;
