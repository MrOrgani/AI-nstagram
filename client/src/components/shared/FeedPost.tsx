import type { PostType } from "@/lib/types";
import CommentArea from "./CommentArea";
import { CommentsDisplay } from "./CommentsDisplay";
import { useRef } from "react";
import { PostProvider } from "@/context/PostContext";
import NumberOfLikesDisplay from "./NumberOfLikesDisplay";
import { PostIconsHeader } from "./PostIconsHeader";
import { SmallAvatar } from "./SmallAvatar";
import { getDateFromNow } from "@/lib/utils";
import { ImgPost } from "./ImgPost";
import { Link } from "react-router-dom";
import { useGetPostById } from "@/lib/react-query/queries";
import { Card } from "../ui/card";

export const FeedPost = ({ currentPost }: { currentPost: PostType }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleIconClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  const { data } = useGetPostById(currentPost.id);

  if (!data) {
    return null;
  }
  return (
    <PostProvider post={data}>
      <Card
        data-testid="feed-post"
        className=" mb-5 overflow-hidden border-b border-b-gray-200 bg-white shadow-feed-post ">
        <div className="flex items-center justify-between p-2.5">
          <div className="flex items-center">
            <Link to={`/${currentPost.user?.id}`} className="flex items-center">
              <SmallAvatar user={currentPost.user} />
              <span className="ml-2.5 text-sm font-medium ">
                {currentPost.user?.name}
              </span>
            </Link>
            <span className="mx-1 text-sm text-neutral-500">•</span>
            <time className=" text-sm font-normal text-neutral-500">
              {getDateFromNow(currentPost.created_at)}
            </time>
          </div>
        </div>
        <div className="w-full">
          <ImgPost {...currentPost} />
        </div>
        <div className="">
          <PostIconsHeader {...{ handleIconClick }} />
          <NumberOfLikesDisplay />
          <div className="pb-3 text-sm">
            <span className=" mr-2 inline-block font-semibold">
              {currentPost.user?.name}
            </span>
            <span>{currentPost.prompt}</span>
          </div>
          <div className="max-h-80 overflow-auto">
            <CommentsDisplay />
          </div>
        </div>
        <CommentArea ref={textareaRef} />
      </Card>
    </PostProvider>
  );
};
