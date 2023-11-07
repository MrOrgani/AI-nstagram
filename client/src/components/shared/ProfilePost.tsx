import { useRef } from "react";
import supabase from "@/lib/supabase";

import { PostType } from "@/lib/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getDateFromNow } from "@/lib/utils";
import CommentArea from "./CommentArea";
import { PostProvider } from "@/context/PostContext";

import type { IUser } from "@/lib/types";
import { PostIconsHeader } from "./PostIconsHeader";
import NumberOfLikesDisplay from "./NumberOfLikesDisplay";
import { SmallAvatar } from "./SmallAvatar";
import { CommentsDisplay } from "./CommentsDisplay";
import { useGetPostById } from "@/lib/react-query/queries";
import { Heart, MessageCircle } from "lucide-react";

const ProfilePostDialogTrigger = ({ post }: { post: PostType }) => {
  const imgSrc = post.photo.includes("base64")
    ? post.photo
    : supabase.storage.from("ai-stagram-bucket").getPublicUrl(post.photo).data
        .publicUrl;
  return (
    <DialogTrigger asChild>
      <div key={post.id} className="group p-0 cursor-pointer relative ">
        <div className="hidden group-hover:flex absolute align-middle justify-center items-center left-0 right-0 top-0 bottom-0">
          <span className="z-10  text-white flex  items-center">
            <Heart className=" w-11  " color={"white"} />
            {post.likes}
            <MessageCircle className=" w-11 z-10 " color={"white"} />
            {post.comments}
          </span>
          <div className=" bg-black opacity-30 absolute left-0 right-0 top-0 bottom-0" />
        </div>
        <img src={imgSrc} alt={post.prompt} loading="lazy" />
      </div>
    </DialogTrigger>
  );
};

interface Props {
  post: PostType;
  currentUserProfile: IUser;
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

  const imgSrc = post.photo.includes("base64")
    ? post.photo
    : supabase.storage.from("ai-stagram-bucket").getPublicUrl(post.photo).data
        .publicUrl;

  const { data: currentPost } = useGetPostById(post.id);

  if (!currentPost) {
    return null;
  }
  return (
    <PostProvider post={currentPost}>
      <Dialog>
        <ProfilePostDialogTrigger post={currentPost} />
        <DialogContent className="w-56 max-w-6xl p-0 overflow-hidden h-[500px] bg-white shadow-feed-post">
          <article className=" flex overflow-auto">
            <div className="w-1/2 grow flex content-center justify-center items-center  border-r-2 border-[#EFEFEF] ">
              <div className="h-full overflow-hidden flex items-center justify-center">
                <img
                  className=" h-full object-cover"
                  src={imgSrc}
                  alt={post.prompt}
                />
              </div>
            </div>
            <div className=" contents">
              <div className="flex flex-col w-[475px]  mx-0 my-0 relative ">
                <header className="flex p-3 content-center items-center border-b border-[#EFEFEF] ">
                  <SmallAvatar user={currentUserProfile} />
                  <div className="font-semibold text-sm ml-3 b">
                    {currentUserProfile.name}
                  </div>
                </header>

                <div className="grow overflow-auto  p-3 ">
                  <CommentsDisplay
                    defaultComments={[postDecription]}
                    defaultDisplayComments={true}
                  />
                </div>
                <div className="  border-t border-[#EFEFEF] px-3 mt-1 ">
                  <PostIconsHeader {...{ handleIconClick }} />
                  <div className="flex items-center space-x-2 -mb-2 ">
                    <NumberOfLikesDisplay />
                  </div>
                  <p className=" text-neutral-400 text-xs mb-2 ">
                    {getDateFromNow(post.created_at)}
                  </p>
                </div>
                <div className=" border-t px-2 py-3">
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
