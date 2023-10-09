import { IoChatbubbleOutline } from "react-icons/io5";

import { HiArrowDownTray } from "react-icons/hi2";
import { downloadImage, getDateFromNow } from "../lib/utils";
import type { PostType } from "../lib/types";
import LikeIcon from "./LikeIcon";
import CommentArea from "./CommentArea";
import CommentsDisplay from "./CommentsDisplay";
import { useRef } from "react";
import { PostProvider } from "../context/PostContext";
import NumberOfLikesDisplay from "./NumberOfLikesDisplay";
import supabase from "../../supabase";

const Post = ({ currentPost }: { currentPost: PostType }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleIconClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  return (
    <PostProvider post={currentPost}>
      <div className="border bg-white rounded-xl mb-4">
        {/* <PostCardContextMenu
        open={contextMenuOpen}
        setOpen={setContextMenuOpen}
      /> */}

        <div className="flex items-center justify-between p-2.5">
          <div className="flex items-center">
            {currentPost.user?.avatar ? (
              <div className="h-10 w-10 bg-neutral-200 rounded-full">
                <img
                  src={currentPost.user?.avatar}
                  alt={currentPost.user?.name + "avatar"}
                  className="rounded-full"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-green-700 flex justify-center items-center text-white text-md font-bold">
                {currentPost.user?.name?.[0]}
              </div>
            )}
            <div className="ml-2.5">
              <p className="font-medium text-sm">{currentPost.user?.name}</p>
            </div>
          </div>
        </div>
        <div className="w-full bg-neutral-200">
          <img
            src={
              supabase.storage
                .from("ai-stagram-bucket")
                .getPublicUrl(currentPost.photo).data.publicUrl
            }
            alt={currentPost.prompt}
            className="w-full h-full"
          />
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between text-2xl">
            <div className="flex items-center space-x-4">
              <LikeIcon />
              <IoChatbubbleOutline
                className="cursor-pointer hover:opacity-50"
                onClick={handleIconClick}
              />
            </div>
            <HiArrowDownTray
              className="cursor-pointer hover:opacity-50"
              onClick={() => downloadImage(currentPost.id, currentPost.photo)}
            />
          </div>
          <div className="flex items-center my-3 space-x-2">
            <NumberOfLikesDisplay />
          </div>
          <div className="text-sm my-2">
            <span className=" font-semibold inline-block mr-2">
              {currentPost.user?.name}
            </span>
            <span>{currentPost.prompt}</span>
          </div>
          <CommentsDisplay />

          <p className="my-2 text-neutral-400 text-sm" style={{ fontSize: 12 }}>
            {getDateFromNow(currentPost.created_at)}
          </p>
        </div>
        <div className="border-t p-3 text-sm flex items-center justify-between space-x-3">
          <CommentArea ref={textareaRef} />
        </div>
      </div>
    </PostProvider>
  );
};

export default Post;
