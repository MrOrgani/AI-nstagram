import ProfilePost from "@/components/shared/ProfilePost";
import { ProfileHeader } from "@/components/shared/ProfileHeader";
import { Icons } from "@/components/ui/icons";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfilePostDialogTriggerSkeleton } from "@/components/shared/ProfilePostDialogTriggerSkeleton";
import { ProfileHeaderSkeleton } from "../components/shared/ProfileHeaderSkeleton";
import { useGetUserById } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

const SkeletonProfile = () => {
  return (
    <main className="mx-auto min-w-[320px] max-w-[832px] px-4 py-6">
      <div className="mt-20 h-full">
        <ProfileHeaderSkeleton />

        <div className="flex justify-center border-t border-[#dbdbdb]">
          <a className="flex h-[52px] items-center uppercase">
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
};

const Profile = () => {
  const { id: userId } = useParams();
  const { user } = useUserContext();

  const { data: currentUser, isLoading } = useGetUserById(userId ?? "");

  if (!currentUser) {
    return null;
  }

  if (isLoading) {
    <SkeletonProfile />;
  }
  const isMyProfile = user?.id === userId;

  return (
    <Card className="mx-auto min-w-[320px] max-w-[832px] bg-white px-4 py-6 shadow-feed-post sm:w-full">
      <div className="h-full">
        <ProfileHeader
          {...{
            user: currentUser,
            nbOfPosts: currentUser?.posts?.length,
          }}>
          {isMyProfile && (
            <Link to={`/${currentUser?.id}/edit`}>
              <Button className="hidden h-8 bg-gray-200 px-2 text-sm font-semibold text-black hover:bg-gray-300 sm:ml-5 sm:block">
                Edit Profile
              </Button>
              <Button className=" flex h-8 items-center justify-center bg-gray-200 px-2 text-sm font-semibold text-black hover:bg-gray-300 sm:ml-5 sm:hidden">
                <Settings />
              </Button>
            </Link>
          )}
        </ProfileHeader>
        <div className="flex justify-center border-t border-[#dbdbdb]">
          <a className="flex h-[52px] items-center uppercase">
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
    </Card>
  );
};
export default Profile;
