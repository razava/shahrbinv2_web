import React, { useEffect, useState } from "react";
import Rating from "../../helpers/Rating/Rating";
import Textarea from "../../helpers/Textarea";
import Button from "../../helpers/Button";
import { callAPI } from "../../../helperFuncs";
import { ReportsAPI } from "../../../apiCalls";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getSatisfaction } from "../../../api/StaffApi";

const Satisfaction = ({ data }) => {
  // states
  const [values, setValues] = useState({
    rating: data.report?.satisfaction?.rating || 0,
    comments: data.report?.satisfaction?.comments || "",
  });
  const [loading, setLoading] = useState(false);
  console.log(data.id);

  // queries
  const {
    data: satisfactionData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Satisfaction", data.id],
    queryFn: () => getSatisfaction(data.id),
  });
  console.log(satisfactionData);
  //   functions
  const submit = async () => {
    setLoading(true);
    callAPI(
      {
        caller: ReportsAPI.sendSatisfaction,
        successStatus: 201,
        payload: values,
        successCallback: (res) => {
          refetch();
        },
        requestEnded: () => {
          setLoading(false);
        },
      },
      data.id
    );
  };

  useEffect(() => {
    if (satisfactionData) {
      console.log(satisfactionData.comments);
      setValues({
        comments: satisfactionData.comment,
        rating: satisfactionData.rating,
      });
    }
  }, [satisfactionData]);

  useEffect(() => {
    console.log(values.rating);
  }, [values]);
  return (
    <>
      <section className="w100 fcc">
        {!isLoading && (
          <>
            {" "}
            <Rating
              defaultValue={satisfactionData?.rating}
              value={values.rating}
              onChange={(value) => setValues({ ...values, rating: value })}
            />
            <Textarea
              placeholder="توضیحات"
              wrapperClassName="mb-2"
              inputClassName="mh150"
              handleChange={(name) => (e) =>
                setValues({ ...values, comments: e.target.value })}
              value={values.comments}
            />
            {satisfactionData?.history && (
              <Textarea
                placeholder="تاریخچه"
                wrapperClassName="mb-2"
                inputClassName="mh150"
                readOnly={true}
                // handleChange={(name) => (e) =>
                //   setValues({ ...values, comments: e.target.value })}
                value={satisfactionData?.history}
              />
            )}
          </>
        )}
      </section>
      <div className="w80 mxa fre py1 px2 border-t-light mt1 fixed b0 bg-white">
        <Button
          title="ثبت"
          className="py1 br05 bg-primary"
          onClick={submit}
          loading={loading}
        />
      </div>
    </>
  );
};

export default Satisfaction;
