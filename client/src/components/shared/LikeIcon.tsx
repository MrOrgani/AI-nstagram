import { useState } from "react";
import LoginModal from "./LoginModal";
import { usePostContext } from "@/context/PostContext";
import { useUserContext } from "@/context/AuthContext";
import { useDislikePost, useLikePost } from "@/lib/react-query/queries";
import { Heart } from "lucide-react";

export const LikeIcon = () => {
  const { user: userProfile } = useUserContext();
  const { currentPost, update } = usePostContext();

  const { mutate: likePost } = useLikePost();
  const { mutate: dislikePost } = useDislikePost();

  const [loginDialog, setLoginDialog] = useState(false);
  const setLoginDialogCallback = (value: boolean) => setLoginDialog(value);

  const isLikedByUser = currentPost?.likedByUser?.find(
    (user) => user.id === userProfile?.id
  );

  const handleLikePost = () => {
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
      likePost({ postId: currentPost.id, userId: userProfile?.id });
    }
  };

  const handleDislikePost = async () => {
    if (!userProfile) {
      setLoginDialog(true);
      return null;
    }

    if (currentPost) {
      const currentUserLikeIndex = currentPost.likedByUser.findIndex(
        (user) => user.id === userProfile?.id
      );

      currentPost.likedByUser.splice(currentUserLikeIndex, 1);
      update({
        ...currentPost,
        likes: Math.max(currentPost.likes - 1, 0),
      });
      dislikePost({ postId: currentPost.id, userId: userProfile?.id });
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
        <Heart
          className="cursor-pointer fill-red-500 text-red-500 transition-all active:scale-75"
          onClick={handleDislikePost}
        />
      ) : (
        <Heart
          className="cursor-pointer transition-all hover:opacity-50 active:scale-75"
          onClick={handleLikePost}
        />
      )}
    </div>
  );
};
