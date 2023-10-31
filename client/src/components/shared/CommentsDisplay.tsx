import { useCallback, useEffect, useState } from "react";

import { usePostContext } from "@/context/PostContext";
import { getCommentsFromPostId } from "@/lib/supabase/api";

import type { Comment } from "@/lib/types";
import { CommentsList } from "./CommentsList";
import { Skeleton } from "@/components/ui/skeleton";

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

const SkeletonComment = () => {
  return (
    <div data-testid="comments-on-post" className="flex mb-4">
      <div className={`min-h-10  rounded-full`}>
        <Skeleton className="w-8 h-8  rounded-full" />
      </div>
      <div className="ml-3">
        <div className="flex">
          <Skeleton className="h-4 w-[50px] mr-1 mb-1" />
          <Skeleton className="h-4 w-[200px] mb-1" />
        </div>
        <Skeleton className="h-4 w-[20px]" />
      </div>
    </div>
  );
};
interface CommentsDisplayProps {
  defaultComments?: Comment[];
  defaultDisplayComments?: boolean;
}

const CommentsDisplay = ({
  defaultComments = [],
  defaultDisplayComments = false,
}: CommentsDisplayProps) => {
  const [diplayComments, setDiplayComments] = useState(defaultDisplayComments);
  const { currentPost, update } = usePostContext();
  const [currentComments, setCurrentComments] =
    useState<Comment[]>(defaultComments);

  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      if (!currentPost) {
        return;
      }

      setLoading(true);
      const comments = await getCommentsFromPostId(currentPost?.id);

      update((prev) => ({
        ...prev,
        commentsByUser: [...defaultComments, ...comments],
      }));
      setCurrentComments(comments ?? []);
      setLoading(false);
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

  const feedPostWithNoComments =
    !defaultDisplayComments && currentPost.comments === 0;

  if (!currentPost || feedPostWithNoComments) {
    return null;
  }

  return (
    <>
      {diplayComments && loading && (
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
          <CommentsList comments={currentComments} />
        </div>
      )}
    </>
  );
};

export default CommentsDisplay;
