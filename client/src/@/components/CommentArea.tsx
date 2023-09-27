import React, { useEffect, useState } from "react";
import { IoHappyOutline } from "react-icons/io5";
import supabase from "../../supabase";
import type { PostType } from "../lib/types";
import useAuthStore from "../../store/authStore";
import LoginModal from "./LoginModal";
import { cn } from "../lib/utils";

interface Props {
  currentPost: PostType;
}

function auto_grow(event) {
  const element = document.getElementById(event.target.id);
  if (!element) return;

  const currentHeight = parseInt(element.style.height);
  if (isNaN(currentHeight) || currentHeight < 240) {
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  }
}

const CommentArea = ({ currentPost }: Props) => {
  const [comment, setComment] = useState("");
  const { userProfile } = useAuthStore();

  const [loginDialog, setLoginDialog] = useState(false);

  const handlePost = async () => {
    if (!userProfile) {
      setLoginDialog(true);
      return;
    }
    const { data, error } = await supabase.from("comments").insert([
      {
        post_id: currentPost.id,
        user_id: userProfile?.id,
        text: comment,
      },
    ]);
    console.log("handlePost", data, error);
  };

  const setLoginDialogCallback = (value: boolean) => setLoginDialog(value);
  return (
    <>
      {loginDialog ? (
        <LoginModal
          initialDisplay={true}
          displayButton={false}
          onClose={() => setLoginDialogCallback(false)}
        />
      ) : null}
      <IoHappyOutline className="text-2xl" />
      <textarea
        id={`comment_area_${currentPost.id}`}
        className={cn("outline-none w-full resize-none h-5 leading-5 static")}
        placeholder="Add a comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
        onInput={(e) => auto_grow(e)}
      />
      <div
        className="text-blue-400 font-bold mr-1 cursor-pointer"
        onClick={handlePost}
      >
        Post
      </div>
    </>
  );
};

export default CommentArea;
