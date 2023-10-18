import React, { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { getPostsByUserId } from "../@/lib/fetch/utils";
import { PostType, User } from "../@/lib/types";

import ProfilePost from "../@/components/ProfilePost";
import { ProfileHeader } from "../@/components/ProfileHeader";
import { Icons } from "../@/components/ui/icons";
import { useParams } from "react-router-dom";
import supabase from "../supabase";

const Profile = () => {
  // const { userProfile } = useAuthStore();
  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(
    null
  );
  const [currentUserPosts, setCurrentUserPosts] = useState<PostType[]>([]);

  const { id: userId } = useParams();

  useEffect(() => {
    if (!userId) {
      return;
    }
    const fetchUserProfile = async () => {
      const { data: userProfile, error: userError } = await supabase
        .from("profiles")
        .select("*, posts(*)")
        .eq("user_id", userId)
        .single();

      if (userError) {
        console.error(userError);
        return;
      }

      setCurrentUserProfile(userProfile);

      const userPosts = userProfile?.posts ?? [];
      setCurrentUserPosts(userPosts);
    };

    fetchUserProfile();
  }, [userId]);

  console.log(currentUserPosts);

  if (!currentUserProfile) {
    return null;
  }
  return (
    <main className="py-6 px-4 mx-auto min-w-[320px] max-w-[832px] ">
      <div className="mt-20 h-full">
        <ProfileHeader
          {...{
            user: currentUserProfile,
            nbOfPosts: currentUserPosts.length,
          }}
        >
          <button className="text-sm font-semibold text-[#0095f6]">
            Edit Profile
          </button>
        </ProfileHeader>
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
            <ProfilePost
              currentUserProfile={currentUserProfile}
              key={post.id}
              post={post}
            />
          ))}
        </div>
      </div>
    </main>
  );
};
export default Profile;
