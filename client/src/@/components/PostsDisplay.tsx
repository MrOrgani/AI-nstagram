import React, { useCallback, useEffect, useRef, useState } from "react";
import supabase from "../../supabase";
import Loader from "./Loader";
import Post from "./Post";

import { debounce } from "lodash";
import { PostType } from "../lib/types";
import useAuthStore from "../../store/authStore";

const PAGE_COUNT = 2;

const PostsDisplay = () => {
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
    const { data: newPosts } = await fetchTickets(offset);
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
      const { data } = await fetchTickets(0);
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

  const fetchTickets = async (offset: number) => {
    const from = offset * PAGE_COUNT;
    const to = from + PAGE_COUNT - 1;

    const { data } = await supabase
      .from("posts")
      .select(
        `*,
        user:user_id (*),
        likedByUser:likes(id:user_id)
        `
      )
      .range(from, to)
      .order("created_at", { ascending: false })
      .limit(PAGE_COUNT);

    return { data: data ?? [] };
  };

  return (
    <>
      <div ref={containerRef}>
        {loadedPosts.map((post) => (
          <Post key={`post-${post.id}`} currentPost={post} />
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

export default PostsDisplay;
