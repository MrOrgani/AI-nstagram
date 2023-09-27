import useAuthStore from "../../store/authStore";
import type { PostType } from "../lib/types";
import supabase from "../../supabase";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

interface Props {
  currentPost: PostType;
}

const LikeIcon = ({ currentPost }: Props) => {
  const { userProfile } = useAuthStore();

  const isLikedByUser = currentPost.likedByUser.find(
    (user) => user.id === userProfile?.id
  );

  const likePost = async (post_id: string) => {
    if (!userProfile) return null;
    const { data, error } = await supabase.from("likes").insert([
      {
        post_id,
        user_id: userProfile?.id,
      },
    ]);

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
    }
  };

  return (
    <>
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
