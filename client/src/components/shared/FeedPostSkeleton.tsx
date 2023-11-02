import { Skeleton } from "@/components/ui/skeleton";
import { LikeIcon } from "./LikeIcon";
import { IoChatbubbleOutline } from "react-icons/io5";
import { HiArrowDownTray } from "react-icons/hi2";

export const FeedPostSkeleton = () => {
  return (
    <div
      data-testid="feed-post-skeleton"
      className=" bg-white  mb-5 border-b border-b-gray-200">
      <div className="flex items-center justify-between p-2.5">
        <div className="flex items-center">
          <Skeleton className="w-8 h-8 bg-gray-300 rounded-full mr-2.5"></Skeleton>
          <Skeleton className="w-24 h-4 bg-gray-300 rounded-full"></Skeleton>
          <span className="text-gray-300 text-sm mx-1">•</span>
          <Skeleton className="w-[25px] h-4 bg-gray-300 rounded-full"></Skeleton>
        </div>
      </div>
      <Skeleton className="w-full h-[528px] bg-gray-300"></Skeleton>
      <div className="text-gray-300">
        <div className="flex items-center justify-between text-2xl mt-1 mb-[6px]">
          <div className="flex items-center">
            <span className="block">
              <LikeIcon />
            </span>
            <div className="block">
              <div className="p-2">
                <IoChatbubbleOutline className="  " />
              </div>
            </div>
          </div>
          <HiArrowDownTray className=" " />
        </div>
        <div className="max-h-80 flex">
          <Skeleton className="w-[70px] mr-2 h-4 bg-gray-300 rounded-full"></Skeleton>
          <Skeleton className="w-full h-4 bg-gray-300 rounded-full mb-1.5"></Skeleton>
        </div>
        <Skeleton className="w-full h-4 bg-gray-300 rounded-full mb-2.5"></Skeleton>
      </div>
      <Skeleton className="w-full h-5 bg-gray-300 rounded-full mb-2"></Skeleton>
    </div>
  );
};
