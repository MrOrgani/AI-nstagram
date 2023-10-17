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

import type { Comment } from "../lib/types";
import { CommentsList } from "./CommentsList";
import { PostIconsHeader } from "./PostIconsHeader";
import NumberOfLikesDisplay from "./NumberOfLikesDisplay";
import { SmallAvatar } from "./SmallAvatar";

interface Props {
  post: PostType;
}

const ProfilePost = ({ post }: Props) => {
  const { userProfile } = useAuthStore();
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

  return (
    <PostProvider post={post}>
      <Dialog>
        <DialogTrigger asChild>
          <div key={post.id} className="group p-0 cursor-pointer relative">
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
        <DialogContent className="w-full max-w-5xl p-0 overflow-hidden">
          <article className="max-h-[calc(100vh - 40px)] h-full flex ">
            <div className="grow-[1] aspect-[3/4] relative w-full">
              <img
                className="object-cover w-full h-full absolute top-0 left-0"
                src={
                  supabase.storage
                    .from("ai-stagram-bucket")
                    .getPublicUrl(post.photo).data.publicUrl
                }
                alt={post.prompt}
              />
            </div>
            <div className="flex flex-col min-w-[400px] ">
              <header className="flex p-3 align-middle items-center border-b border-[#EFEFEF]">
                <SmallAvatar user={post.user} />
                <div className="font-semibold text-sm ml-3 b">
                  {post?.user?.name}
                </div>
              </header>
              <div className=" p-3">
                <div className="grow max-h-[500px] min-w-[calc(100%-32px)] overflow-auto">
                  <CommentsList
                    comments={[
                      {
                        comment_id: `${post.id}`,
                        created_at: post.created_at,
                        user_id: post.user.id,
                        text: post.prompt,
                        post_id: post.id,
                        user: post.user,
                      },
                    ]}
                  />
                  {comments.length > 0 && <CommentsList comments={comments} />}
                </div>
                <PostIconsHeader {...{ handleIconClick, currentPost: post }} />
                <div className="flex items-center space-x-2">
                  <NumberOfLikesDisplay />
                </div>
                <p
                  className=" text-neutral-400 text-sm"
                  style={{ fontSize: 12 }}
                >
                  {getDateFromNow(post.created_at)}
                </p>
              </div>
              <CommentArea />
            </div>
          </article>
        </DialogContent>
      </Dialog>
    </PostProvider>
  );
};
export default ProfilePost;
