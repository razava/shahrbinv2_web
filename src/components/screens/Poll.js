import React, { useEffect, useState } from "react";
import { PollAPI } from "../../apiCalls";
import { serverError, unKnownError } from "../../helperFuncs";
import MyPieChart from "../commons/dataDisplay/MyPieChart";
import Loader from "../helpers/Loader";
import Title from "../helpers/Title";
import useMakeRequest from "../hooks/useMakeRequest";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import ChartTypes from "../commons/Charts/ChartTypes";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import PieChart from "../commons/Charts/PieChart";
import LineChart from "../commons/Charts/LineChart";
import BarChart from "../commons/Charts/BarChart";
import useResize from "../hooks/useResize";
import widgetStyle from "../../stylesheets/infowidget.module.css";
import ReportCard from "../commons/dataDisplay/ReportCard";

const Poll = ({ match }) => {
  const [pollId, setPollId] = useState(null);
  const [chartType, setChartType] = useState("barCharts");
  const { windowWidth, windowHeight } = useResize();

  useEffect(() => {
    if (match.params.id) {
      setPollId(match.params.id);
    }
  }, [match.params]);

  const [data, loading] = useMakeRequest(
    PollAPI.getPollResults,
    200,
    pollId,
    null,
    (res) => {
      if (res.status === 200) return;
      else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    },
    pollId
  );

  const formatPieData = (data) => {
    const formatted = data.series.map((s, i) => {
      return s.values.map((v) => {
        return {
          value: parseFloat(v.item2),
          name: v.item1,
        };
      });
    });

    return formatted;
  };

  const onSelectChartType = (chartType) => {
    // setLoading(true);
    console.log(chartType);
    setChartType(chartType.value);
    // setIsHorizontal(chartType.isHorizontal);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 300);
  };

  console.log(data);
  const renderTableHeader = () => {
    return (
      <>
        {/* <TableHeaderAction
          title="تعریف دسته‌بندی (شکایات)"
          icon="fas fa-stream"
          onClick={() => setAddCategoryDialog(true)}
        /> */}
        <div></div>
        <div className=" flex items-center ml-3">
          {data?.charts?.length > 0 && (
            <ChartTypes
              selected={chartType}
              // isHorizontal={isHorizontal}
              onSelectChartType={onSelectChartType}
            />
          )}
        </div>
      </>
    );
  };
  return (
    <>
      {loading && <Loader />}
      <TableHeader renderHeader={renderTableHeader} />
      <LayoutScrollable clipped={(window.innerHeight * 3) / 48 + 10}>
        <section className="w100 mxa bg-white br1 overflow-auto h-full px-1">
          <div className={widgetStyle.infowidgets}>
            {data?.singletons &&
              data?.singletons.map((s, i) => (
                <ReportCard
                  key={`reportcard-${i}`}
                  title={s.title}
                  value={s.value}
                />
              ))}
          </div>
          {data?.charts?.length > 0 && chartType == "lineCharts" && (
            <>
              {data?.charts?.map((lineChartData, i) => {
                return (
                  <LineChart
                    key={`piechart-${i}`}
                    chartData={lineChartData}
                    chartTitle={lineChartData.chartTitle}
                    height={(windowHeight * 37) / 48 - 20}
                    width={"100%"}
                    radius={((windowHeight * 37) / 48 - 120) / 2}
                    // onClickOnElement={onClickOnElement}
                  />
                );
              })}
            </>
          )}
          {data?.charts?.length > 0 && chartType == "pieCharts" && (
            <>
              {data?.charts?.map((pieChartData, i) => {
                return (
                  <PieChart
                    key={`piechart-${i}`}
                    chartData={pieChartData}
                    chartTitle={pieChartData.chartTitle}
                    height={(windowHeight * 37) / 48 - 20}
                    width={"100%"}
                    radius={((windowHeight * 37) / 48 - 120) / 2}
                    // onClickOnElement={onClickOnElement}
                  />
                );
              })}
            </>
          )}
          {data?.charts?.length > 0 &&
            chartType == "barCharts" &&
            data?.charts?.map((barChartData, i) => {
              const isHorizontal = true;
              const barThickness = 5;
              const seriesCount = barChartData.series.length;
              const barChartItemHeight = seriesCount * barThickness;
              const margin = 10;
              const groupsCount = barChartData.series?.[0]?.values?.length || 0;
              const bottomSpace = 60;
              const topSpace = (seriesCount / 4 + 1) * margin;
              const horizontalHeight = (20 * window.innerHeight) / 24 - 120;

              const barChartHeight = !isHorizontal
                ? horizontalHeight
                : groupsCount * barChartItemHeight +
                  bottomSpace +
                  topSpace +
                  margin * groupsCount;

              const barChartWidth = !isHorizontal
                ? groupsCount * barChartItemHeight +
                  bottomSpace +
                  topSpace +
                  margin * groupsCount
                : "100%";
              console.log(barChartWidth);
              console.log(barChartData.series[0].values.length);
              const numOfGroups = barChartData.series[0].values.length;
              const numOfColumns = barChartData.series.length;
              const a = barThickness * numOfGroups * numOfColumns + 50;
              return (
                <BarChart
                  key={`barchart-${i}`}
                  chartTitle={barChartData.chartTitle}
                  chartData={barChartData}
                  height={a}
                  width={barChartWidth}
                  isHorizontal={true}
                  // onClickOnElement={onClickOnElement}
                />
              );
            })}
          {data?.charts?.length > 0 &&
            chartType == "barCharts2" &&
            data?.charts?.map((barChartData, i) => {
              const isHorizontal = false;
              const barThickness = 5;
              const seriesCount = barChartData.series.length;
              const barChartItemHeight = seriesCount * barThickness;
              const margin = 10;
              const groupsCount = barChartData.series?.[0]?.values?.length || 0;
              const bottomSpace = 60;
              const topSpace = (seriesCount / 4 + 1) * margin;
              const horizontalHeight = (20 * window.innerHeight) / 24 - 120;

              const barChartHeight = !isHorizontal
                ? horizontalHeight
                : groupsCount * barChartItemHeight +
                  bottomSpace +
                  topSpace +
                  margin * groupsCount;

              const barChartWidth = !isHorizontal
                ? groupsCount * barChartItemHeight +
                  bottomSpace +
                  topSpace +
                  margin * groupsCount
                : "100%";
              console.log(barChartWidth);
              console.log(barChartData.series[0].values.length);
              const numOfGroups = barChartData.series[0].values.length;
              const numOfColumns = barChartData.series.length;
              const a = barThickness * numOfGroups * numOfColumns + 50;
              return (
                <BarChart
                  key={`barchart-${i}`}
                  chartTitle={barChartData.chartTitle}
                  chartData={barChartData}
                  height={(20 * window.innerHeight) / 24 - 120}
                  width={a}
                  isHorizontal={false}
                  // onClickOnElement={onClickOnElement}
                />
              );
            })}
        </section>
      </LayoutScrollable>

      {/* <Title title="نتایج نظرسنجی" size={1} /> */}
      {/* {data.pollChoicesResults && (
        <MyPieChart
          data={[
            data.pollChoicesResults.map((value) => {
              return {
                name: value.shortTitle,
                value: value.percentage,
              };
            }),
          ]}
          title={"نمودار فروانی پاسخ های نظرسنجی"}
          height={400}
        />
      )} */}
    </>
  );
};

export default Poll;
