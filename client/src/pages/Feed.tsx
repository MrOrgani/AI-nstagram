import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { FeedPostSkeleton } from "@/components/shared/FeedPostSkeleton";
import React from "react";
import { useGetPosts } from "@/lib/react-query/queries";
import { FeedPost } from "@/components/shared/FeedPost";

const Feed = () => {
  const { ref, inView } = useInView();

  const { data, error, isFetchingNextPage, fetchNextPage, isLoading, isError } =
    useGetPosts();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (isError) {
    console.error("Error fetching posts", error);
    return;
  }

  return (
    <main className="py-6 px-4 mx-auto md:max-w-[560px] max-w-full">
      {isLoading && (
        <>
          <FeedPostSkeleton />
          <FeedPostSkeleton />
        </>
      )}
      {data?.pages?.map(({ data }) => (
        <React.Fragment key={`feed-page-${data[0]?.id}`}>
          {data.map((post) => (
            <FeedPost key={`feed-post-${post.id}`} currentPost={post} />
          ))}
        </React.Fragment>
      ))}
      <div ref={ref}>{isFetchingNextPage ? <FeedPostSkeleton /> : null}</div>
    </main>
  );
};

export default Feed;
