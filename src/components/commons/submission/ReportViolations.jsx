import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getViolationsOfReport } from "../../../api/StaffApi";
import { convertserverTimeToDateString } from "../../../helperFuncs";

export default function ReportViolations({ data }) {

  const { data: ReportViolations, isLoading } = useQuery({
    queryKey: ["ReportViolation", data?.id],
    queryFn: () => getViolationsOfReport(data?.id),
  });
    
  return (
    <div className=" px-8">
      {/* {ReportViolations?.length == 0 && <p>هیج گزارش تخلفی ثبت نشده است.</p>} */}
      {ReportViolations?.map((item) => {
        return (
          <>
            <h3 class="flex items-center w-full mb-2">
              <span class="flex-grow bg-gray-300 !h-2"></span>
              <span class="mx-3 text-lg font-medium">
                {convertserverTimeToDateString(item.dateTime)}
              </span>
              <span class="flex-grow bg-gray-300 !h-2"></span>
            </h3>
            <div className=" bg-gray-100 flex flex-col gap-3 p-5 rounded-md">
              <span className=" font-bold text-lg bg-primary text-white w-fit p-1 rounded-md">
                {item.violationTypeTitle}
              </span>
              <p>{item.description}</p>
            </div>
          </>
        );
      })}
    </div>
  );
}
