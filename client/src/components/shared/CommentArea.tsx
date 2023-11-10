import { forwardRef, useState } from "react";
import LoginModal from "./LoginModal";
import { auto_grow, cn } from "@/lib/utils";
import { usePostContext } from "@/context/PostContext";
import { useUserContext } from "@/context/AuthContext";
import { useCommentPost } from "@/lib/react-query/queries";

const CommentArea = forwardRef<HTMLTextAreaElement>((_, ref) => {
  const [comment, setComment] = useState("");
  const { user: userProfile } = useUserContext();
  const { currentPost } = usePostContext();

  const { mutate: commentPost } = useCommentPost();

  const [loginDialog, setLoginDialog] = useState(false);
  const setLoginDialogCallback = (value: boolean) => setLoginDialog(value);

  const handlePost = async () => {
    if (!userProfile) {
      setLoginDialog(true);
      return;
    }

    try {
      if (!currentPost) return;
      commentPost({
        postId: currentPost.id,
        userId: userProfile?.id,
        text: comment,
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
    <div className=" mx-2 flex items-center justify-between py-2 text-sm ">
      {loginDialog ? (
        <LoginModal
          initialDisplay={true}
          displayButton={false}
          onClose={() => setLoginDialogCallback(false)}
        />
      ) : null}
      <textarea
        maxLength={1000}
        id={`comment_area_${currentPost.id}`}
        className={cn("static h-5 w-full resize-none leading-5 outline-none")}
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
        onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => auto_grow(e)}
        ref={ref}
      />
      {comment.length ? (
        <div
          className="mr-1 cursor-pointer font-bold text-blue-400"
          onClick={handlePost}>
          Post
        </div>
      ) : null}
    </div>
  );
});

export default CommentArea;
