import React, { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { getPostsByUserId } from "../@/lib/fetch/utils";
import { PostType } from "../@/lib/types";

import DialogPost from "../@/components/DialogPost";
import { ProfileHeader } from "../@/components/ProfileHeader";
import { Icons } from "../@/components/ui/icons";

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
        <ProfileHeader
          {...{
            name: userProfile?.user_metadata?.full_name,
            picture: userProfile?.user_metadata?.picture || userProfile?.avatar,
            nbOfPosts: currentUserPosts.length,
          }}
        />
        <div className="border-t border-[#dbdbdb] flex justify-center">
          <a className="flex items-center uppercase h-[52px]">
            <Icons.grid />
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
