import { useRef } from "react";

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
  const { comments } = post;
  return (
    <DialogTrigger asChild>
      <div key={post.id} className="group relative cursor-pointer p-0 ">
        <div className="absolute bottom-0 left-0 right-0 top-0 hidden items-center justify-center align-middle group-hover:flex">
          <span className="z-10  flex items-center  text-white">
            <Heart className=" w-11  " color={"white"} />
            {post.likes.length}
            <MessageCircle className=" z-10 w-11 " color={"white"} />
            {comments[0].count}
          </span>
          <div className=" absolute bottom-0 left-0 right-0 top-0 bg-black opacity-30" />
        </div>
        <img src={post.photo} alt={post.prompt} loading="lazy" />
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

  const { data: currentPost } = useGetPostById(post.id);

  if (!currentPost) {
    return null;
  }

  const postDecription = {
    comment_id: `${currentPost.id}`,
    created_at: currentPost.created_at,
    user_id: currentUserProfile?.id,
    text: currentPost.prompt,
    post_id: currentPost.id,
    user: currentUserProfile,
  };

  return (
    <PostProvider post={currentPost}>
      <Dialog>
        <ProfilePostDialogTrigger post={currentPost} />
        <DialogContent className=" w-full max-w-6xl overflow-hidden bg-white p-0 shadow-feed-post">
          <article className="grid grid-cols-2">
            <div className="flex grow content-center items-center justify-center place-self-center border-b-2 border-r-0 border-[#EFEFEF] md:border-b-0 md:border-r-2">
              <div className="flex h-full items-center justify-center overflow-hidden">
                <img
                  className="h-full w-full object-cover md:w-auto"
                  src={currentPost.photo}
                  alt={currentPost.prompt}
                />
              </div>
            </div>
            <div className="contents ">
              <div className="relative mx-0 my-0 flex w-full flex-col">
                <header className="flex content-center items-center border-b border-[#EFEFEF] p-3">
                  <SmallAvatar user={currentUserProfile} />
                  <div className="b ml-3 text-sm font-semibold">
                    {currentUserProfile.name}
                  </div>
                </header>

                <div className="grow overflow-auto p-3">
                  <CommentsDisplay
                    defaultComments={[postDecription]}
                    defaultDisplayComments={true}
                  />
                </div>
                <div className="mt-1 border-t border-[#EFEFEF] px-3">
                  <PostIconsHeader {...{ handleIconClick }} />
                  <div className="-mb-2 flex items-center space-x-2">
                    <NumberOfLikesDisplay />
                  </div>
                  <p className="mb-2 text-xs text-neutral-400">
                    {getDateFromNow(post.created_at)}
                  </p>
                </div>
                <div className="border-t px-2 py-3">
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
