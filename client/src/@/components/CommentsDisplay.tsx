import React, { useCallback, useEffect, useState } from "react";
import type { PostType } from "../lib/types";
import supabase from "../../supabase";
import { getDateFromNow } from "../lib/utils";

interface Props {
  currentPost: PostType;
}

const CommentsDisplay = ({ currentPost }: Props) => {
  const [diplayComments, setDiplayComments] = useState(false);
  const [currentComments, setCurrentComments] = useState<any[]>([]);

  const fetchComments = useCallback(async () => {
    const { data: comments, error } = await supabase
      .from("comments")
      .select(
        `*,
          user:user_id(*)
        `
      )
      .eq("post_id", currentPost.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.log(error);
    }
    console.log("fetching comments for", currentPost.id, comments);
    setCurrentComments(comments ?? []);
  }, [currentPost.id]);

  useEffect(() => {
    if (diplayComments) {
      fetchComments();
    }
    return;
  }, [diplayComments, fetchComments]);

  if (currentPost.comments < 1) {
    return null;
  }

  return (
    <>
      {!diplayComments ? (
        <p
          className="text-neutral-500 font-medium text-sm my-2 cursor-pointer"
          onClick={() => setDiplayComments(!diplayComments)}
        >
          View all {currentPost.comments} comments
        </p>
      ) : (
        <>
          {currentComments.map((comment) => (
            <div className="flex mb-4" key={comment.id}>
              {currentPost.user?.avatar ? (
                <div className="min-h-10 min-w-[3rem] bg-neutral-200 rounded-full">
                  <img
                    src={comment.user?.avatar}
                    alt={comment.user?.name + "avatar"}
                    className="rounded-full w-8 h-8 "
                  />
                </div>
              ) : (
                <div className="min-h-10 min-w-[3rem]">
                  <div className="h-8 w-8 rounded-full bg-green-700 flex justify-center items-center text-white text-sm font-semibold">
                    {comment.user.name[0]}
                  </div>
                </div>
              )}
              <div className="ml-1">
                <div>
                  <span className="text-sm font-semibold text-gray-800 mr-1">
                    {comment.user.name}
                  </span>
                  <span className="text-black text-sm break-words">
                    {comment.text}
                  </span>
                </div>
                <p className="text-xs text-[#737373]">
                  {getDateFromNow(comment.created_at)}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default CommentsDisplay;
