import React, { useContext, useEffect, useState } from "react";
import { InfoAPI, ReportsAPI } from "../../apiCalls";
import widgetStyle from "../../stylesheets/infowidget.module.css";
import ReportCard from "../commons/dataDisplay/ReportCard";
import Loader from "../helpers/Loader";
import Filters from "../helpers/Filters";
import { callAPI, defaultFilters } from "../../helperFuncs";
import { AppStore } from "../../store/AppContext";
import NoData from "../helpers/NoData/NoData";
import BarChart from "../commons/Charts/BarChart";
import PieChart from "../commons/Charts/PieChart";
import useResize from "../hooks/useResize";
import ScatterMap from "../commons/map/ScatterMap";
import { toast } from "react-toastify";
import layoutStyle from "../../stylesheets/layout.module.css";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import DropdownWrapper from "../helpers/DropdownWrapper";
import DropDownItem from "../helpers/DropDown/DropDownItem";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import TableHeaderAction from "../commons/dataDisplay/Table/TableHeaderAction";
import ChartTypes from "../commons/Charts/ChartTypes";
import LineChart from "../commons/Charts/LineChart";
import { cn } from "../../utils/functions";
import Icon from "../../components2/Icon/Icon";
import ExportExcel from "../helpers/Excel/ExcelExport";
import Button from "../helpers/Button";
import { Tooltip } from "react-tooltip";
import { useQuery } from "@tanstack/react-query";
import { getFilters } from "../../api/commonApi";

const filterTypes = {
  from: true,
  to: true,
  category: true,
  regions: true,
  geometry: true,
  reportsToInclude: true,
  satisfactionValues: true,
};
const filterDefaults = {
  fromDate: "",
  toDate: "",
  categoryIds: [],
  regions: [],
};

