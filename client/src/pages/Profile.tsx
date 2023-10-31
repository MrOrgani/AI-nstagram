import ProfilePost from "@/components/shared/ProfilePost";
import { ProfileHeader } from "@/components/shared/ProfileHeader";
import { Icons } from "@/components/ui/icons";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfilePostDialogTriggerSkeleton } from "@/components/shared/ProfilePostDialogTriggerSkeleton";
import { ProfileHeaderSkeleton } from "../components/shared/ProfileHeaderSkeleton";
import { useGetUserById } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

const Profile = () => {
  const { id: userId } = useParams();
  const { user } = useUserContext();

  const { data: currentUser, isLoading } = useGetUserById(userId ?? "");

  if (!currentUser) {
    return null;
  }

  if (isLoading) {
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
  const isMyProfile = user?.id === userId;

  return (
    <main className="py-6 px-4 mx-auto min-w-[320px] w-[832px] ">
      <div className="mt-20 h-full ">
        <ProfileHeader
          {...{
            user: currentUser,
            nbOfPosts: currentUser?.posts?.length,
          }}>
          {isMyProfile && (
            <Link to={`/${currentUser?.id}/edit`}>
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
          {currentUser.posts
            ?.sort((a, b) => b.created_at.localeCompare(a.created_at))
            .map((post) => (
              <ProfilePost
                currentUserProfile={currentUser}
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
