import React, { useEffect, useState } from "react";
import { IoChatbubbleSharp, IoHeartSharp } from "react-icons/io5";
import supabase from "../../supabase";

import { PostType } from "../lib/types";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar } from "./ui/avatar";
import useAuthStore from "../../store/authStore";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getFormatedDate, getShortenedDateFromNow } from "../lib/utils";
import { getCommentsFromPostId } from "../lib/fetch/utils";
import CommentArea from "./CommentArea";
import { PostProvider } from "../context/PostContext";

import type { Comment } from "../lib/types";
import { CommentsList } from "./CommentsList";

interface Props {
  post: PostType;
}

const ProfilePost = ({ post }: Props) => {
  const { userProfile } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);

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
        <DialogContent className="w-full max-w-2xl p-0 overflow-hidden">
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
                <Avatar className="w-8 h-8 ">
                  <AvatarImage
                    src={userProfile?.user_metadata?.picture}
                    alt="avatar"
                  />
                  <AvatarFallback>
                    {userProfile?.user_metadata?.full_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="font-semibold text-sm ml-3 b">
                  {userProfile?.user_metadata?.full_name}
                </div>
              </header>
              <div className="grow max-h-[500px] min-w-[calc(100%-32px)] overflow-auto p-3">
                <div className="flex">
                  <Avatar className="w-8 h-8 ">
                    <AvatarImage
                      src={userProfile?.user_metadata?.picture}
                      alt="avatar"
                    />
                    <AvatarFallback>
                      {userProfile?.user_metadata?.full_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-sm ml-3">
                    <div>
                      <span className="font-semibold mr-1">
                        {userProfile?.user_metadata?.full_name}
                      </span>
                      {post.prompt}
                    </div>
                    <time
                      dateTime={post.created_at}
                      title={getFormatedDate(post.created_at, "D MMMM YYYY")}
                      className="text-xs text-[#737373] mt-2 mb-1"
                    >
                      {getShortenedDateFromNow(post.created_at)}
                    </time>
                  </div>
                </div>
                {comments.length > 0 && <CommentsList comments={comments} />}
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
