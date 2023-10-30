import useAuthStore from "../store/authStore";
import { PostType, ProfileType } from "../@/lib/types";

import ProfilePost from "../components/ProfilePost";
import { ProfileHeader } from "../components/ProfileHeader";
import { Icons } from "../components/ui/icons";
import { Link, useParams } from "react-router-dom";
import supabase from "../supabase";
import { Button } from "../components/ui/button";
import { ProfilePostDialogTriggerSkeleton } from "../components/ProfilePostDialogTriggerSkeleton";
import { ProfileHeaderSkeleton } from "./ProfileHeaderSkeleton";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  const { data: currentUserProfile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          `
        *, 
        posts(*,likedByUser:likes(id:user_id))
        `
        )
        .eq("user_id", userId)
        .single<ProfileType & { posts: PostType[] }>();

      if (error) {
        throw new Error(error.message);
      }
      return profile;
    },
  });

  const { userProfile } = useAuthStore();
  // const [currentUserPosts, setCurrentUserPosts] = useState<PostType[]>([]);

  const { id: userId } = useParams();

  // useEffect(() => {
  //   const postChannel = supabase
  //     .channel("posts")
  //     .on(
  //       "postgres_changes",
  //       { event: "INSERT", schema: "public", table: "posts" },
  //       async (payload) => {
  //         if (payload.new.user_id === userProfile?.id) {
  //           try {
  //             const { data: newPost } = await supabase
  //               .from("posts")
  //               .select(
  //                 `*,
  //             user:user_id (*,id:user_id),
  //             likedByUser:likes(id:user_id)
  //             `
  //               )
  //               .eq("id", payload.new.id)
  //               .single();
  //             // setCurrentUserPosts([newPost, ...currentUserPosts]);
  //           } catch (err) {
  //             console.log(err);
  //           }
  //         }
  //       }
  //     )
  //     .subscribe();
  //   return () => {
  //     supabase.removeChannel(postChannel);
  //   };
  // }, []);

  if (isLoading || !currentUserProfile) {
    return (
      <main className="py-6 px-4 mx-auto min-w-[320px] max-w-[832px] ">
        <div className="mt-20 h-full">
          <ProfileHeaderSkeleton />

          <div className="border-t border-[#dbdbdb] flex justify-center">
            <a className="flex items-center uppercase h-[52px]">
              <Icons.grid />
              <span className="ml-1.5 text-xs font-semibold tracking-wide">
                posts
              </span>
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {new Array(4).fill(0).map((_, i) => (
              <ProfilePostDialogTriggerSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const isMyProfile = userProfile?.id === userId;

  return (
    <main className="py-6 px-4 mx-auto min-w-[320px] w-[832px] ">
      <div className="mt-20 h-full ">
        <ProfileHeader
          {...{
            user: currentUserProfile,
            nbOfPosts: currentUserProfile?.posts?.length,
          }}>
          {isMyProfile && (
            <Link to={`/${userProfile?.id}/edit`}>
              <Button className="text-sm font-semibold text-black bg-gray-200 ml-5 px-2 h-8 hover:bg-gray-300">
                Edit Profile
              </Button>
            </Link>
          )}
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
          {currentUserProfile.posts
            ?.sort((a, b) => b.created_at.localeCompare(a.created_at))
            .map((post) => (
              <ProfilePost
                currentUserProfile={currentUserProfile}
                key={post.id}
                post={post}
              />
            )) ?? []}
        </div>
      </div>
    </main>
  );
};
export default Profile;
