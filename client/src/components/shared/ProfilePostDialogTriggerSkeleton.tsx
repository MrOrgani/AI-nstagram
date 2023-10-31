import React from "react";
import { IoHeartSharp, IoChatbubbleSharp } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfilePostDialogTriggerSkeleton = () => {
  return (
    <div className="group p-0  relative ">
      <div className="hidden group-hover:flex absolute align-middle justify-center items-center left-0 right-0 top-0 bottom-0">
        <span className="z-10  text-white flex  items-center">
          <IoHeartSharp className=" w-11  " color={"white"} />
          0
          <IoChatbubbleSharp className=" w-11 z-10 " color={"white"} />0
        </span>
        <div className=" bg-black opacity-30 absolute left-0 right-0 top-0 bottom-0" />
      </div>
      <Skeleton className="w-64 h-64 bg-gray-300"></Skeleton>
    </div>
  );
};
