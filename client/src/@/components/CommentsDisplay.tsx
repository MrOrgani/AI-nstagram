import { useCallback, useEffect, useState } from "react";

import {
  getContrastingColor,
  getDateFromNow,
  stringToColour,
} from "../lib/utils";
import { usePostContext } from "../context/PostContext";
import { getCommentsFromPostId } from "../lib/fetch/utils";

import type { Comment } from "../lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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
          {currentComments.map((comment) => {
            const bgColour = stringToColour(comment.user.name);
            const color = getContrastingColor(bgColour);

            return (
              <div
                data-testid="comments-on-post"
                className="flex mb-4"
                key={`post-${currentPost.id}-comment-${comment.comment_id}`}
              >
                <div
                  className={`min-h-10 min-w-[3rem] ${
                    currentPost.user?.avatar ? "bg-neutral-200" : ""
                  } rounded-full`}
                >
                  <Avatar className="w-8 h-8 ">
                    <AvatarImage
                      src={comment.user.avatar}
                      alt={comment.user?.name + "_avatar"}
                    />
                    <AvatarFallback
                      className={`text-md font-bold`}
                      style={{ backgroundColor: bgColour, color }}
                    >
                      {comment.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
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
            );
          })}
        </div>
      )}
    </>
  );
};

export default CommentsDisplay;
