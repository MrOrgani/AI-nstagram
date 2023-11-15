import { useEffect, useState } from "react";

import { usePostContext } from "@/context/PostContext";

import type { IComment } from "@/lib/types";
import { Comment } from "./Comment";
import { useGetCommentsFromPostId } from "@/lib/react-query/queries";
import { SkeletonComment } from "./SkeletonComment";
import { useInView } from "react-intersection-observer";
import { Loader } from "lucide-react";

interface CommentsDisplayProps {
  defaultComments?: IComment[];
  defaultDisplayComments?: boolean;
}

export const CommentsDisplay = ({
  defaultComments = [],
  defaultDisplayComments = false,
}: CommentsDisplayProps) => {
  const { ref, inView } = useInView();
  const [diplayComments, setDiplayComments] = useState(defaultDisplayComments);
  const { currentPost } = usePostContext();

  const { data, isLoading, isFetchingNextPage, isFetching, fetchNextPage } =
    useGetCommentsFromPostId(currentPost?.id);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const feedPostWithNoComments =
    !defaultDisplayComments && currentPost.comments.length === 0;

  if (!currentPost || feedPostWithNoComments) {
    return null;
  }

  const currentComments = data?.pages?.map((page) => page.data).flat() ?? [];

  return (
    <>
      {defaultComments.length > 0
        ? defaultComments.map((comment) => {
            return <Comment key={comment.comment_id} comment={comment} />;
          })
        : null}
      {diplayComments && (isLoading || isFetching) && (
        <div data-testid="comments-from-post">
          {new Array(Math.min(currentPost.comments.length, 20))
            .fill(<SkeletonComment key={0} />)
            .map((_, i) => (
              <SkeletonComment key={i} />
            ))}
        </div>
      )}
      {!diplayComments && (
        <p
          className="my-2 cursor-pointer text-sm font-medium text-neutral-500"
          onClick={() => setDiplayComments(!diplayComments)}
          data-testid="view-all-comments">
          View all {currentPost.comments.length} comments
        </p>
      )}
      {diplayComments && (
        <div data-testid="comments-from-post">
          {currentComments.map((comment) => {
            return <Comment key={comment.comment_id} comment={comment} />;
          })}
          <div ref={ref}>{isFetchingNextPage ? <SkeletonComment /> : null}</div>
        </div>
      )}
    </>
  );
};
