import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  getContrastingColor,
  getShortenedDateFromNow,
  stringToColour,
} from "@/lib/utils";

import type { Comment } from "@/lib/types";

interface Props {
  comments: Comment[];
}

export const CommentsList = ({ comments }: Props) => {
  return comments.map((comment) => {
    const bgColour = stringToColour(comment.user.name);
    const color = getContrastingColor(bgColour);
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
        <div className="ml-3">
          <div>
            <span className="text-sm font-semibold text-gray-800 mr-1">
              {comment.user.name}
            </span>
            <span className="text-black text-sm break-words">
              {comment.text}
            </span>
          </div>
          <p className="text-xs text-[#737373]">
            {getShortenedDateFromNow(comment.created_at)}
          </p>
        </div>
      </div>
    );
  });
};
