import React from "react";
import { convertserverTimeToDateString } from "../../../helperFuncs";
import PHImage from "../../../assets/Images/item_profilepic_placeholder.png";

export default function Comment({ data }) {
  console.log(data.dateTime);
  const avatarUrl = `${process.env.REACT_APP_API_URL}/${data?.user.avatar?.url4}`;
  const Avatar = data?.user?.avatar?.url4 ? avatarUrl : PHImage;
  return (
    <div className=" border border-solid border-gray-300 w-full flex flex-col rounded-md p-6">
      <div className=" flex gap-2">
        <img src={Avatar} className=" w-16 h-16 rounded-full"></img>
        <div className=" flex flex-col gap-3 mt-2">
          <p className=" text-2xl font-bold">
            {data.user.firstName ? (
              <>
                {data.user.firstName} {data.user.lastName}{" "}
                <span className=" text-lg">
                  ({convertserverTimeToDateString(data.dateTime)})
                </span>
              </>
            ) : (
              <>
                {" "}
                {data.user.title}{" "}
                <span className=" text-lg">
                  (
                  {convertserverTimeToDateString("2023-12-21T15:13:46.3410003")}
                  )
                </span>
              </>
            )}
          </p>
          <p className=" max-sm:text-sm text-wrap w-full break-word text-justify">
            {data.text}
          </p>
        </div>
      </div>
      {data?.reply && (
        <div className=" border border-solid w-[95%] border-gray-300 flex flex-col rounded-md p-6 mr-auto mt-5">
          <div className=" flex gap-2">
            <img src={Avatar} className=" w-16 h-16 rounded-full"></img>
            <div className=" flex flex-col gap-3 mt-2">
              <p className=" text-2xl font-bold">
                {data.reply.user.firstName ? (
                  <>
                    {data.reply.user.firstName} {data.reply.user.lastName}{" "}
                    <span className=" text-lg">
                      (
                      {convertserverTimeToDateString(
                        "2023-12-21T15:13:46.3410003"
                      )}
                      )
                    </span>
                  </>
                ) : (
                  <>
                    {" "}
                    {data.reply.user.title}{" "}
                    <span className=" text-lg">
                      (
                      {convertserverTimeToDateString(
                        "2023-12-21T15:13:46.3410003"
                      )}
                      )
                    </span>
                  </>
                )}
              </p>
              <p className=" max-sm:text-sm text-wrap w-full break-word text-justify">
                {data.reply.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
