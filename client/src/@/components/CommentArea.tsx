import React, { useState } from "react";
import { IoHappyOutline } from "react-icons/io5";
import supabase from "../../supabase";
import type { PostType } from "../lib/types";
import useAuthStore from "../../store/authStore";
import { Card } from "./ui/card";
import { UserAuthForm } from "./UserAuthFrom";

const LoginModal = () => {
  const { userProfile } = useAuthStore();

  if (userProfile?.id) {
    return null;
  }

  return (
    <div>
      <div className="fixed inset-0 bg-black opacity-50 z-20"></div>
      <Card className="fixed inset-0 flex flex-col items-center justify-center w-1/2 h-1/2 mx-auto my-auto z-50">
        <UserAuthForm className=" z-10" />
      </Card>
    </div>
  );
};

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

  return (
    <>
      {loginDialog ? <LoginModal /> : null}
      <IoHappyOutline className="text-2xl" />
      <textarea
        id={`comment_area_${currentPost.id}`}
        className="outline-none w-full resize-none h-5 leading-5 z-10"
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
