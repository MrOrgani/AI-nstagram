import { useRef } from "react";
import { IoChatbubbleSharp, IoHeartSharp } from "react-icons/io5";
import supabase from "../../supabase";

import { PostType } from "../lib/types";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { getDateFromNow } from "../lib/utils";
import CommentArea from "./CommentArea";
import { PostProvider, usePostContext } from "../context/PostContext";

import type { User } from "../lib/types";
import { PostIconsHeader } from "./PostIconsHeader";
import NumberOfLikesDisplay from "./NumberOfLikesDisplay";
import { SmallAvatar } from "./SmallAvatar";
import CommentsDisplay from "./CommentsDisplay";

const ProfilePostDialogTrigger = () => {
  const { currentPost: post } = usePostContext();
  return (
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
            supabase.storage.from("ai-stagram-bucket").getPublicUrl(post.photo)
              .data.publicUrl
          }
          alt={post.prompt}
        />
      </div>
    </DialogTrigger>
  );
};

interface Props {
  post: PostType;
  currentUserProfile: User;
}

const ProfilePost = ({ post, currentUserProfile }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleIconClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

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
        <ProfilePostDialogTrigger />
        <DialogContent className="w-56 max-w-6xl p-0 overflow-hidden h-full">
          <article className=" flex ">
            <div className="w-1/2 grow flex content-center justify-center items-center">
              <div className="h-full overflow-hidden">
                <img
                  className=" h-full object-cover"
                  src={
                    supabase.storage
                      .from("ai-stagram-bucket")
                      .getPublicUrl(post.photo).data.publicUrl
                  }
                  alt={post.prompt}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="grow flex flex-col w-[475px]  mx-0 my-0 relative h-[867px] ">
                <header className="flex p-3 content-center items-center border-b border-[#EFEFEF] ">
                  <SmallAvatar user={currentUserProfile} />
                  <div className="font-semibold text-sm ml-3 b">
                    {currentUserProfile.name}
                  </div>
                </header>

                <div className="flex  flex-col  overflow-auto h-full ">
                  <div className=" flex-grow-[100] shrink overflow-auto  p-3 ">
                    <CommentsDisplay
                      defaultComments={[postDecription]}
                      defaultDisplayComments={true}
                    />
                  </div>
                  <div className="  border-t border-[#EFEFEF] px-3 mt-1">
                    <PostIconsHeader
                      {...{ handleIconClick, currentPost: post }}
                    />
                    <div className="flex items-center space-x-2 -mb-2">
                      <NumberOfLikesDisplay />
                    </div>
                    <p className=" text-neutral-400 text-xs mb-2">
                      {getDateFromNow(post.created_at)}
                    </p>
                  </div>
                  <div className="grow border-t px-2 py-3 ">
                    <CommentArea ref={textareaRef} />
                  </div>
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
