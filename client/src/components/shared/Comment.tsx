import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getContrastingColor,
  getDateFromNow,
  stringToColour,
} from "@/lib/utils";

import type { IComment } from "@/lib/types";
import { usePostContext } from "@/context/PostContext";
import { useDeleteComment } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { Trash2 } from "lucide-react";

interface Props {
  comment: IComment;
}

export const Comment = ({ comment }: Props) => {
  const { currentPost } = usePostContext();
  const { user: currentUser } = useUserContext();
  const bgColour = stringToColour(comment.user.name);
  const color = getContrastingColor(bgColour);

  const { mutate: deleteComment } = useDeleteComment();
  if (!currentPost) return null;

  const isAuthor = comment?.user_id === currentUser?.id;
  return (
    <div
      data-testid="comments-on-post"
      className="flex mb-4"
      key={`post-comment-${comment.comment_id}`}>
      <div className={`min-h-10  rounded-full`}>
        <Avatar className="w-8 h-8 flex items-center align-middle">
          <AvatarImage
            src={comment.user.avatar}
            alt={comment.user?.name + "_avatar"}
          />
          <AvatarFallback
            className={`text-md font-bold w-full h-full flex items-center justify-center text-center`}
            style={{ backgroundColor: bgColour, color }}>
            <span>{comment.user?.name?.[0]}</span>
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="ml-3 w-full">
        <div className="flex group/edit">
          <span className="text-sm font-semibold text-gray-800 mr-1">
            {comment.user.name}
          </span>
          <span className="text-black text-sm break-words">{comment.text}</span>
          <div className="invisible group-hover/edit:visible ml-auto ">
            {isAuthor ? (
              <Trash2
                className=" w-4 h-4 "
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
