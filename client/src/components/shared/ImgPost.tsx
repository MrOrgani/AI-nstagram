import type { PostType } from "@/lib/types";
import { useGetPostImg } from "@/lib/react-query/queries";
import { Skeleton } from "../ui/skeleton";

export const ImgPost = (post: PostType) => {
  const { data, isLoading } = useGetPostImg(post.photo);
  if (isLoading) {
    return <Skeleton className="w-full h-[528px] bg-gray-300"></Skeleton>;
  }

  return (
    <img
      src={data}
      alt={post.prompt}
      className="w-full h-full"
      loading="lazy"
    />
  );
};
