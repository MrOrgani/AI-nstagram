import { useCallback, useEffect, useState } from "react";

import { usePostContext } from "../context/PostContext";
import { getCommentsFromPostId } from "../lib/fetch/utils";

import type { Comment } from "../lib/types";
import { CommentsList } from "./CommentsList";

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
          <CommentsList comments={currentComments} />
        </div>
      )}
    </>
  );
};

export default CommentsDisplay;
