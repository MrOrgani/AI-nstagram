import { useCallback, useEffect, useState } from "react";

import { getDateFromNow } from "../lib/utils";
import { usePostContext } from "../context/PostContext";
import { getCommentsFromPostId } from "../lib/fetch/utils";

import type { Comment } from "../lib/types";

const CommentsDisplay = () => {
  const [diplayComments, setDiplayComments] = useState(false);
  const { currentPost, update } = usePostContext();
  const [currentComments, setCurrentComments] = useState<Comment[]>([]);

  const fetchComments = useCallback(async () => {
    try {
      if (!currentPost) {
        return;
      }

      const comments = await getCommentsFromPostId(currentPost?.id);
      if (currentPost) {
        update((prev) => ({
          ...prev,
          commentsByUser: comments,
        }));
      }
      setCurrentComments(comments ?? []);
    } catch (error) {
      console.log(error);
    }
  }, [currentPost]);

  useEffect(() => {
    const existingCommentsAreEmpty =
      diplayComments &&
      currentPost.comments > 0 &&
      !currentPost?.commentsByUser;
    if (existingCommentsAreEmpty) {
      fetchComments();
    }

    const currentUserAddedAComment =
      currentPost?.commentsByUser &&
      currentPost?.commentsByUser.length > currentComments.length;
    if (currentUserAddedAComment) {
      setCurrentComments(currentPost?.commentsByUser);
    }

    return;
  }, [
    currentComments.length,
    currentPost.comments,
    currentPost?.commentsByUser,
    diplayComments,
    fetchComments,
  ]);

  if (!currentPost || currentPost?.comments < 1) {
    return null;
  }

  return (
    <>
      {!diplayComments ? (
        <p
          className="text-neutral-500 font-medium text-sm my-2 cursor-pointer"
          onClick={() => setDiplayComments(!diplayComments)}
          data-testid="view-all-comments"
        >
          View all {currentPost.comments} comments
        </p>
      ) : (
        <div
          data-testid="comments-from-post"
          className={"max-h-80 overflow-auto"}
        >
          {currentComments.map((comment) => (
            <div
              data-testid="comments-on-post"
              className="flex mb-4"
              key={`post-${currentPost.id}-comment-${comment.comment_id}`}
            >
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
        </div>
      )}
    </>
  );
};

export default CommentsDisplay;
