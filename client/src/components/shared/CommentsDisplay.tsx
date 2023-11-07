import { useState } from "react";

import { usePostContext } from "@/context/PostContext";

import type { IComment } from "@/lib/types";
import { Comment } from "./Comment";
import { useGetCommentsFromPostId } from "@/lib/react-query/queries";
import { SkeletonComment } from "./SkeletonComment";

interface CommentsDisplayProps {
  defaultComments?: IComment[];
  defaultDisplayComments?: boolean;
}

export const CommentsDisplay = ({
  defaultComments = [],
  defaultDisplayComments = false,
}: CommentsDisplayProps) => {
  const [diplayComments, setDiplayComments] = useState(defaultDisplayComments);
  const { currentPost } = usePostContext();

  const {
    data: comments,
    isLoading,
    isFetching,
  } = useGetCommentsFromPostId(currentPost?.id);

  const feedPostWithNoComments =
    !defaultDisplayComments && currentPost.comments === 0;

  if (!currentPost || feedPostWithNoComments) {
    return null;
  }

  return (
    <>
      {diplayComments && (isLoading || isFetching) && (
        <div data-testid="comments-from-post">
          {new Array(currentPost.comments)
            .fill(<SkeletonComment key={0} />)
            .map((_, i) => (
              <SkeletonComment key={i} />
            ))}
        </div>
      )}
      {!diplayComments && (
        <p
          className="text-neutral-500 font-medium text-sm my-2 cursor-pointer"
          onClick={() => setDiplayComments(!diplayComments)}
          data-testid="view-all-comments">
          View all {currentPost.comments} comments
        </p>
      )}
      {diplayComments && (
        <div data-testid="comments-from-post">
          {[...defaultComments, ...(comments || [])].map((comment) => {
            return <Comment key={comment.comment_id} comment={comment} />;
          })}
        </div>
      )}
    </>
  );
};
