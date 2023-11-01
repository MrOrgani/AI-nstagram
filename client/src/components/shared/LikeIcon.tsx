import supabase from "@/lib/supabase";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { useState } from "react";
import LoginModal from "./LoginModal";
import { usePostContext } from "@/context/PostContext";
import { useUserContext } from "@/context/AuthContext";

const LikeIcon = () => {
  const { user: userProfile } = useUserContext();
  const { currentPost, update } = usePostContext();

  const [loginDialog, setLoginDialog] = useState(false);
  const setLoginDialogCallback = (value: boolean) => setLoginDialog(value);

  const isLikedByUser = currentPost?.likedByUser?.find(
    (user) => user.id === userProfile?.id
  );

  const likePost = async (post_id: number) => {
    if (!userProfile) {
      setLoginDialog(true);
      return null;
    }
    if (currentPost) {
      update({
        ...currentPost,
        likes: currentPost.likes + 1,
        likedByUser: [
          { id: userProfile?.id },
          ...(currentPost?.likedByUser || []),
        ],
      });
      const { error } = await supabase.functions.invoke("likePost", {
        body: JSON.stringify({
          post_id,
          user_id: userProfile?.id,
        }),
      });
      if (error) {
        console.log(error.message);
      }
    }
  };
  const unlikePost = async (post_id: number) => {
    if (currentPost) {
      const currentUserLikeIndex = currentPost.likedByUser.findIndex(
        (user) => user.id === userProfile?.id
      );

      currentPost.likedByUser.splice(currentUserLikeIndex, 1);
      update({
        ...currentPost,
        likes: Math.max(currentPost.likes - 1, 0),
      });
      const { error } = await supabase.functions.invoke("unlikePost", {
        body: JSON.stringify({
          post_id,
          user_id: userProfile?.id,
        }),
      });
      if (error) {
        console.log(error.message);
      }
    }
  };

  if (!currentPost) {
    return null;
  }

  return (
    <div className="p-2 -m-2">
      {loginDialog ? (
        <LoginModal
          initialDisplay={true}
          displayButton={false}
          onClose={() => setLoginDialogCallback(false)}
        />
      ) : null}
      {isLikedByUser ? (
        <IoHeart
          className="cursor-pointer text-red-500 transition-all active:scale-75"
          onClick={() => unlikePost(currentPost.id)}
        />
      ) : (
        <IoHeartOutline
          className="cursor-pointer transition-all hover:opacity-50 active:scale-75"
          onClick={() => likePost(currentPost.id)}
        />
      )}
    </div>
  );
};

export default LikeIcon;
