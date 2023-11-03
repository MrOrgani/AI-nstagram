import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonComment = () => {
  return (
    <div data-testid="comments-on-post" className="flex mb-4">
      <div className={`min-h-10  rounded-full`}>
        <Skeleton className="w-8 h-8  rounded-full" />
      </div>
      <div className="ml-3">
        <div className="flex">
          <Skeleton className="h-4 w-[50px] mr-1 mb-1" />
          <Skeleton className="h-4 w-[200px] mb-1" />
        </div>
        <Skeleton className="h-4 w-[20px]" />
      </div>
    </div>
  );
};
