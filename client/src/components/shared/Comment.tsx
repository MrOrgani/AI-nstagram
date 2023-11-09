import { getDateFromNow } from "@/lib/utils";

import type { IComment } from "@/lib/types";
import { usePostContext } from "@/context/PostContext";
import { useDeleteComment } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { Trash2 } from "lucide-react";
import { SmallAvatar } from "./SmallAvatar";

interface Props {
  comment: IComment;
}

export const Comment = ({ comment }: Props) => {
  const { currentPost } = usePostContext();
  const { user: currentUser } = useUserContext();

  const { mutate: deleteComment } = useDeleteComment();
  if (!currentPost) return null;

  const isAuthor = comment?.user_id === currentUser?.id;
  return (
    <div
      data-testid="comments-on-post"
      className="mb-4 flex"
      key={`post-comment-${comment.comment_id}`}>
      <div className={`min-h-10  rounded-full`}>
        <SmallAvatar user={comment.user} />
      </div>
      <div className="ml-3 w-full">
        <div className="group/edit flex">
          <span className="mr-1 text-sm font-semibold text-gray-800">
            {comment.user.name}
          </span>
          <span className="break-words text-sm text-black">{comment.text}</span>
          <div className="invisible ml-auto group-hover/edit:visible ">
            {isAuthor ? (
              <Trash2
                className=" h-4 w-4 "
                onClick={() =>
                  deleteComment({
                    commentId: comment.comment_id,
                    userId: currentUser.id,
                    postId: currentPost.id,
                  })
                }
              />
            ) : null}
          </div>
        </div>
        <p className="text-xs text-[#737373]">
          {getDateFromNow(comment.created_at)}
        </p>
      </div>
    </div>
  );
};
