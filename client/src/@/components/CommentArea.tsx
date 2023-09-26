import React, { useState } from "react";
import { IoHappyOutline } from "react-icons/io5";
import supabase from "../../supabase";
import type { PostType } from "../lib/types";
import useAuthStore from "../../store/authStore";

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

  const handlePost = async () => {
    const { data, error } = await supabase.from("comments").insert([
      {
        post_id: currentPost.id,
        user_id: userProfile?.id,
        text: comment,
      },
    ]);
    console.log("handlePost", data, error);
  };

  return (
    <>
      <IoHappyOutline className="text-2xl" />
      <textarea
        id={`comment_area_${currentPost.id}`}
        className="outline-none w-full resize-none h-5 leading-5"
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
