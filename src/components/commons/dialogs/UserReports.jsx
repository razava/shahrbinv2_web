import React, { useEffect, useRef, useState } from "react";
import { getUserReports } from "../../../api/AdminApi";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { convertserverTimeToDateString } from "../../../helperFuncs";
import DialogToggler from "../../helpers/DialogToggler";
import ReportDialog from "../dataDisplay/ReportDialog";
import { ReportsAPI } from "../../../apiCalls";
import { useIntersection } from "@mantine/hooks";
const modalRoot = document && document.getElementById("modal-root");

export default function UserReports({ userId }) {
  const [dialogData, setDialogData] = useState({});
  const [dialog, setDialog] = useState(false);  

  // //queries
  // const { data: UserReports, isLoading } = useQuery({
  //   queryKey: ["getUserReports", userId],
  //   queryFn: () => getUserReports(userId),
  // });

  const {
    data,
    fetchNextPage,
    // fetchPreviousPage,
    // hasNextPage,
    // hasPreviousPage,
    isFetchingNextPage,
    // isFetchingPreviousPage,
    ...result
  } = useInfiniteQuery({
    queryKey: ["getUserReports", userId],
    queryFn: ({ pageParam = 1 }) =>
      getUserReports({ id: userId, pageNumber: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length + 1;
    },
    // getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
  });

  const lastPostRef = useRef(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  // if (entry.isIntersecting) {
  // }

  // const reports =

  useEffect(() => {
    console.log(222);
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry]);

  const _data = data?.pages.flatMap((page) => page);

  return (
    <div className=" px-10 grid grid-cols-2 gap-5 overflow-y-auto pb-5">
      {_data?.map((item, i) => {
        if (i === _data?.length - 1)
          return <div ref={ref} key={i}></div>;
        return (
          <div
            onClick={() => {
              setDialog(true);
              setDialogData(item);
            }}
            className=" min-h-[24rem] bg-gray-100 shadow-md rounded-md p-4 cursor-pointe hover:scale-105 transition flex justify-center flex-col items-center cursor-pointer col-span-1"
          >
            <div className=" flex flex-col justify-center w-full gap-2">
              <span className=" text-lg">
                <span className=" font-bold">تاریخ ایجاد:</span>{" "}
                {convertserverTimeToDateString(item?.sent)}
              </span>
              <span className=" text-lg">
                {" "}
                <span className=" font-bold">کد رهگیری:</span>{" "}
                {item.trackingNumber}
              </span>
              <span className=" text-lg">
                {" "}
                <span className=" font-bold">موضوع:</span> {item.categoryTitle}
              </span>
            </div>
            <div className=" w-full text-center mx-auto bg-primary rounded-md text-white p-2 mt-auto">
              {item.lastStatus}
            </div>
          </div>
        );
      })}

      <DialogToggler
        condition={dialog}
        dialogId={dialogData?.id}
        data={dialogData}
        setCondition={setDialog}
        width={800}
        height={650}
        // outSideClick={false}
        id={"user-report-dialog"}
      >
        <ReportDialog
          id={dialogData?.id}
          readOnly={false}
          setDialog={setDialog}
          refresh={() => null}
          caller={ReportsAPI.getTask}
          childData={dialogData}
          onNext={() => null}
        />
      </DialogToggler>
    </div>
  );
}
