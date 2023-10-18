import React, { useEffect, useRef, useState } from "react";
import { IoChatbubbleSharp, IoHeartSharp } from "react-icons/io5";
import supabase from "../../supabase";

import { PostType } from "../lib/types";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import useAuthStore from "../../store/authStore";
import {
  getDateFromNow,
  getFormatedDate,
  getShortenedDateFromNow,
} from "../lib/utils";
import { getCommentsFromPostId } from "../lib/fetch/utils";
import CommentArea from "./CommentArea";
import { PostProvider } from "../context/PostContext";

import type { Comment, User } from "../lib/types";
import { CommentsList } from "./CommentsList";
import { PostIconsHeader } from "./PostIconsHeader";
import NumberOfLikesDisplay from "./NumberOfLikesDisplay";
import { SmallAvatar } from "./SmallAvatar";

interface Props {
  post: PostType;
  currentUserProfile: User;
}

const ProfilePost = ({ post, currentUserProfile }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleIconClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    if (post.comments < 1) {
      return;
    }
    const fetchComments = async () => {
      const data = await getCommentsFromPostId(post?.id);
      setComments(data ?? []);
    };

    fetchComments();
  }, [post.comments, post?.id]);

  const postDecription = {
    comment_id: `${post.id}`,
    created_at: post.created_at,
    user_id: currentUserProfile?.id,
    text: post.prompt,
    post_id: post.id,
    user: currentUserProfile,
  };

  return (
    <PostProvider post={post}>
      <Dialog>
        <DialogTrigger asChild>
          <div key={post.id} className="group p-0 cursor-pointer relative ">
            <div className="hidden group-hover:flex absolute align-middle justify-center items-center left-0 right-0 top-0 bottom-0">
              <span className="z-10  text-white flex  items-center">
                <IoHeartSharp className=" w-11  " color={"white"} />
                {post.likes}
                <IoChatbubbleSharp className=" w-11 z-10 " color={"white"} />
                {post.comments}
              </span>
              <div className=" bg-black opacity-30 absolute left-0 right-0 top-0 bottom-0" />
            </div>
            <img
              src={
                supabase.storage
                  .from("ai-stagram-bucket")
                  .getPublicUrl(post.photo).data.publicUrl
              }
              alt={post.prompt}
            />
          </div>
        </DialogTrigger>
        <DialogContent className="w-56 max-w-6xl p-0 overflow-hidden h-full">
          <article className="max-h-[calc(100vh - 40px)] flex ">
            <div className="max-w-1/2 ">
              <div className="w-full h-full">
                <img
                  className=" w-full h-full object-cover"
                  src={
                    supabase.storage
                      .from("ai-stagram-bucket")
                      .getPublicUrl(post.photo).data.publicUrl
                  }
                  alt={post.prompt}
                />
              </div>
            </div>
            <div className="flex flex-col min-w-[400px]  mx-0 my-0 relative h-full">
              <header className="flex p-3 align-middle items-center border-b border-[#EFEFEF] ">
                <SmallAvatar user={currentUserProfile} />
                <div className="font-semibold text-sm ml-3 b">
                  {currentUserProfile.name}
                </div>
              </header>

              <div className="flex  flex-col  overflow-auto h-full ">
                <div className="flex-grow-[2] overflow-auto h-[650px] p-3 ">
                  <CommentsList comments={[postDecription, ...comments]} />
                </div>

                <div className="  border-t border-[#EFEFEF] px-3 mt-1">
                  <PostIconsHeader
                    {...{ handleIconClick, currentPost: post }}
                  />
                  <div className="flex items-center space-x-2 -mb-2">
                    <NumberOfLikesDisplay />
                  </div>
                  <p
                    className=" text-neutral-400 text-sm mb-2"
                    style={{ fontSize: 12 }}
                  >
                    {getDateFromNow(post.created_at)}
                  </p>
                </div>
                <div className="min-h-[40px] border-t px-2">
                  <CommentArea ref={textareaRef} />
                </div>
              </div>
            </div>
          </article>
        </DialogContent>
      </Dialog>
    </PostProvider>
  );
};
export default ProfilePost;
