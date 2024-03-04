import React from "react";
import { getReportComments } from "../../../api/StaffApi";
import { useQuery } from "@tanstack/react-query";
import Comment from "./Comment";

export default function ReportComments({ data }) {
  const { data: ReportComments, isLoading } = useQuery({
    queryKey: ["ReportComments", data?.id],
    queryFn: () => getReportComments(data?.id),
  });
  console.log(ReportComments);
  return (
    <div className=" p-10">
      <div className=" flex flex-col  gap-5">
        {ReportComments?.length == 0 && (
          <p className=" text-xl ">هیچ نظری ثبت نشده است.</p>
        )}
        {ReportComments?.map((item) => {
          return <Comment key={item.id} data={item} />;
        })}
      </div>
    </div>
  );
}
