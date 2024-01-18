import React, { useEffect, useState } from "react";
import { PollAPI } from "../../apiCalls";
import { serverError, unKnownError } from "../../helperFuncs";
import MyPieChart from "../commons/dataDisplay/MyPieChart";
import Loader from "../helpers/Loader";
import Title from "../helpers/Title";
import useMakeRequest from "../hooks/useMakeRequest";

const Poll = ({ match }) => {
  const [pollId, setPollId] = useState(null);

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
  return (
    <>
      {loading && <Loader />}
      <Title title="نتایج نظرسنجی" size={1} />
      {data.pollChoicesResults && (
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
      )}
    </>
  );
};

export default Poll;