const Infos = ({ match }) => {
  const [store, dispatch] = useContext(AppStore);

  // states
  const [chartsList, setChartsList] = useState([]);
  const [selectedChartId, setSlectedChartId] = useState("");
  const [selectedChartTitle, setSelectedChartTitle] = useState("");
  const [pieChartsData, setPieChartsData] = useState([]);
  const [chartsData, setChartsData] = useState([]);
  const [barChartsData, setBarChartsData] = useState([]);
  const [chartType, setChartType] = useState("barCharts");
  const [chartCode, setChartCode] = useState();
  const [chartParameter, setChartParameter] = useState();
  const [singletons, setSingletons] = useState([]);
  const [locations, setLocations] = useState();
  const [loading, setLoading] = useState(false);
  const [isScatterMap, setIsScatterMap] = useState(false);
  const [filters, setFilters] = useState(filterDefaults);
  const [stack, setStack] = useState("");

  useEffect(() => {
    getChartsList({});
  }, []);

  useEffect(() => {
    if (store.refresh.page === match.path) {
      getInfos({});
    }

    return () => {
      dispatch({ type: "setFilters", payload: defaultFilters });
    };
  }, [store.refresh.call]);

  useEffect(() => {
    if (selectedChartId) {
      clearData();
      if (isScatterMap) {
        getLocations(store.filters);
      } else {
        getInfos({
          filters: store.filters,
          chartId: { code: chartCode, parameter: chartParameter },
        });
      }
    }
  }, [store.filters]);
  // Queries
  const { data: filtersData, isLoading } = useQuery({
    queryKey: ["filters"],
    queryFn: () => getFilters(),
  });
  // functions
  const getChartsList = () => {
    callAPI({
      caller: InfoAPI.getListCharts,
      successStatus: 200,
      successCallback: (res) => {
        setChartsList(res.data);
      },
      requestEnded: () => setLoading(false),
    });
  };

  const getInfos = ({ filters = {}, chartId = null }) => {
    setLoading(true);
    callAPI(
      {
        caller: InfoAPI.getChart,
        successStatus: 200,
        payload: chartId,
        successCallback: (res) => {
          setChartsData(res.data.charts);
          const locs = res.data.locations?.map((item) => {
            delete item.reportId;
            return item;
          });
          setLocations(locs);
          setPieChartsData(res.data.charts);
          setBarChartsData(res.data.charts);
          setSingletons(res.data.singletons);
        },
        requestEnded: () => setLoading(false),
      },
      filters
    );
  };

  const clearData = () => {
    setBarChartsData([]);
    setPieChartsData([]);
    setSingletons([]);
    setLocations([]);
  };

  const getLocations = (queries) => {
    setLoading(true);
    callAPI(
      {
        caller: ReportsAPI.getReportLocations,
        successCallback: (res) => setLocations(res.data),
        requestEnded: () => setLoading(false),
      },
      queries
    );
  };

  const onSelectChartType = (chartType) => {
    // setLoading(true);
    console.log(chartType);
    setChartType(chartType.value);
    // setIsHorizontal(chartType.isHorizontal);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const onClickOnElement = (item) => {
    if (!item.parameters) return;
    // const params = { ...getParams(), ...item.parameters };
    // setStack([...stack, { level: stack.length + 1, data: item }]);
    const chartCode = chartsList.find(
      (c) => String(c.id) === String(selectedChartId)
    )?.code;
    console.log(chartCode);
    console.log(item);
    setStack(item.title);
    setChartParameter(item.parameters);
    getInfos({ chartId: { code: chartCode, parameter: item.parameters } });
  };

  const onChartSelected = (chart) => {
    // setStack([
    //   { level: 0, data: { title: "نمودارها" } },
    //   { level: 1, data: chart },
    // ]);
    setStack("");
    const selectedChartId = chart.id;
    const chartCode = chartsList.find(
      (c) => String(c.id) === String(selectedChartId)
    )?.code;
    const isScatterMap = chartCode === 141;
    setSelectedChartTitle(chart.title);
    setSlectedChartId(selectedChartId);
    setChartCode(chartCode);
    setIsScatterMap(isScatterMap);
    clearData();
    dispatch({ type: "setFilters", payload: defaultFilters });
    if (selectedChartId) {
      if (isScatterMap) {
        getLocations({});
      } else {
        setChartParameter(0);
        getInfos({ chartId: { code: chartCode, parameter: 0 } });
      }
    }
  };

  useEffect(() => {
    if (chartsList.length > 0) {
      onChartSelected(chartsList[0]);
    }
  }, [chartsList]);
  // renders
  const renderInfoHeader = () => {
    return (
      <>
        <div className=" flex items-center gap-2">
          <ChartsList
            charts={chartsList}
            onSelectChart={onChartSelected}
            selectedChart={selectedChartTitle}
          />
          {stack && <p className=" text-lg text-[var(--primary)]">/ {stack}</p>}
        </div>
        <div className=" flex items-center ml-3 divide-y divide-x">
          <Filters
            filtersData={filtersData}
            filterTypes={filterTypes}
            filterValues={filters}
          />

          {chartsData?.length > 0 && (
            <span className=" h-8 w-1 bg-gray-300"></span>
          )}
          {chartsData?.length > 0 && <ExportExcel data={chartsData} />}
          {chartsData?.length > 0 && (
            <span className=" h-8 w-1 bg-gray-300"></span>
          )}
          {chartsData?.length > 0 && (
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

  const hasNoData =
    !loading &&
    singletons == null &&
    // pieChartsData.length === 0 &&
    barChartsData == null &&
    !locations == null;

  const { windowWidth, windowHeight } = useResize();
  useEffect(() => {
    console.log(locations);
  }, [locations]);

  const renderBreadCrumb = () => {
    return (
      <div className={layoutStyle.breadCrumb}>
        <div className={layoutStyle.breadLine}></div>
        {stack.map((s, i) => (
          <span
            className={cn(
              layoutStyle.crumb,
              i + 1 === stack.length ? layoutStyle.active : ""
            )}
            // onClick={() => goTo(s)}
            key={`stack-${s.level}`}
          >
            <span>{s.data.title}</span>
            {i + 1 !== stack.length && <Icon name="angle-left" />}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <section className={layoutStyle.wrapper}>
        <TableHeader renderHeader={renderInfoHeader} />
        {/* {renderBreadCrumb()} */}
        <LayoutScrollable clipped={(window.innerHeight * 3) / 48 + 10}>
          <div className="w100 mxa flex h-full">
            <section className="w100 mxa bg-white br1 overflow-auto h-full px-10 pr-10">
              {loading ? (
                <section className="relative w100 vh100 fcc">
                  <Loader absolute={true} />
                </section>
              ) : (
                <>
                  <div className={widgetStyle.infowidgets}>
                    {singletons &&
                      singletons.map((s, i) => (
                        <ReportCard
                          key={`reportcard-${i}`}
                          title={s.title}
                          value={s.value}
                        />
                      ))}
                  </div>

                  {/* {pieChartsData.length > 0 &&
                    pieChartsData.map((pieChartData, i) => (
                      <PieChart
                        key={`piechart-${i}`}
                        chartData={pieChartData}
                        chartTitle={pieChartData.chartTitle}
                        height={(windowHeight * 37) / 48 - 20}
                        width={"100%"}
                        radius={((windowHeight * 37) / 48 - 120) / 2}
                      />
                    ))} */}
                  {chartsData && chartType == "lineCharts" && (
                    <>
                      {chartsData.map((lineChartData, i) => {
                        return (
                          <LineChart
                            key={`piechart-${i}`}
                            chartData={lineChartData}
                            chartTitle={lineChartData.chartTitle}
                            height={(windowHeight * 37) / 48 - 20}
                            width={"100%"}
                            radius={((windowHeight * 37) / 48 - 120) / 2}
                            onClickOnElement={onClickOnElement}
                          />
                        );
                      })}
                    </>
                  )}
                  {chartsData && chartType == "pieCharts" && (
                    <>
                      {chartsData.map((pieChartData, i) => {
                        return (
                          <PieChart
                            key={`piechart-${i}`}
                            chartData={pieChartData}
                            chartTitle={pieChartData.chartTitle}
                            height={(windowHeight * 37) / 48 - 20}
                            width={"100%"}
                            radius={((windowHeight * 37) / 48 - 120) / 2}
                            onClickOnElement={onClickOnElement}
                          />
                        );
                      })}
                    </>
                  )}
                  {chartsData &&
                    chartType == "barCharts" &&
                    chartsData.map((barChartData, i) => {
                      const isHorizontal = true;
                      const barThickness = 24;
                      const numOfGroups = barChartData.series[0].values.length;
                      const numOfColumns = barChartData.series.length;
                      const a = barThickness * numOfGroups * numOfColumns + 60;
                      return (
                        <BarChart
                          key={`barchart-${i}`}
                          chartTitle={barChartData.chartTitle}
                          chartData={barChartData}
                          height={a}
                          width={"100%"}
                          isHorizontal={true}
                          onClickOnElement={onClickOnElement}
                        />
                      );
                    })}
                  {chartsData &&
                    chartType == "barCharts2" &&
                    chartsData.map((barChartData, i) => {
                      const isHorizontal = false;
                      const barThickness = 23;
                      const numOfGroups = barChartData.series[0].values.length;
                      const numOfColumns = barChartData.series.length;
                      const a = barThickness * numOfGroups * numOfColumns + 60;
                      return (
                        <BarChart
                          key={`barchart-${i}`}
                          chartTitle={barChartData.chartTitle}
                          chartData={barChartData}
                          height={(20 * window.innerHeight) / 24 - 120}
                          width={a}
                          isHorizontal={false}
                          onClickOnElement={onClickOnElement}
                        />
                      );
                    })}
                  {locations && !loading && (
                    <div>
                      <ScatterMap
                        width="100%"
                        mode="chart"
                        className="mxa"
                        height={400}
                        locations={locations[0].locations}
                        getLocations={(data) =>
                          getInfos({
                            filters: { geometry: data },
                            chartId: {
                              code: 100141,
                              parameter: 0,
                            },
                          })
                        }
                      />
                      {/* <Button
                        title="ارجاع درخواست"
                        className="py1 br05 bg-primary"
                        onClick={setReportPayload}
                        loading={createLoading}
                      /> */}
                    </div>
                  )}
                  {hasNoData ? (
                    <NoData
                      title="اطلاعاتی وجود ندارد."
                      icon="fas fa-chart-pie"
                    />
                  ) : null}
                </>
              )}
            </section>
          </div>
        </LayoutScrollable>
      </section>
    </>
  );
};

export default Infos;

const ChartsList = ({
  charts = [],
  onSelectChart = (f) => f,
  selectedChart,
}) => {
  return (
    <>
      <DropdownWrapper
        toggleElement={
          <TableHeaderAction
            title={
              <>
                <span className="ml05">نوع ‌نمودار</span>
                <span>{selectedChart ? `(${selectedChart})` : ""}</span>
              </>
            }
            icon="fas fa-list"
          />
        }
        position="center bottom"
        theme={{ background: "var(--white)", color: "var(--dark)" }}
        index={0}
        total={charts.length}
        scroll
        scrollHeight={300}
        dropDownClassName=" !w-[310px]"
        className="frc"
      >
        {charts.map((chart, i) => (
          <DropDownItem
            key={`chart-item-${i}`}
            title={chart.title}
            value={chart}
            onClick={onSelectChart}
            index={i}
          />
        ))}
      </DropdownWrapper>
    </>
  );
};
