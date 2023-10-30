import { forwardRef, useState } from "react";
import { IoHappyOutline } from "react-icons/io5";
import supabase from "../supabase";
import useAuthStore from "../store/authStore";
import LoginModal from "./LoginModal";
import { auto_grow, cn } from "../lib/utils";
import { usePostContext } from "../context/PostContext";

const CommentArea = forwardRef<HTMLTextAreaElement>((_, ref) => {
  const [comment, setComment] = useState("");
  const { userProfile } = useAuthStore();
  const { currentPost, update } = usePostContext();

  const [loginDialog, setLoginDialog] = useState(false);
  const setLoginDialogCallback = (value: boolean) => setLoginDialog(value);

  const handlePost = async () => {
    if (!userProfile) {
      setLoginDialog(true);
      return;
    }

    try {
      if (!currentPost) return;
      await supabase.functions.invoke("commentPost", {
        body: JSON.stringify({
          post_id: currentPost.id,
          user_id: userProfile?.id,
          text: comment,
        }),
      });
      update({
        ...currentPost,
        commentsByUser: [
          ...(currentPost?.commentsByUser || []),
          {
            comment_id: crypto.randomUUID(),
            created_at: Date.toString(),
            post_id: currentPost.id,
            text: comment,
            user: userProfile,
            user_id: userProfile.id,
          },
        ],
        comments: currentPost.comments + 1,
      });
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  if (!currentPost) {
    return null;
  }

  return (
    <div className=" text-sm flex items-center justify-between space-x-3 ">
      {loginDialog ? (
        <LoginModal
          initialDisplay={true}
          displayButton={false}
          onClose={() => setLoginDialogCallback(false)}
        />
      ) : null}
      <textarea
        id={`comment_area_${currentPost.id}`}
        className={cn("outline-none w-full resize-none h-5 leading-5 static")}
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
        onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => auto_grow(e)}
        ref={ref}
      />
      <IoHappyOutline className="text-2xl" />
      {comment.length ? (
        <div
          className="text-blue-400 font-bold mr-1 cursor-pointer"
          onClick={handlePost}>
          Post
        </div>
      ) : null}
    </div>
  );
});

export default CommentArea;
