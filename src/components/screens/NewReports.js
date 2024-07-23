import React, { useContext, useEffect, useRef, useState } from "react";
import layoutStyle from "../../stylesheets/layout.module.css";
import { ReportsAPI } from "../../apiCalls";
import NewReportsTable from "../commons/dataDisplay/NewReportsTable";
import { callAPI, constants, getFromLocalStorage } from "../../helperFuncs";
import NoData from "../helpers/NoData/NoData";
import useSignalR from "../hooks/useSignalR";
import { AppStore } from "../../store/AppContext";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import Tabs from "../helpers/Tabs";
import TabLabel from "../helpers/Tabs/TabLabel";
import Filters from "../helpers/Filters";
import Search from "../helpers/Search";
import { useQuery } from "@tanstack/react-query";
import { getFilters } from "../../api/commonApi";
import { Tooltip } from "react-tooltip";
import { getExcel } from "../../api/StaffApi";
import TextInput from "../helpers/TextInput";
import SearchInput from "../helpers/SearchInput";

const filterTypes = {
  // query: true,
  from: true,
  to: true,
  statuses: false,
  geometry: false,
  category: true,
  reportsToInclude: false,
  satisfactionValues: true,
  priorities: true,
  executives: true,
  regions: true,
};

const NewReports = ({ match }) => {
  // refs
  let sources = useRef([]);

  // store
  const [store, dispatch] = useContext(AppStore);

  // data states
  const [possibleSources, setPossibleSources] = useState([]);
  const [sourcesCounts, setSourcesCounts] = useState([]);

  // other states
  const [activeTab, setActiveTab] = useState("");
  const [query, setQuery] = useState("");
  const [isQuery, setIsQuery] = useState(true);

  // flags
  const [loading, setLoading] = useState(false);

  const queries = {
    page: 1,
    perPage: 10,
    ...store.filters,
  };
  const instanceId = getFromLocalStorage(
    constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID
  );

  // Queries
  const { data: filtersData, isLoading } = useQuery({
    queryKey: ["filters"],
    queryFn: () => getFilters(),
  });

  const {
    data: excelData,
    isLoading: isLoading2,
    refetch,
  } = useQuery({
    queryKey: ["excel"],
    queryFn: () => getExcel(),
    enabled: false,
  });
  
  console.log(filtersData);
  // get sources
  useEffect(() => {
    getSources();
  }, []);

  useEffect(() => {
    if (store.refresh.page === match.path) {
      setPossibleSources([]);
      sources.current = [];
      getSources();
    }
  }, [store.refresh.call]);

  const getSources = () => {
    setLoading(true);
    callAPI({
      caller: ReportsAPI.getPossibleSources,
      successStatus: 200,
      successCallback: (res) => {
        setPossibleSources(res.data);
        sources.current = res.data;
        const activeTab = res.data.length > 0 ? res.data[0].roleId : "";
        setActiveTab(activeTab);
        getTasksCounts(res.data).then((counts) => {
          updateCount(counts);
        });
      },
      requestEnded: () => {
        setLoading(false);
      },
    });
  };

  const getTasksCounts = (sources) => {
    const promises = sources.map((source) => {
      return new Promise((resolve, reject) => {
        const token = getFromLocalStorage(
          constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN
        );
        ReportsAPI.getTasks(
          token,
          source.roleId,
          null,
          instanceId,
          queries
        ).then((res) => {
          if (res && res.status === 200) {
            const pagination = res.headers["x-pagination"];
            const totalCount = JSON.parse(pagination)?.TotalCount;
            resolve(totalCount);
          } else reject();
        });
      });
    });

    return Promise.all(promises);
  };

  const updateCount = (counts) => {
    setSourcesCounts(counts);
  };

  const onRefer = () => {
    onChangeReceived("on refer");
  };

  const onChangeReceived = (x = "signalr") => {
    getTasksCounts(sources.current).then((counts) => {
      updateCount(counts);
      // console.log("new counts: ", counts);
    });
  };

  const onTabChange = (tab) => {
    setActiveTab(tab);
  };

  const exportToExcel = () => {
    const instanceId = getFromLocalStorage(
      constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID
    );
    ReportsAPI.getExcel(queries, instanceId).then((res) => {
      // setExcelLoading(false);
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        const filename = new Date().getTime() + ".xlsx";
        link.setAttribute("download", filename);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
      }
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      dispatch({
        type: "setFilters",
        payload: { ...store.filters, query: query },
      });
    }
  };

  useEffect(() => {
    if (store?.filters?.query == "") {
      setQuery("");
    }
  }, [store.filters]);

  // renders
  const renderTableHeader = () => {
    return (
      <div className=" flex items-center w-full">
        {tabs.length > 0 ? (
          <Tabs
            mainClass="report-tab"
            activeClass="active"
            onTabChange={onTabChange}
            wrapperClassName="scrollbar-h"
          >
            {tabs.map((tab) => (
              <div
                id={tab.id}
                label={<TabLabel tab={tab} activeTab={activeTab} />}
                key={tab.id}
              ></div>
            ))}
          </Tabs>
        ) : (
          <div className="report-tabs"></div>
        )}
        <div className=" flex items-center gap-2">
          <SearchInput
            isQuery={isQuery}
            setIsQuery={setIsQuery}
            filters={store.filters}
            setQuery={setQuery}
            query={query}
          />
          {/* <span
            data-tooltip-id="excel"
            className=" cursor-pointer"
            onClick={exportToExcel}
          >
            <span>
              <i className="far fa-file-excel text-4xl text-primary"></i>
            </span>
          </span>
          <Tooltip
            style={{ fontSize: "10px", zIndex: 100 }}
            id="excel"
            place="bottom"
            content="خروجی excel"
          /> */}

          <Filters filterTypes={filterTypes} filtersData={filtersData} />
        </div>
        {/* </div> */}
      </div>
    );
  };

  // variables
  // const noData = !loading && possibleSources.length === 0;

  const tabs = possibleSources.map((source, i) => {
    return {
      id: source.roleId,
      title: source.roleTitle,
      badge: sourcesCounts[i] !== undefined ? sourcesCounts[i] : "",
    };
  });
  const canRefer = possibleSources.find((item) => activeTab === item.roleId)?.canRefer;
  console.log(canRefer);
  console.log(possibleSources.find((item) => activeTab === item.roleId));
  useSignalR(onChangeReceived);
  return (
    <>
      <div className={layoutStyle.wrapper}>
        <TableHeader renderHeader={renderTableHeader} />
        <NewReportsTable
          canRefer={canRefer}
          roleId={activeTab}
          onRefer={onRefer}
        />
      </div>

      {/* {noData ? <NoData title="درخواستی وجود ندارد." /> : null} */}
    </>
  );
};

export default React.memo(NewReports);

const TableLegend = () => {
  // TODO: fix placing legend on right side of the table
  return (
    <section className="fixed b0 w100 mxa d-flex ju-c al-c my1 wrap mh50">
      <div className="frc mx1 my1">
        <span
          className={"frc sq25 br50"}
          style={{ background: "#f6c5078f" }}
        ></span>
        <span className="mr1 f12 text-dark">زمان پاسخگویی منقضی شده است.</span>
      </div>
      <div className="frc mx1 my1">
        <span
          className={"frc sq25 br50"}
          style={{ background: "#C78E8E" }}
        ></span>
        <span className="mr1 f12 text-dark">زمان اتمام منقضی شده است.</span>
      </div>
    </section>
  );
};
