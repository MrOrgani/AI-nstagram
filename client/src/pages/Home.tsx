import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { FeedPostSkeleton } from "../@/components/FeedPostSkeleton";
import { fetchFeedPosts } from "../@/lib/fetch/utils";
import FeedPost from "../@/components/FeedPost";
import React from "react";

const Home = () => {
  const { ref, inView } = useInView();

  const { status, data, error, isFetchingNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["projects"],

      queryFn: async ({ pageParam = 0 }) => {
        const res = await fetchFeedPosts(pageParam);
        return res;
      },
      getNextPageParam: (lastPage) => {
        return lastPage?.nextId ?? undefined;
      },
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  return (
    <main className="py-6 px-4 mx-auto w-[560px] ">
      {isLoading && <FeedPostSkeleton />}

      {data?.pages?.map(({ data }) => (
        <React.Fragment key={data[0].id}>
          {data.map((post) => (
            <FeedPost key={`post-page-${post.id}`} currentPost={post} />
          ))}
        </React.Fragment>
      ))}
      <div ref={ref}>{isFetchingNextPage ? <FeedPostSkeleton /> : null}</div>
    </main>
  );
};

export default Home;
