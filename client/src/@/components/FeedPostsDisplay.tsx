import React, { useCallback, useEffect, useRef, useState } from "react";
import supabase from "../../supabase";
import Loader from "./Loader";
import FeedPost from "./FeedPost";

import { debounce } from "lodash";
import { PostType } from "../lib/types";
import useAuthStore from "../../store/authStore";
import { PAGE_COUNT, fetchFeedPosts } from "../lib/fetch/utils";

const FeedPostsDisplay = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedPosts, setLoadedPosts] = useState<PostType[]>([]);
  const [offset, setOffset] = useState(1);
  const [isLast, setIsLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { userProfile } = useAuthStore();
  supabase
    .channel("posts")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "posts" },
      async (payload) => {
        if (payload.new.user_id === userProfile?.id) {
          try {
            const { data: newPost } = await supabase
              .from("posts")
              .select(
                `*,
          user:user_id (*),
          likedByUser:likes(id:user_id)
          `
              )
              .eq("id", payload.new.id)
              .single();
            setLoadedPosts([newPost, ...loadedPosts]);
          } catch (err) {
            console.log(err);
          }
        }
      }
    )
    .subscribe();

  const handleScroll = useCallback(() => {
    if (containerRef.current && typeof window !== "undefined") {
      const container = containerRef.current;
      const { bottom } = container.getBoundingClientRect();
      const { innerHeight } = window;
      return bottom <= innerHeight;
    }
    return false;
  }, [containerRef]);

  const loadMoreTickets = useCallback(async () => {
    if (isLast) {
      return;
    }
    setIsLoading(true);
    setOffset((prev) => prev + 1);
    const { data: newPosts } = await fetchFeedPosts(offset);
    if (newPosts.length < PAGE_COUNT) {
      setIsLast(true);
    }
    if (newPosts.length > 0) {
      setLoadedPosts((prevPosts) => [...prevPosts, ...newPosts]);
    }
    setIsLoading(false);
  }, [isLast, offset]);

  useEffect(() => {
    const fetchNewPosts = async () => {
      const { data } = await fetchFeedPosts(0);
      setLoadedPosts(data ?? []);
    };
    fetchNewPosts();
  }, []);

  useEffect(() => {
    const handleDebouncedScroll = debounce(() => {
      if (!isLast && handleScroll()) {
        loadMoreTickets();
      }
    }, 500);
    window.addEventListener("scroll", handleDebouncedScroll);
    return () => {
      window.removeEventListener("scroll", handleDebouncedScroll);
    };
  }, [isLast, handleScroll, loadMoreTickets]);

  return (
    <>
      <div ref={containerRef}>
        {loadedPosts.map((post) => (
          <FeedPost key={`post-${post.id}`} currentPost={post} />
        ))}
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : null}
    </>
  );
};

export default FeedPostsDisplay;
