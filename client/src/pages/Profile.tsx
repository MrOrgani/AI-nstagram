import React, { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { getPostsByUserId } from "../@/lib/fetch/utils";
import { PostType } from "../@/lib/types";

import DialogPost from "../@/components/DialogPost";

const Profile = () => {
  const { userProfile } = useAuthStore();
  const [currentUserPosts, setCurrentUserPosts] = useState<PostType[]>([]);

  useEffect(() => {
    if (!userProfile) {
      return;
    }
    const getPost = async () => {
      const posts = await getPostsByUserId(userProfile?.id);
      setCurrentUserPosts(posts || []);
    };
    getPost();
  }, [userProfile]);
  return (
    <main className="py-6 px-4 mx-auto min-w-[320px] max-w-[832px] ">
      <div className="mt-20 bg-green-400 h-full">
        <header className="flex mb-11 h-[182px]">
          <div className="rounded-full mr-7 flex justify-center grow-[1] items-center ">
            <div className="flex ">
              <img
                className="h-[150px] w-[150px] rounded-full"
                src={userProfile?.user_metadata?.picture}
                alt="avatar"
              />
            </div>
          </div>
          <section className="grow-[2] flex flex-col mt-4">
            <div className="font-normal text-xl mb-5">
              {userProfile?.user_metadata?.full_name}
            </div>
            <span className="text-base">
              <span className="font-semibold">{currentUserPosts.length}</span>{" "}
              posts
            </span>
          </section>
        </header>
        <div className="border-t border-[#dbdbdb] flex justify-center">
          <a className="flex items-center uppercase h-[52px]">
            <svg
              aria-label=""
              color="rgb(0, 0, 0)"
              fill="rgb(0, 0, 0)"
              height="12"
              role="img"
              viewBox="0 0 24 24"
              width="12"
            >
              <rect
                fill="none"
                height="18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                width="18"
                x="3"
                y="3"
              ></rect>
              <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="9.015"
                x2="9.015"
                y1="3"
                y2="21"
              ></line>
              <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="14.985"
                x2="14.985"
                y1="3"
                y2="21"
              ></line>
              <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="21"
                x2="3"
                y1="9.015"
                y2="9.015"
              ></line>
              <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="21"
                x2="3"
                y1="14.985"
                y2="14.985"
              ></line>
            </svg>
            <span className="ml-1.5 text-xs font-semibold tracking-wide">
              posts
            </span>
          </a>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {currentUserPosts.map((post) => (
            <DialogPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Profile;
