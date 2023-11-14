import React from "react";
import { SmallAvatar } from "./SmallAvatar";
import { IUser } from "@/lib/types";

interface Props {
  user: IUser;
  nbOfPosts: number;
  children: React.ReactNode;
}

export const ProfileHeader: React.FC<Props> = ({
  user,
  nbOfPosts,
  children,
}) => {
  return (
    <header className="flex h-[182px]">
      <div className="mr-7 flex grow-[1] items-center justify-center rounded-full ">
        <div className="flex ">
          <SmallAvatar user={user} className="h-[150px] w-[150px]" />
        </div>
      </div>
      <section className="mt-4 flex grow-[2] flex-col ">
        <div className="mb-5 flex flex-col text-xl  font-normal md:flex-row ">
          <span className="text-ellipsis ">{user.name}</span>
          {children}
        </div>
        <span className="text-base">
          <span className="font-semibold">{nbOfPosts}</span> posts
        </span>
      </section>
    </header>
  );
};
