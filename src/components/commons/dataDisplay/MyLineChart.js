import React from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { convertNthDatetoActualDate, fixDigit } from "./helperFunctions";

const MyLineChart = ({
  data = [],
  width = 400,
  height = 400,
  strokeDasharray = "3 3",
  dataKeys = [],
  strokes = [],
  title = "",
}) => {
  return (
    <div className="mylinechart">
      <div className="flex">
        <span className="title my1">{title}</span>
      </div>
      <ResponsiveContainer width="100%" maxWidth={width} height={height}>
        <LineChart data={data} maxBarSize={width}>
          <CartesianGrid strokeDasharray={strokeDasharray} />
          <XAxis dataKey={"name"} />
          <YAxis />
          <Tooltip
            formatter={(value, name, props) => [
              fixDigit(props.payload.item2) +
                " :" +
                convertNthDatetoActualDate(props.payload.item1),
            ]}
          />
          {dataKeys.map((dataKey, i) => (
            <Line
              type="monotone"
              key={i}
              dataKey={dataKey}
              stroke={strokes[i]}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyLineChart;
