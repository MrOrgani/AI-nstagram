import useAuthStore from "../../store/authStore";
import supabase from "../../supabase";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { useState } from "react";
import LoginModal from "./LoginModal";
import { usePostContext } from "../context/PostContext";

const LikeIcon = () => {
  const { userProfile } = useAuthStore();
  const { currentPost, update } = usePostContext();

  const [loginDialog, setLoginDialog] = useState(false);
  const setLoginDialogCallback = (value: boolean) => setLoginDialog(value);

  const isLikedByUser = currentPost?.likedByUser.find(
    (user) => user.id === userProfile?.id
  );

  const likePost = async (post_id: string) => {
    if (!userProfile) {
      setLoginDialog(true);
      return null;
    }
    const { data, error } = await supabase.from("likes").insert([
      {
        post_id,
        user_id: userProfile?.id,
      },
    ]);

    if (!error && currentPost) {
      update({
        ...currentPost,
        likes: currentPost.likes + 1,
      });
    }

    console.log("likedPost", data, error);
  };
  const unlikePost = async (post_id: string) => {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", post_id)
      .eq("user_id", userProfile?.id);

    if (error) {
      console.log(error);
    } else {
      if (currentPost) {
        const currentUserLikeIndex = currentPost.likedByUser.findIndex(
          (user) => user.id === userProfile?.id
        );

        currentPost.likedByUser.splice(currentUserLikeIndex, 1);
        console.log("update unlike");
        update({
          ...currentPost,
          likes: currentPost.likes - 1,
        });
      }
    }
  };

  return (
    <>
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
    </>
  );
};

export default LikeIcon;
