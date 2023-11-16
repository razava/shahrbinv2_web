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

const filterTypes = { from: true, to: true, category: true, regions: true };
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
  const [barChartsData, setBarChartsData] = useState([]);
  const [singletons, setSingletons] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isScatterMap, setIsScatterMap] = useState(false);
  const [filters, setFilters] = useState(filterDefaults);

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
        getInfos({ filters: store.filters, chartId: selectedChartId });
      }
    }
  }, [store.filters]);

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
          setPieChartsData(res.data.pieCharts);
          setBarChartsData(res.data.barCharts);
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

  const onChartSelected = (chart) => {
    const selectedChartId = chart.id;
    const chartCode = chartsList.find(
      (c) => String(c.id) === String(selectedChartId)
    )?.code;
    const isScatterMap = chartCode === 141;
    setSelectedChartTitle(chart.title);
    setSlectedChartId(selectedChartId);
    setIsScatterMap(isScatterMap);
    clearData();
    dispatch({ type: "setFilters", payload: defaultFilters });
    if (selectedChartId) {
      if (isScatterMap) {
        getLocations({});
      } else {
        getInfos({ chartId: selectedChartId });
      }
    }
  };

  // renders
  const renderInfoHeader = () => {
    return (
      <>
        <ChartsList
          charts={chartsList}
          onSelectChart={onChartSelected}
          selectedChart={selectedChartTitle}
        />
        <Filters filterTypes={filterTypes} filterValues={filters} />
      </>
    );
  };

  const hasNoData =
    !loading &&
    singletons.length === 0 &&
    pieChartsData.length === 0 &&
    barChartsData.length === 0 &&
    !isScatterMap;

  const { windowWidth, windowHeight } = useResize();

  return (
    <>
      <section className={layoutStyle.wrapper}>
        <TableHeader renderHeader={renderInfoHeader} />
        <LayoutScrollable clipped={(window.innerHeight * 3) / 48 + 10}>
          <div className="w100 mxa">
            <section className="w100 mxa mt1 bg-white br1">
              {loading ? (
                <section className="relative w100 vh100 fcc">
                  <Loader absolute={true} />
                </section>
              ) : (
                <>
                  <div className={widgetStyle.infowidgets}>
                    {singletons.length > 0 &&
                      singletons.map((s, i) => (
                        <ReportCard
                          key={`reportcard-${i}`}
                          title={s.title}
                          value={s.value}
                        />
                      ))}
                  </div>

                  {pieChartsData.length > 0 &&
                    pieChartsData.map((pieChartData, i) => (
                      <PieChart
                        key={`piechart-${i}`}
                        chartData={pieChartData}
                        chartTitle={pieChartData.chartTitle}
                        height={(windowHeight * 37) / 48 - 20}
                        width={"100%"}
                        radius={((windowHeight * 37) / 48 - 120) / 2}
                      />
                    ))}
                  {barChartsData.length > 0 &&
                    barChartsData.map((barChartData, i) => {
                      const barChartItemHeight =
                        (barChartData.series.length > 0
                          ? Object.keys(barChartData.series[0].values).length
                          : 1) * 30;
                      return (
                        <BarChart
                          key={`barchart-${i}`}
                          chartTitle={barChartData.chartTitle}
                          chartData={barChartData}
                          height={
                            barChartData.series.length * barChartItemHeight +
                            barChartItemHeight * 5
                          }
                          width={windowWidth - (store.sidebarIsOpen ? 250 : 70)}
                        />
                      );
                    })}
                  {isScatterMap && !loading && (
                    <ScatterMap
                      width="100%"
                      className="mxa"
                      height={400}
                      locations={locations}
                    />
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
