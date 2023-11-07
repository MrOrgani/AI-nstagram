import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageCircle } from "lucide-react";

export const ProfilePostDialogTriggerSkeleton = () => {
  return (
    <div className="group p-0  relative ">
      <div className="hidden group-hover:flex absolute align-middle justify-center items-center left-0 right-0 top-0 bottom-0">
        <span className="z-10   flex  items-center">
          <Heart className=" w-11 bg-white " color={"white"} />
          0
          <MessageCircle className=" w-11 z-10 " color={"white"} />0
        </span>
        <div className=" bg-black opacity-30 absolute left-0 right-0 top-0 bottom-0" />
      </div>
      <Skeleton className="w-64 h-64 bg-gray-300"></Skeleton>
    </div>
  );
};
