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

const filterTypes = { query: true, from: true, to: true, statuses: true };

const NewReports = ({ match }) => {
  // refs
  let sources = useRef([]);

  // store
  const [store] = useContext(AppStore);

  // data states
  const [possibleSources, setPossibleSources] = useState([]);
  const [sourcesCounts, setSourcesCounts] = useState([]);

  // other states
  const [activeTab, setActiveTab] = useState("");

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

  // renders
  const renderTableHeader = () => {
    return (
      <>
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

        {/* <div className={"frc"}> */}
        {/* <Search /> */}
        <Filters filterTypes={filterTypes} />
        {/* </div> */}
      </>
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

  useSignalR(onChangeReceived);
  return (
    <>
      <div className={layoutStyle.wrapper}>
        <TableHeader renderHeader={renderTableHeader} />
        <NewReportsTable roleId={activeTab} onRefer={onRefer} />
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
