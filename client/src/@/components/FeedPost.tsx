import type { PostType } from "../lib/types";
import CommentArea from "./CommentArea";
import CommentsDisplay from "./CommentsDisplay";
import { useRef } from "react";
import { PostProvider } from "../context/PostContext";
import NumberOfLikesDisplay from "./NumberOfLikesDisplay";
import { PostIconsHeader } from "./PostIconsHeader";
import { SmallAvatar } from "./SmallAvatar";
import { getShortenedDateFromNow } from "../lib/utils";
import { ImgPost } from "./ImgPost";

const FeedPost = ({ currentPost }: { currentPost: PostType }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleIconClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  return (
    <PostProvider post={currentPost}>
      <div
        data-testid="feed-post"
        className=" bg-white  mb-5 border-b border-b-gray-200"
      >
        <div className="flex items-center justify-between p-2.5">
          <div className="flex items-center">
            <SmallAvatar user={currentPost.user} />
            <div className="ml-2.5">
              <span className="font-medium text-sm">
                {currentPost.user?.name}
              </span>
              <span className="text-neutral-500 text-sm mx-1">•</span>
              <time className=" text-neutral-500 text-sm font-normal">
                {getShortenedDateFromNow(currentPost.created_at)}
              </time>
            </div>
          </div>
        </div>
        <div className="w-full">
          <ImgPost {...currentPost} />
        </div>
        <div className="">
          <PostIconsHeader {...{ handleIconClick, currentPost }} />
          <NumberOfLikesDisplay />
          <div className="text-sm pb-3">
            <span className=" font-semibold inline-block mr-2">
              {currentPost.user?.name}
            </span>
            <span>{currentPost.prompt}</span>
          </div>
          <CommentsDisplay />
        </div>
        <CommentArea ref={textareaRef} />
      </div>
    </PostProvider>
  );
};

export default FeedPost;
